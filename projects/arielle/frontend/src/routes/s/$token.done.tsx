import { createFileRoute } from "@tanstack/react-router"
import { CheckCircle2 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/s/$token/done")({
  component: SurveyDone,
  head: () => ({ meta: [{ title: "Survey Submitted" }] }),
})

function SurveyDone() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="rounded-full bg-green-500/10 p-3 mb-2">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-xl">Thank you!</CardTitle>
          <CardDescription>
            Your response has been recorded. You can close this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-xs text-muted-foreground">
            Takk for ditt bidrag til kartleggingen.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
