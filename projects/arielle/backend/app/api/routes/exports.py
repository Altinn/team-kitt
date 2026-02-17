import csv
import io
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import select

from app.api.deps import SessionDep, get_current_active_superuser
from app.models import (
    AiTool,
    OrgUnit,
    Survey,
    SurveyAnswer,
    SurveyQuestion,
    SurveyResponse,
    SurveySection,
    ToolUsage,
)

router = APIRouter(prefix="/exports", tags=["exports"])


@router.get(
    "/survey/{survey_id}.csv",
    dependencies=[Depends(get_current_active_superuser)],
)
def export_survey_csv(survey_id: uuid.UUID, session: SessionDep) -> Any:
    """
    Export all responses for a survey as CSV.
    Columns: response_id, submitted_at, org_unit, role_title,
             then one column per question (by order), then tool_usages.
    """
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    # Build ordered question list: [(question_id, column_header), ...]
    sections = session.exec(
        select(SurveySection)
        .where(SurveySection.survey_id == survey_id)
        .order_by(SurveySection.order)
    ).all()

    questions: list[tuple[uuid.UUID, str]] = []
    for section in sections:
        qs = session.exec(
            select(SurveyQuestion)
            .where(SurveyQuestion.section_id == section.id)
            .order_by(SurveyQuestion.order)
        ).all()
        for q in qs:
            header = f"{section.title} / {q.text}"
            questions.append((q.id, header))

    # Build org unit lookup
    org_units = {u.id: u.name for u in session.exec(select(OrgUnit)).all()}

    # Build tool name lookup
    tool_names = {t.id: t.name for t in session.exec(select(AiTool)).all()}

    # Fetch all responses
    responses = session.exec(
        select(SurveyResponse)
        .where(SurveyResponse.survey_id == survey_id)
        .order_by(SurveyResponse.submitted_at)
    ).all()

    # CSV header
    q_headers = [h for _, h in questions]
    header = [
        "response_id",
        "submitted_at",
        "org_unit",
        "role_title",
        *q_headers,
        "tool_usages",
    ]

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(header)

    for resp in responses:
        # Build answer lookup for this response
        answers = session.exec(
            select(SurveyAnswer).where(SurveyAnswer.response_id == resp.id)
        ).all()
        ans_map: dict[uuid.UUID, Any] = {a.question_id: a.value_json for a in answers}

        # Build tool usage string
        usages = session.exec(
            select(ToolUsage).where(ToolUsage.response_id == resp.id)
        ).all()
        tool_parts: list[str] = []
        for u in usages:
            matched = tool_names.get(u.matched_tool_id, "") if u.matched_tool_id else ""
            part = u.raw_name
            if matched and matched != u.raw_name:
                part += f" → {matched}"
            tool_parts.append(part)
        tool_str = "; ".join(tool_parts)

        org_name = org_units.get(resp.org_unit_id, "") if resp.org_unit_id else ""

        row = [
            str(resp.id),
            resp.submitted_at.isoformat() if resp.submitted_at else "",
            org_name,
            resp.role_title or "",
        ]
        for q_id, _ in questions:
            val = ans_map.get(q_id)
            if val is None:
                row.append("")
            elif isinstance(val, list):
                row.append("; ".join(str(v) for v in val))
            else:
                row.append(str(val))
        row.append(tool_str)

        writer.writerow(row)

    buf.seek(0)
    filename = f"survey-{survey_id}.csv"
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
