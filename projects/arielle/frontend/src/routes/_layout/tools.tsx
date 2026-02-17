import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Loader2, Plus, RefreshCw, Trash2, Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
}

async function api(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}/api/v1${path}`, {
    ...opts,
    headers: { ...authHeaders(), "Content-Type": "application/json", ...opts?.headers },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const Route = createFileRoute("/_layout/tools")({
  component: ToolsPage,
  head: () => ({ meta: [{ title: "AI Tools - ARIELLE" }] }),
})

interface Tool {
  id: string
  name: string
  vendor: string | null
  risk_level: string | null
  aliases: { id: string; alias: string }[]
}

const riskColor: Record<string, string> = {
  approved: "bg-green-500/10 text-green-600 border-green-500/20",
  review: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
}

function ToolsPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTool, setEditTool] = useState<Tool | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tools"],
    queryFn: () => api("/tools/"),
  })

  const rebuildMutation = useMutation({
    mutationFn: () => api("/tools/match/rebuild", { method: "POST" }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/tools/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tools"] }),
  })

  const tools: Tool[] = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Tools</h1>
          <p className="text-muted-foreground">Manage the tool whitelist and matching</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => rebuildMutation.mutate()} disabled={rebuildMutation.isPending}>
            {rebuildMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Rebuild Matches
          </Button>
          <Button onClick={() => { setEditTool(null); setDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Tool
          </Button>
        </div>
      </div>

      {rebuildMutation.isSuccess && (
        <div className="rounded-lg border bg-muted/50 p-3 text-sm">
          Match rebuild complete: <strong>{rebuildMutation.data.matched}</strong> matched,{" "}
          <strong>{rebuildMutation.data.unmatched}</strong> unmatched out of{" "}
          {rebuildMutation.data.total_usages} total usages.
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aliases</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No tools yet
                    </TableCell>
                  </TableRow>
                )}
                {tools.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-muted-foreground">{t.vendor ?? "—"}</TableCell>
                    <TableCell>
                      {t.risk_level ? (
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${riskColor[t.risk_level] ?? ""}`}>
                          {t.risk_level}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {t.aliases.slice(0, 3).map((a) => (
                          <Badge key={a.id} variant="secondary" className="text-xs">
                            {a.alias}
                          </Badge>
                        ))}
                        {t.aliases.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{t.aliases.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditTool(t); setDialogOpen(true) }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(t.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ToolDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tool={editTool}
        onSaved={() => { setDialogOpen(false); qc.invalidateQueries({ queryKey: ["admin-tools"] }) }}
      />
    </div>
  )
}

function ToolDialog({
  open,
  onOpenChange,
  tool,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  tool: Tool | null
  onSaved: () => void
}) {
  const [name, setName] = useState("")
  const [vendor, setVendor] = useState("")
  const [risk, setRisk] = useState("")
  const [aliasesStr, setAliasesStr] = useState("")

  // Reset form when dialog opens
  const handleOpenChange = (v: boolean) => {
    if (v) {
      setName(tool?.name ?? "")
      setVendor(tool?.vendor ?? "")
      setRisk(tool?.risk_level ?? "")
      setAliasesStr(tool?.aliases.map((a) => a.alias).join(", ") ?? "")
    }
    onOpenChange(v)
  }

  const mutation = useMutation({
    mutationFn: () => {
      const aliases = aliasesStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const body = { name, vendor: vendor || undefined, risk_level: risk || undefined, aliases }

      if (tool) {
        return api(`/tools/${tool.id}`, { method: "PUT", body: JSON.stringify(body) })
      }
      return api("/tools/", { method: "POST", body: JSON.stringify(body) })
    },
    onSuccess: onSaved,
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tool ? "Edit Tool" : "Add Tool"}</DialogTitle>
          <DialogDescription>
            {tool ? "Update tool details and aliases" : "Add a new tool to the whitelist"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-1 block">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ChatGPT" />
          </div>
          <div>
            <Label className="mb-1 block">Vendor</Label>
            <Input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="OpenAI" />
          </div>
          <div>
            <Label className="mb-1 block">Risk Level</Label>
            <Select value={risk} onValueChange={setRisk}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Aliases (comma separated)</Label>
            <Input
              value={aliasesStr}
              onChange={(e) => setAliasesStr(e.target.value)}
              placeholder="chatgpt, ChatGPT Plus, gpt-4"
            />
          </div>
          <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tool ? "Update" : "Create"}
          </Button>
          {mutation.isError && (
            <p className="text-sm text-destructive">Failed to save tool.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
