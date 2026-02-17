import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/s/$token")({
  component: SurveyLayout,
})

function SurveyLayout() {
  return <Outlet />
}
