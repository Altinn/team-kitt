import { createFileRoute, Link as RouterLink } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { ClipboardList, Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const API = import.meta.env.VITE_API_URL

async function fetchSurvey(token: string) {
  const res = await fetch(`${API}/api/public/surveys/${token}`)
  if (res.status === 409) throw new Error("TOKEN_USED")
  if (res.status === 404) throw new Error("NOT_FOUND")
  if (!res.ok) throw new Error("UNKNOWN")
  return res.json()
}

export const Route = createFileRoute("/s/$token/")({
  component: SurveyLanding,
  head: () => ({ meta: [{ title: "Survey" }] }),
})

function SurveyLanding() {
  const { token } = Route.useParams()
  const { data: survey, isLoading, error } = useQuery({
    queryKey: ["public-survey", token],
    queryFn: () => fetchSurvey(token),
    retry: false,
  })

  if (isLoading) {
    return (
      <CenteredLayout>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CenteredLayout>
    )
  }

  if (error) {
    const msg =
      error.message === "TOKEN_USED"
        ? "This survey link has already been used."
        : error.message === "NOT_FOUND"
          ? "Survey not found or no longer available."
          : "Something went wrong."
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

  const questionCount =
    survey?.sections?.reduce(
      (sum: number, s: { questions: unknown[] }) => sum + s.questions.length,
      0,
    ) ?? 0

  return (
    <CenteredLayout>
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-2">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">{survey.title}</CardTitle>
          {survey.description && (
            <CardDescription>{survey.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {survey.sections?.length ?? 0} section(s) &middot; {questionCount}{" "}
            question(s)
          </p>
          <RouterLink to="/s/$token/fill" params={{ token }}>
            <Button size="lg">Start Survey</Button>
          </RouterLink>
        </CardContent>
      </Card>
    </CenteredLayout>
  )
}

function CenteredLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">{children}</div>
    </div>
  )
}
