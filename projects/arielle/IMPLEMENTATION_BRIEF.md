# POC: AI Governance Surveys + Dashboard (FastAPI + SQLModel + React)

## Goal
Implement a POC web app in an existing fastapi-fullstack template (FastAPI + SQLModel + Postgres + React). Auth/authz and DB exist.

Core features:
1) Public survey answering via token link (no login).
2) Survey builder (admin) to create unlimited surveys (sections A/B/C/D, questions, options).
3) Persist responses/answers (answers stored as JSON).
4) Tool whitelist (AiTool + AiToolAlias) + matching ToolUsage -> AiTool.
5) Dashboards by scope (me/team/section/department). POC: implement Team + Department.
6) CSV export of survey results.

## Deliverables
A) SQLModel models:
- OrgUnit
- Survey, SurveySection, SurveyQuestion, SurveyOption
- SurveyToken
- SurveyResponse, SurveyAnswer
- AiTool, AiToolAlias
- ToolUsage

B) Schemas (Pydantic):
- public survey view + submit
- admin create/update

C) Routers:
- app/api/routes/public_surveys.py:
  - GET  /api/public/surveys/{token}
  - POST /api/public/surveys/{token}/submit
- app/api/routes/surveys.py:
  - CRUD + publish/close + token batch generation
- app/api/routes/tools.py:
  - CRUD + POST /api/tools/match/rebuild
- app/api/routes/metrics.py:
  - GET /api/metrics/overview
  - GET /api/metrics/tools (top 10 tools w/ compliance status)
- app/api/routes/exports.py:
  - GET /api/exports/survey/{id}.csv

D) Scripts:
- scripts/seed_survey_v1.py
- scripts/import_csv_responses.py (imports provided CSV)
- scripts/seed_whitelist_tools.py

E) Minimal React pages:
- /s/[token] (public landing) + /s/[token]/fill + /s/[token]/done
- /app/surveys (admin list)
- /app/tools (admin whitelist)
- /app/department/[id] (dashboard)

## Acceptance criteria
- `docker compose up` works locally.
- After running:
  - seed survey
  - import CSV
  - seed whitelist
  - POST /api/tools/match/rebuild
  dashboards show:
  - response count
  - tool usage count
  - approved/review/rejected ratios
  - top tools list with green/yellow/red
- Public token link works and token becomes used after submit.

## Implementation order
1) DB models + Alembic migrations
2) Public survey endpoints
3) Admin survey endpoints + token generation
4) Tools whitelist + matching
5) Metrics endpoints
6) Export endpoint
7) Frontend pages (minimal)

## Constraints
- POC only; no production-grade workflows.
- Keep code small and readable.
- Use role-based checks: admin required for builder/tools/export.
- For scope filtering in metrics, use SurveyResponse.org_unit_id for now.