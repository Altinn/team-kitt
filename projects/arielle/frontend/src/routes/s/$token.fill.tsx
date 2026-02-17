import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Loader2, AlertCircle, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API = import.meta.env.VITE_API_URL

interface Option {
  id: string
  label: string
  value: string
  order: number
}
interface Question {
  id: string
  text: string
  question_type: string
  is_required: boolean
  allow_other: boolean
  options: Option[]
}
interface Section {
  id: string
  title: string
  description: string | null
  questions: Question[]
}
interface SurveyData {
  id: string
  title: string
  description: string | null
  sections: Section[]
  target_org_unit_id: string | null
  target_role: string | null
}

async function fetchSurvey(token: string): Promise<SurveyData> {
  const res = await fetch(`${API}/api/public/surveys/${token}`)
  if (res.status === 409) throw new Error("TOKEN_USED")
  if (!res.ok) throw new Error("NOT_FOUND")
  return res.json()
}

async function submitSurvey(
  token: string,
  body: { org_unit_id?: string; role_title?: string; answers: { question_id: string; value: unknown }[] },
) {
  const res = await fetch(`${API}/api/public/surveys/${token}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (res.status === 409) throw new Error("TOKEN_USED")
  if (!res.ok) throw new Error("SUBMIT_FAILED")
  return res.json()
}

export const Route = createFileRoute("/s/$token/fill")({
  component: SurveyFill,
  head: () => ({ meta: [{ title: "Fill Survey" }] }),
})

function SurveyFill() {
  const { token } = Route.useParams()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [roleTitle, setRoleTitle] = useState("")

  const { data: survey, isLoading, error } = useQuery({
    queryKey: ["public-survey", token],
    queryFn: () => fetchSurvey(token),
    retry: false,
  })

  const mutation = useMutation({
    mutationFn: () => {
      const answerList = Object.entries(answers)
        .filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
        .map(([questionId, value]) => ({ question_id: questionId, value }))
      return submitSurvey(token, {
        org_unit_id: survey?.target_org_unit_id ?? undefined,
        role_title: roleTitle || survey?.target_role || undefined,
        answers: answerList,
      })
    },
    onSuccess: () => navigate({ to: "/s/$token/done", params: { token } }),
  })

  if (isLoading) {
    return (
      <CenteredLayout>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CenteredLayout>
    )
  }

  if (error || !survey) {
    const msg = error?.message === "TOKEN_USED"
      ? "This survey link has already been used."
      : "Survey not found."
    return (
      <CenteredLayout>
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-2" />
            <CardTitle>Unavailable</CardTitle>
            <CardDescription>{msg}</CardDescription>
          </CardHeader>
        </Card>
      </CenteredLayout>
    )
  }

  function setSingle(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function toggleMulti(questionId: string, value: string) {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [questionId]: next }
    })
  }

  function setFreeText(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{survey.title}</h1>
          {survey.description && (
            <p className="mt-1 text-muted-foreground">{survey.description}</p>
          )}
        </div>

        {survey.target_role == null && (
          <div className="mb-6">
            <Label htmlFor="role" className="mb-2 block">Your role</Label>
            <Input
              id="role"
              placeholder="e.g. Rådgiver, Utvikler..."
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-6">
          {survey.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.description && (
                  <CardDescription>{section.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {section.questions.map((q) => (
                  <QuestionField
                    key={q.id}
                    question={q}
                    value={answers[q.id]}
                    onSingle={setSingle}
                    onMulti={toggleMulti}
                    onFreeText={setFreeText}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Submit
          </Button>
        </div>

        {mutation.isError && (
          <p className="mt-4 text-sm text-destructive text-right">
            {mutation.error.message === "TOKEN_USED"
              ? "This link has already been used."
              : "Submission failed. Please try again."}
          </p>
        )}
      </div>
    </div>
  )
}

function QuestionField({
  question,
  value,
  onSingle,
  onMulti,
  onFreeText,
}: {
  question: Question
  value: unknown
  onSingle: (id: string, v: string) => void
  onMulti: (id: string, v: string) => void
  onFreeText: (id: string, v: string) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">
        {question.text}
        {question.is_required && <span className="text-destructive ml-1">*</span>}
      </legend>

      {(question.question_type === "single_choice" || question.question_type === "likert") && (
        <div className="space-y-1.5">
          {question.options.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                value === opt.value
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onSingle(question.id, opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}

      {question.question_type === "multi_choice" && (
        <div className="space-y-1.5">
          {question.options.map((opt) => {
            const checked = Array.isArray(value) && value.includes(opt.value)
            return (
              <label
                key={opt.id}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                  checked ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onMulti(question.id, opt.value)}
                  className="accent-primary"
                />
                {opt.label}
              </label>
            )
          })}
        </div>
      )}

      {question.question_type === "free_text" && (
        <Input
          placeholder="Your answer..."
          value={(value as string) ?? ""}
          onChange={(e) => onFreeText(question.id, e.target.value)}
        />
      )}
    </fieldset>
  )
}

function CenteredLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      {children}
    </div>
  )
}
