import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { Loader2, BarChart3, Wrench, Users } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
}

async function api(path: string) {
  const res = await fetch(`${API}/api/v1${path}`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const Route = createFileRoute("/_layout/department/$id")({
  component: DepartmentDashboard,
  head: () => ({ meta: [{ title: "Department Dashboard - ARIELLE" }] }),
})

interface ToolMetric {
  tool_name: string
  tool_id: string | null
  usage_count: number
  risk_level: string | null
  color: string
}

interface Overview {
  response_count: number
  tool_usage_count: number
  approved_count: number
  review_count: number
  rejected_count: number
  unmatched_count: number
}

const dotColor: Record<string, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  gray: "bg-muted-foreground/40",
}

function DepartmentDashboard() {
  const { id } = Route.useParams()
  const [surveyId, setSurveyId] = useState<string | null>(null)

  const { data: surveys } = useQuery({
    queryKey: ["admin-surveys"],
    queryFn: () => api("/surveys/"),
  })

  const selectedSurvey = surveyId ?? surveys?.data?.[0]?.id

  const { data: overview, isLoading: loadingOverview } = useQuery<Overview>({
    queryKey: ["metrics-overview", selectedSurvey, id],
    queryFn: () => api(`/metrics/overview?survey_id=${selectedSurvey}&scope=department&scope_id=${id}`),
    enabled: !!selectedSurvey,
  })

  const { data: toolMetrics, isLoading: loadingTools } = useQuery<ToolMetric[]>({
    queryKey: ["metrics-tools", selectedSurvey, id],
    queryFn: () => api(`/metrics/tools?survey_id=${selectedSurvey}&scope=department&scope_id=${id}`),
    enabled: !!selectedSurvey,
  })

  const isLoading = loadingOverview || loadingTools

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Department Dashboard</h1>
          <p className="text-muted-foreground">AI tool usage overview</p>
        </div>
        {surveys?.data?.length > 0 && (
          <Select value={selectedSurvey ?? ""} onValueChange={setSurveyId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select survey..." />
            </SelectTrigger>
            <SelectContent>
              {surveys.data.map((s: { id: string; title: string }) => (
                <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard icon={Users} label="Responses" value={overview?.response_count ?? 0} />
            <KpiCard icon={Wrench} label="Tool Mentions" value={overview?.tool_usage_count ?? 0} />
            <KpiCard
              icon={BarChart3}
              label="Approved"
              value={overview?.approved_count ?? 0}
              sub={
                overview && overview.tool_usage_count > 0
                  ? `${Math.round((overview.approved_count / overview.tool_usage_count) * 100)}%`
                  : undefined
              }
            />
            <KpiCard
              icon={BarChart3}
              label="Unmatched"
              value={overview?.unmatched_count ?? 0}
              variant="muted"
            />
          </div>

          {/* Compliance breakdown */}
          {overview && overview.tool_usage_count > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compliance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ComplianceBar overview={overview} />
              </CardContent>
            </Card>
          )}

          {/* Top tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Tools</CardTitle>
              <CardDescription>By usage count, scoped to this department</CardDescription>
            </CardHeader>
            <CardContent>
              {toolMetrics && toolMetrics.length > 0 ? (
                <div className="space-y-3">
                  {toolMetrics.map((t, i) => {
                    const maxCount = toolMetrics[0].usage_count
                    const pct = maxCount > 0 ? (t.usage_count / maxCount) * 100 : 0
                    return (
                      <div key={t.tool_name + i} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${dotColor[t.color] ?? dotColor.gray}`} />
                            <span className="font-medium">{t.tool_name}</span>
                            {t.risk_level && (
                              <span className="text-xs text-muted-foreground">({t.risk_level})</span>
                            )}
                          </div>
                          <span className="tabular-nums text-muted-foreground">{t.usage_count}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              t.color === "green"
                                ? "bg-green-500"
                                : t.color === "yellow"
                                  ? "bg-yellow-500"
                                  : t.color === "red"
                                    ? "bg-red-500"
                                    : "bg-muted-foreground/40"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No tool data</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  variant,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  sub?: string
  variant?: "muted"
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-0">
        <div className={`rounded-lg p-2 ${variant === "muted" ? "bg-muted" : "bg-primary/10"}`}>
          <Icon className={`h-5 w-5 ${variant === "muted" ? "text-muted-foreground" : "text-primary"}`} />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">
            {label}
            {sub && <span className="ml-1 font-medium text-foreground">({sub})</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function ComplianceBar({ overview }: { overview: Overview }) {
  const total = overview.tool_usage_count
  if (total === 0) return null
  const segments = [
    { label: "Approved", count: overview.approved_count, color: "bg-green-500" },
    { label: "Review", count: overview.review_count, color: "bg-yellow-500" },
    { label: "Rejected", count: overview.rejected_count, color: "bg-red-500" },
    { label: "Unmatched", count: overview.unmatched_count, color: "bg-muted-foreground/40" },
  ].filter((s) => s.count > 0)

  return (
    <div className="space-y-3">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {segments.map((s) => (
          <div
            key={s.label}
            className={`${s.color} transition-all`}
            style={{ width: `${(s.count / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
            {s.label}: {s.count} ({Math.round((s.count / total) * 100)}%)
          </div>
        ))}
      </div>
    </div>
  )
}
