import { createFileRoute, Link as RouterLink } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  Loader2,
  BarChart3,
  Wrench,
  Users,
  ArrowLeft,
  Download,
  MessageSquare,
  ListChecks,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  }
}

async function api(path: string) {
  const res = await fetch(`${API}/api/v1${path}`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const Route = createFileRoute("/_layout/surveys/$id")({
  component: SurveyDashboard,
  head: () => ({ meta: [{ title: "Survey Dashboard - ARIELLE" }] }),
})

/* ------------------------------------------------------------------ */
/*  Type definitions                                                   */
/* ------------------------------------------------------------------ */

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

interface SurveyDetail {
  id: string
  title: string
  description: string | null
  status: string
  created_at: string
  published_at: string | null
  closed_at: string | null
}

interface BreakdownItem {
  value: string
  count: number
}

interface QuestionMetric {
  question_id: string
  question_text: string
  question_type: string
  section_title: string
  section_order: number
  question_order: number
  total_answers: number
  breakdown: BreakdownItem[]
  free_text_samples: string[]
}

/* ------------------------------------------------------------------ */
/*  Style maps                                                         */
/* ------------------------------------------------------------------ */

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  draft: "secondary",
  published: "default",
  closed: "outline",
}

const dotColor: Record<string, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  gray: "bg-muted-foreground/40",
}

const TYPE_LABELS: Record<string, string> = {
  single_choice: "Single Choice",
  multi_choice: "Multiple Choice",
  free_text: "Free Text",
  likert: "Likert Scale",
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> =
  {
    single_choice: ListChecks,
    multi_choice: ListChecks,
    free_text: MessageSquare,
    likert: BarChart3,
  }

/* ------------------------------------------------------------------ */
/*  Horizontal bar chart colors for question breakdown                 */
/* ------------------------------------------------------------------ */
const BAR_COLORS = [
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-teal-500",
]

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */

function SurveyDashboard() {
  const { id } = Route.useParams()

  const { data: survey, isLoading: loadingSurvey } = useQuery<SurveyDetail>({
    queryKey: ["admin-survey", id],
    queryFn: () => api(`/surveys/${id}`),
  })

  const { data: overview, isLoading: loadingOverview } = useQuery<Overview>({
    queryKey: ["metrics-overview", id],
    queryFn: () => api(`/metrics/overview?survey_id=${id}`),
  })

  const { data: toolMetrics, isLoading: loadingTools } = useQuery<ToolMetric[]>(
    {
      queryKey: ["metrics-tools", id],
      queryFn: () => api(`/metrics/tools?survey_id=${id}`),
    },
  )

  const { data: questionMetrics, isLoading: loadingQuestions } = useQuery<
    QuestionMetric[]
  >({
    queryKey: ["metrics-questions", id],
    queryFn: () => api(`/metrics/questions?survey_id=${id}`),
  })

  const isLoading =
    loadingSurvey || loadingOverview || loadingTools || loadingQuestions

  function handleExport() {
    fetch(`${API}/api/v1/exports/survey/${id}.csv`, { headers: authHeaders() })
      .then((r) => r.blob())
      .then((b) => {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(b)
        a.download = `survey-${id}.csv`
        a.click()
      })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <RouterLink to="/surveys">
            <Button variant="ghost" size="sm" className="mt-0.5">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </RouterLink>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {survey?.title ?? "Survey"}
              </h1>
              {survey?.status && (
                <Badge variant={statusVariant[survey.status]}>
                  {survey.status}
                </Badge>
              )}
            </div>
            {survey?.description && (
              <p className="mt-1 text-muted-foreground">
                {survey.description}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Users}
          label="Responses"
          value={overview?.response_count ?? 0}
        />
        <KpiCard
          icon={Wrench}
          label="Tool Mentions"
          value={overview?.tool_usage_count ?? 0}
        />
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

      {/* Tabbed content */}
      <Tabs defaultValue="compliance" className="w-full">
        <TabsList>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="responses">All Responses</TabsTrigger>
        </TabsList>

        {/* ---- Compliance tab ---- */}
        <TabsContent value="compliance" className="flex flex-col gap-6 mt-4">
          {/* Compliance breakdown */}
          {overview && overview.tool_usage_count > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Compliance Breakdown
                </CardTitle>
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
              <CardDescription>
                By usage count across all responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {toolMetrics && toolMetrics.length > 0 ? (
                <div className="space-y-3">
                  {toolMetrics.map((t, i) => {
                    const maxCount = toolMetrics[0].usage_count
                    const pct =
                      maxCount > 0 ? (t.usage_count / maxCount) * 100 : 0
                    return (
                      <div key={t.tool_name + i} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${dotColor[t.color] ?? dotColor.gray}`}
                            />
                            <span className="font-medium">{t.tool_name}</span>
                            {t.risk_level && (
                              <span className="text-xs text-muted-foreground">
                                ({t.risk_level})
                              </span>
                            )}
                          </div>
                          <span className="tabular-nums text-muted-foreground">
                            {t.usage_count}
                          </span>
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
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No tool usage data yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- All Responses tab ---- */}
        <TabsContent value="responses" className="flex flex-col gap-6 mt-4">
          {!questionMetrics || questionMetrics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No question data available for this survey.
              </CardContent>
            </Card>
          ) : (
            <ResponsesGrid questions={questionMetrics} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ================================================================== */
/*  Responses Grid — groups questions by section                       */
/* ================================================================== */

function ResponsesGrid({ questions }: { questions: QuestionMetric[] }) {
  const sections: { title: string; order: number; items: QuestionMetric[] }[] =
    []
  const sectionMap = new Map<
    string,
    { title: string; order: number; items: QuestionMetric[] }
  >()

  for (const q of questions) {
    let sec = sectionMap.get(q.section_title)
    if (!sec) {
      sec = { title: q.section_title, order: q.section_order, items: [] }
      sectionMap.set(q.section_title, sec)
      sections.push(sec)
    }
    sec.items.push(q)
  }
  sections.sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-8">
      {sections.map((sec) => (
        <div key={sec.title} className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight border-b pb-2">
            {sec.title}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sec.items.map((q) => (
              <QuestionCard key={q.question_id} metric={q} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ================================================================== */
/*  QuestionCard — renders differently by question_type                */
/* ================================================================== */

function QuestionCard({ metric }: { metric: QuestionMetric }) {
  const Icon = TYPE_ICONS[metric.question_type] ?? ListChecks
  const typeLabel = TYPE_LABELS[metric.question_type] ?? metric.question_type

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 rounded-md bg-muted p-1.5">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium leading-snug">
              {metric.question_text}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <span>{typeLabel}</span>
              <span className="text-muted-foreground/60">·</span>
              <span>{metric.total_answers} answers</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {metric.question_type === "free_text" ? (
          <FreeTextDisplay samples={metric.free_text_samples} total={metric.total_answers} />
        ) : (
          <BreakdownChart
            breakdown={metric.breakdown}
            total={metric.total_answers}
            isMulti={metric.question_type === "multi_choice"}
          />
        )}
      </CardContent>
    </Card>
  )
}

/* ================================================================== */
/*  BreakdownChart — horizontal bar chart for choice / likert          */
/* ================================================================== */

function BreakdownChart({
  breakdown,
  total,
  isMulti,
}: {
  breakdown: BreakdownItem[]
  total: number
  isMulti?: boolean
}) {
  if (breakdown.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-3">
        No data
      </p>
    )
  }

  const maxCount = breakdown[0].count

  return (
    <div className="space-y-2">
      {breakdown.map((item, idx) => {
        const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0
        const totalPct = total > 0 ? Math.round((item.count / total) * 100) : 0
        const color = BAR_COLORS[idx % BAR_COLORS.length]

        return (
          <div key={item.value} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span
                className="font-medium truncate max-w-[70%]"
                title={item.value}
              >
                {item.value}
              </span>
              <span className="tabular-nums text-muted-foreground flex-shrink-0 ml-2">
                {item.count}{" "}
                <span className="text-muted-foreground/60">
                  ({isMulti ? `${item.count} picks` : `${totalPct}%`})
                </span>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ================================================================== */
/*  FreeTextDisplay — show text samples with expand/collapse           */
/* ================================================================== */

function FreeTextDisplay({
  samples,
  total,
}: {
  samples: string[]
  total: number
}) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? samples : samples.slice(0, 3)

  if (samples.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-3">
        No text responses
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {visible.map((s, i) => (
          <div
            key={i}
            className="rounded-md bg-muted/50 px-3 py-2 text-xs leading-relaxed"
          >
            {s}
          </div>
        ))}
      </div>
      {samples.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="mr-1 h-3 w-3" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-3 w-3" /> Show all {samples.length}{" "}
              of {total} responses
            </>
          )}
        </Button>
      )}
    </div>
  )
}

/* ================================================================== */
/*  Shared components                                                  */
/* ================================================================== */

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
        <div
          className={`rounded-lg p-2 ${variant === "muted" ? "bg-muted" : "bg-primary/10"}`}
        >
          <Icon
            className={`h-5 w-5 ${variant === "muted" ? "text-muted-foreground" : "text-primary"}`}
          />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">
            {label}
            {sub && (
              <span className="ml-1 font-medium text-foreground">({sub})</span>
            )}
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
    {
      label: "Approved",
      count: overview.approved_count,
      color: "bg-green-500",
    },
    { label: "Review", count: overview.review_count, color: "bg-yellow-500" },
    { label: "Rejected", count: overview.rejected_count, color: "bg-red-500" },
    {
      label: "Unmatched",
      count: overview.unmatched_count,
      color: "bg-muted-foreground/40",
    },
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
