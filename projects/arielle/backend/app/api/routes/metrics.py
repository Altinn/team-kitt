import uuid
from collections import Counter
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import case, func as sa_func
from sqlmodel import select

from app.api.deps import SessionDep, get_current_active_superuser
from app.models import (
    AiTool,
    AnswerBreakdownItem,
    MetricsOverview,
    OrgUnit,
    QuestionMetric,
    Survey,
    SurveyAnswer,
    SurveyQuestion,
    SurveyResponse,
    SurveySection,
    ToolMetricItem,
    ToolUsage,
)

router = APIRouter(prefix="/metrics", tags=["metrics"])

RISK_COLOR = {
    "approved": "green",
    "review": "yellow",
    "rejected": "red",
}


def _scope_filter(scope: str | None, scope_id: uuid.UUID | None, session: Any):
    """
    Return a list of org_unit IDs that fall under the requested scope.
    For 'department': the department itself + all children (sections/teams).
    For 'team': just that single org unit.
    Returns None when no scope filtering is needed.
    """
    if not scope or not scope_id:
        return None

    unit = session.get(OrgUnit, scope_id)
    if not unit:
        raise HTTPException(status_code=404, detail="Org unit not found")

    ids: set[uuid.UUID] = {scope_id}
    if scope == "department":
        # include children (sections) and grandchildren (teams)
        children = session.exec(
            select(OrgUnit.id).where(OrgUnit.parent_id == scope_id)
        ).all()
        ids.update(children)
        if children:
            grandchildren = session.exec(
                select(OrgUnit.id).where(OrgUnit.parent_id.in_(children))  # type: ignore[union-attr]
            ).all()
            ids.update(grandchildren)

    return ids


@router.get(
    "/overview",
    response_model=MetricsOverview,
    dependencies=[Depends(get_current_active_superuser)],
)
def metrics_overview(
    session: SessionDep,
    survey_id: uuid.UUID = Query(...),
    scope: str | None = Query(default=None),
    scope_id: uuid.UUID | None = Query(default=None),
) -> Any:
    """
    Aggregate overview: response count, tool usage count,
    approved/review/rejected/unmatched ratios.
    """
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    org_ids = _scope_filter(scope, scope_id, session)

    # Response count
    resp_q = select(sa_func.count()).select_from(SurveyResponse).where(
        SurveyResponse.survey_id == survey_id
    )
    if org_ids is not None:
        resp_q = resp_q.where(SurveyResponse.org_unit_id.in_(org_ids))  # type: ignore[union-attr]
    response_count = session.exec(resp_q).one()

    # Get response IDs for the scope (needed for tool usage filtering)
    resp_ids_q = select(SurveyResponse.id).where(
        SurveyResponse.survey_id == survey_id
    )
    if org_ids is not None:
        resp_ids_q = resp_ids_q.where(SurveyResponse.org_unit_id.in_(org_ids))  # type: ignore[union-attr]
    resp_ids = list(session.exec(resp_ids_q).all())

    if not resp_ids:
        return MetricsOverview(
            survey_id=survey_id,
            scope=scope,
            scope_id=scope_id,
            response_count=0,
            tool_usage_count=0,
            approved_count=0,
            review_count=0,
            rejected_count=0,
            unmatched_count=0,
        )

    # Tool usage breakdown via a single query joining AiTool
    rows = session.exec(
        select(
            sa_func.count().label("cnt"),
            AiTool.risk_level,
        )
        .select_from(ToolUsage)
        .outerjoin(AiTool, ToolUsage.matched_tool_id == AiTool.id)
        .where(ToolUsage.response_id.in_(resp_ids))  # type: ignore[union-attr]
        .group_by(AiTool.risk_level)
    ).all()

    tool_usage_count = 0
    approved = review = rejected = unmatched = 0
    for cnt, risk in rows:
        tool_usage_count += cnt
        if risk == "approved":
            approved = cnt
        elif risk == "review":
            review = cnt
        elif risk == "rejected":
            rejected = cnt
        else:
            unmatched += cnt

    return MetricsOverview(
        survey_id=survey_id,
        scope=scope,
        scope_id=scope_id,
        response_count=response_count,
        tool_usage_count=tool_usage_count,
        approved_count=approved,
        review_count=review,
        rejected_count=rejected,
        unmatched_count=unmatched,
    )


@router.get(
    "/tools",
    response_model=list[ToolMetricItem],
    dependencies=[Depends(get_current_active_superuser)],
)
def metrics_tools(
    session: SessionDep,
    survey_id: uuid.UUID = Query(...),
    scope: str | None = Query(default=None),
    scope_id: uuid.UUID | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=50),
) -> Any:
    """
    Top N tools by usage count with compliance color.
    green = approved, yellow = review, red = rejected, gray = unmatched.
    """
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    org_ids = _scope_filter(scope, scope_id, session)

    # Subquery: response IDs in scope
    resp_ids_q = select(SurveyResponse.id).where(
        SurveyResponse.survey_id == survey_id
    )
    if org_ids is not None:
        resp_ids_q = resp_ids_q.where(SurveyResponse.org_unit_id.in_(org_ids))  # type: ignore[union-attr]

    # Use coalesce to display raw_name when tool is unmatched
    tool_name_col = case(
        (AiTool.name.is_not(None), AiTool.name),
        else_=ToolUsage.raw_name,
    ).label("tool_name")

    rows = session.exec(
        select(
            tool_name_col,
            ToolUsage.matched_tool_id,
            AiTool.risk_level,
            sa_func.count().label("usage_count"),
        )
        .select_from(ToolUsage)
        .outerjoin(AiTool, ToolUsage.matched_tool_id == AiTool.id)
        .where(ToolUsage.response_id.in_(resp_ids_q))  # type: ignore[union-attr]
        .group_by(tool_name_col, ToolUsage.matched_tool_id, AiTool.risk_level)
        .order_by(sa_func.count().desc())
        .limit(limit)
    ).all()

    result: list[ToolMetricItem] = []
    for tool_name, tool_id, risk, count in rows:
        color = RISK_COLOR.get(risk, "gray") if risk else "gray"
        result.append(
            ToolMetricItem(
                tool_name=tool_name,
                tool_id=tool_id,
                usage_count=count,
                risk_level=risk,
                color=color,
            )
        )

    return result


FREE_TEXT_SAMPLE_LIMIT = 20


@router.get(
    "/questions",
    response_model=list[QuestionMetric],
    dependencies=[Depends(get_current_active_superuser)],
)
def metrics_questions(
    session: SessionDep,
    survey_id: uuid.UUID = Query(...),
    scope: str | None = Query(default=None),
    scope_id: uuid.UUID | None = Query(default=None),
) -> Any:
    """
    Per-question aggregate breakdown for a survey.
    - single_choice / likert: frequency count per value.
    - multi_choice: frequency count per selected option (each array item counted).
    - free_text: first N samples + total count.
    Ordered by section order, then question order.
    """
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    org_ids = _scope_filter(scope, scope_id, session)

    # Get response IDs in scope
    resp_ids_q = select(SurveyResponse.id).where(
        SurveyResponse.survey_id == survey_id
    )
    if org_ids is not None:
        resp_ids_q = resp_ids_q.where(SurveyResponse.org_unit_id.in_(org_ids))  # type: ignore[union-attr]
    resp_ids = list(session.exec(resp_ids_q).all())

    # Get all questions for this survey, ordered
    questions = session.exec(
        select(SurveyQuestion, SurveySection)
        .join(SurveySection, SurveyQuestion.section_id == SurveySection.id)
        .where(SurveySection.survey_id == survey_id)
        .order_by(SurveySection.order, SurveyQuestion.order)
    ).all()

    result: list[QuestionMetric] = []

    for question, section in questions:
        # Get all answers for this question within the scoped responses
        if not resp_ids:
            result.append(
                QuestionMetric(
                    question_id=question.id,
                    question_text=question.text,
                    question_type=question.question_type,
                    section_title=section.title,
                    section_order=section.order,
                    question_order=question.order,
                    total_answers=0,
                    breakdown=[],
                    free_text_samples=[],
                )
            )
            continue

        answers = session.exec(
            select(SurveyAnswer.value_json).where(
                SurveyAnswer.question_id == question.id,
                SurveyAnswer.response_id.in_(resp_ids),  # type: ignore[union-attr]
            )
        ).all()

        total_answers = len(answers)
        counter: Counter[str] = Counter()
        free_samples: list[str] = []

        for val in answers:
            if val is None:
                continue
            if question.question_type == "multi_choice":
                # val should be a list of strings
                if isinstance(val, list):
                    for item in val:
                        counter[str(item)] += 1
                else:
                    counter[str(val)] += 1
            elif question.question_type == "free_text":
                text = str(val).strip()
                if text and len(free_samples) < FREE_TEXT_SAMPLE_LIMIT:
                    free_samples.append(text)
            else:
                # single_choice, likert, or anything else
                counter[str(val)] += 1

        breakdown = [
            AnswerBreakdownItem(value=v, count=c)
            for v, c in counter.most_common()
        ]

        result.append(
            QuestionMetric(
                question_id=question.id,
                question_text=question.text,
                question_type=question.question_type,
                section_title=section.title,
                section_order=section.order,
                question_order=question.order,
                total_answers=total_answers,
                breakdown=breakdown,
                free_text_samples=free_samples,
            )
        )

    return result
