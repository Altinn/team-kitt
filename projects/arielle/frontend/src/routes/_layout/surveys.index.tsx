import { createFileRoute, Link as RouterLink } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useCallback } from "react"
import {
  Loader2,
  Rocket,
  XCircle,
  KeyRound,
  Download,
  Copy,
  BarChart3,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react"

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
import { Separator } from "@/components/ui/separator"
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
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
      ...opts?.headers,
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const Route = createFileRoute("/_layout/surveys/")({
  component: SurveysListPage,
  head: () => ({ meta: [{ title: "Surveys - ARIELLE" }] }),
})

const statusColor: Record<string, string> = {
  draft: "secondary",
  published: "default",
  closed: "outline",
}

function SurveysListPage() {
  const qc = useQueryClient()
  const [tokenDialog, setTokenDialog] = useState<{
    surveyId: string
    tokens: string[]
  } | null>(null)
  const [tokenCount, setTokenCount] = useState(10)
  const [genSurveyId, setGenSurveyId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["admin-surveys"],
    queryFn: () => api("/surveys/"),
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/surveys/${id}/publish`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-surveys"] }),
  })

  const closeMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/surveys/${id}/close`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-surveys"] }),
  })

  const tokenMutation = useMutation({
    mutationFn: ({ id, count }: { id: string; count: number }) =>
      api(`/surveys/${id}/tokens`, {
        method: "POST",
        body: JSON.stringify({ count }),
      }),
    onSuccess: (result, vars) =>
      setTokenDialog({ surveyId: vars.id, tokens: result.tokens }),
  })

  function handleExport(id: string) {
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const surveys = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Surveys</h1>
          <p className="text-muted-foreground">
            Manage surveys, publish, and generate tokens
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Survey
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No surveys yet
                  </TableCell>
                </TableRow>
              )}
              {surveys.map((s: Record<string, string>) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    <RouterLink
                      to="/surveys/$id"
                      params={{ id: s.id }}
                      className="hover:underline underline-offset-4"
                    >
                      {s.title}
                    </RouterLink>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        statusColor[s.status] as
                          | "default"
                          | "secondary"
                          | "outline"
                      }
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(s.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <RouterLink to="/surveys/$id" params={{ id: s.id }}>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="mr-1 h-3 w-3" /> Dashboard
                      </Button>
                    </RouterLink>
                    {s.status === "draft" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => publishMutation.mutate(s.id)}
                        disabled={publishMutation.isPending}
                      >
                        <Rocket className="mr-1 h-3 w-3" /> Publish
                      </Button>
                    )}
                    {s.status === "published" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => closeMutation.mutate(s.id)}
                          disabled={closeMutation.isPending}
                        >
                          <XCircle className="mr-1 h-3 w-3" /> Close
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setGenSurveyId(s.id)}
                        >
                          <KeyRound className="mr-1 h-3 w-3" /> Tokens
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleExport(s.id)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create survey dialog */}
      <CreateSurveyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          setCreateOpen(false)
          qc.invalidateQueries({ queryKey: ["admin-surveys"] })
        }}
      />

      {/* Token generation dialog */}
      <Dialog
        open={genSurveyId !== null}
        onOpenChange={() => setGenSurveyId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Tokens</DialogTitle>
            <DialogDescription>
              Create single-use survey links
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label htmlFor="count" className="mb-1 block">
                Count
              </Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={1000}
                value={tokenCount}
                onChange={(e) => setTokenCount(Number(e.target.value))}
              />
            </div>
            <Button
              onClick={() =>
                genSurveyId &&
                tokenMutation.mutate({ id: genSurveyId, count: tokenCount })
              }
              disabled={tokenMutation.isPending}
            >
              {tokenMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Generate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Token results dialog */}
      <Dialog
        open={tokenDialog !== null}
        onOpenChange={() => setTokenDialog(null)}
      >
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Tokens</DialogTitle>
            <DialogDescription>
              Copy these now — they cannot be retrieved again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {tokenDialog?.tokens.map((t) => {
              const url = `${window.location.origin}/s/${t}`
              return (
                <div
                  key={t}
                  className="flex items-center gap-2 rounded-lg border p-2 text-xs font-mono"
                >
                  <span className="flex-1 truncate">{url}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigator.clipboard.writeText(url)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )
            })}
          </div>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              const all = tokenDialog?.tokens
                .map((t) => `${window.location.origin}/s/${t}`)
                .join("\n")
              if (all) navigator.clipboard.writeText(all)
            }}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy All
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Create Survey Dialog
// ---------------------------------------------------------------------------

interface OptionDraft {
  label: string
  value: string
}

interface QuestionDraft {
  text: string
  question_type: string
  is_required: boolean
  allow_other: boolean
  options: OptionDraft[]
}

interface SectionDraft {
  title: string
  description: string
  questions: QuestionDraft[]
}

function emptyOption(): OptionDraft {
  return { label: "", value: "" }
}

function emptyQuestion(): QuestionDraft {
  return {
    text: "",
    question_type: "single_choice",
    is_required: true,
    allow_other: false,
    options: [emptyOption()],
  }
}

function emptySection(): SectionDraft {
  return { title: "", description: "", questions: [emptyQuestion()] }
}

function CreateSurveyDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sections, setSections] = useState<SectionDraft[]>([emptySection()])

  const resetForm = useCallback(() => {
    setTitle("")
    setDescription("")
    setSections([emptySection()])
  }, [])

  const mutation = useMutation({
    mutationFn: () => {
      const body = {
        title,
        description: description || undefined,
        sections: sections.map((sec, si) => ({
          title: sec.title,
          description: sec.description || undefined,
          order: si,
          questions: sec.questions.map((q, qi) => ({
            text: q.text,
            question_type: q.question_type,
            is_required: q.is_required,
            allow_other: q.allow_other,
            order: qi,
            options: q.options
              .filter((o) => o.label.trim())
              .map((o, oi) => ({
                label: o.label,
                value: o.value || o.label.toLowerCase(),
                order: oi,
              })),
          })),
        })),
      }
      return api("/surveys/", {
        method: "POST",
        body: JSON.stringify(body),
      })
    },
    onSuccess: () => {
      resetForm()
      onCreated()
    },
  })

  function updateSection(idx: number, patch: Partial<SectionDraft>) {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    )
  }

  function updateQuestion(
    secIdx: number,
    qIdx: number,
    patch: Partial<QuestionDraft>,
  ) {
    setSections((prev) =>
      prev.map((s, si) =>
        si === secIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx ? { ...q, ...patch } : q,
              ),
            }
          : s,
      ),
    )
  }

  function updateOption(
    secIdx: number,
    qIdx: number,
    oIdx: number,
    patch: Partial<OptionDraft>,
  ) {
    setSections((prev) =>
      prev.map((s, si) =>
        si === secIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx
                  ? {
                      ...q,
                      options: q.options.map((o, oi) =>
                        oi === oIdx ? { ...o, ...patch } : o,
                      ),
                    }
                  : q,
              ),
            }
          : s,
      ),
    )
  }

  function addOption(secIdx: number, qIdx: number) {
    setSections((prev) =>
      prev.map((s, si) =>
        si === secIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx
                  ? { ...q, options: [...q.options, emptyOption()] }
                  : q,
              ),
            }
          : s,
      ),
    )
  }

  function removeOption(secIdx: number, qIdx: number, oIdx: number) {
    setSections((prev) =>
      prev.map((s, si) =>
        si === secIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx
                  ? { ...q, options: q.options.filter((_, i) => i !== oIdx) }
                  : q,
              ),
            }
          : s,
      ),
    )
  }

  function addQuestion(secIdx: number) {
    setSections((prev) =>
      prev.map((s, si) =>
        si === secIdx
          ? { ...s, questions: [...s.questions, emptyQuestion()] }
          : s,
      ),
    )
  }

  function removeQuestion(secIdx: number, qIdx: number) {
    setSections((prev) =>
      prev.map((s, si) =>
        si === secIdx
          ? { ...s, questions: s.questions.filter((_, i) => i !== qIdx) }
          : s,
      ),
    )
  }

  function addSection() {
    setSections((prev) => [...prev, emptySection()])
  }

  function removeSection(idx: number) {
    setSections((prev) => prev.filter((_, i) => i !== idx))
  }

  const hasOptions = (type: string) =>
    ["single_choice", "multi_choice", "likert"].includes(type)

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Survey</DialogTitle>
          <DialogDescription>
            Build your survey with sections, questions, and options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Survey metadata */}
          <div className="space-y-3">
            <div>
              <Label className="mb-1 block">Title</Label>
              <Input
                placeholder="e.g. KI-bruk kartlegging 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1 block">Description (optional)</Label>
              <Input
                placeholder="Brief description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Sections */}
          {sections.map((sec, si) => (
            <div
              key={si}
              className="rounded-lg border p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Section {si + 1}
                  </span>
                </div>
                {sections.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeSection(si)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="mb-1 block text-xs">Section Title</Label>
                  <Input
                    placeholder="e.g. AI Tool Usage"
                    value={sec.title}
                    onChange={(e) =>
                      updateSection(si, { title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-xs">
                    Description (optional)
                  </Label>
                  <Input
                    placeholder="Optional section description"
                    value={sec.description}
                    onChange={(e) =>
                      updateSection(si, { description: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                {sec.questions.map((q, qi) => (
                  <div key={qi} className="space-y-2 rounded-md bg-muted/30 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground mt-2">
                        Q{qi + 1}
                      </span>
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Question text..."
                          value={q.text}
                          onChange={(e) =>
                            updateQuestion(si, qi, { text: e.target.value })
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Select
                            value={q.question_type}
                            onValueChange={(v) =>
                              updateQuestion(si, qi, { question_type: v })
                            }
                          >
                            <SelectTrigger className="w-40 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single_choice">
                                Single choice
                              </SelectItem>
                              <SelectItem value="multi_choice">
                                Multi choice
                              </SelectItem>
                              <SelectItem value="free_text">
                                Free text
                              </SelectItem>
                              <SelectItem value="likert">Likert</SelectItem>
                            </SelectContent>
                          </Select>
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={q.is_required}
                              onChange={(e) =>
                                updateQuestion(si, qi, {
                                  is_required: e.target.checked,
                                })
                              }
                              className="accent-primary"
                            />
                            Required
                          </label>
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={q.allow_other}
                              onChange={(e) =>
                                updateQuestion(si, qi, {
                                  allow_other: e.target.checked,
                                })
                              }
                              className="accent-primary"
                            />
                            Allow "other"
                          </label>
                        </div>

                        {/* Options */}
                        {hasOptions(q.question_type) && (
                          <div className="space-y-1.5">
                            {q.options.map((opt, oi) => (
                              <div
                                key={oi}
                                className="flex items-center gap-2"
                              >
                                <span className="text-xs text-muted-foreground w-4">
                                  {oi + 1}.
                                </span>
                                <Input
                                  className="h-7 text-xs flex-1"
                                  placeholder="Option label"
                                  value={opt.label}
                                  onChange={(e) =>
                                    updateOption(si, qi, oi, {
                                      label: e.target.value,
                                      value:
                                        opt.value ||
                                        e.target.value.toLowerCase(),
                                    })
                                  }
                                />
                                <Input
                                  className="h-7 text-xs w-28"
                                  placeholder="value"
                                  value={opt.value}
                                  onChange={(e) =>
                                    updateOption(si, qi, oi, {
                                      value: e.target.value,
                                    })
                                  }
                                />
                                {q.options.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={() => removeOption(si, qi, oi)}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => addOption(si, qi)}
                            >
                              <Plus className="mr-1 h-3 w-3" /> Add option
                            </Button>
                          </div>
                        )}
                      </div>
                      {sec.questions.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-1"
                          onClick={() => removeQuestion(si, qi)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => addQuestion(si)}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Question
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addSection}>
            <Plus className="mr-2 h-4 w-4" /> Add Section
          </Button>

          <Separator />

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || !title.trim()}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Survey
            </Button>
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive text-right">
              Failed to create survey. Check that all fields are valid.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
