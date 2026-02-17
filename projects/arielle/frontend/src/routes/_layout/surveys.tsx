import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/surveys")({
  component: SurveysLayout,
})

function SurveysLayout() {
  return <Outlet />
}
