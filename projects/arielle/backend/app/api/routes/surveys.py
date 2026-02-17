import hashlib
import secrets
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.models import (
    Message,
    Survey,
    SurveyAdminDetail,
    SurveyAdminView,
    SurveyCreate,
    SurveyOption,
    SurveyQuestion,
    SurveySection,
    SurveySectionCreate,
    SurveysAdminList,
    SurveyToken,
    SurveyUpdate,
    TokenGenerateRequest,
    TokenGenerateResponse,
    get_datetime_utc,
)

router = APIRouter(prefix="/surveys", tags=["surveys"])


# ---- helpers ---------------------------------------------------------------

def _get_survey_or_404(session: Any, survey_id: uuid.UUID) -> Survey:
    survey = session.get(Survey, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey


def _create_section_tree(
    session: Any, survey_id: uuid.UUID, sections_in: list[SurveySectionCreate]
) -> None:
    """Persist nested section -> question -> option tree."""
    for sec_in in sections_in:
        section = SurveySection(
            survey_id=survey_id,
            title=sec_in.title,
            description=sec_in.description,
            order=sec_in.order,
        )
        session.add(section)
        session.flush()

        for q_in in sec_in.questions:
            question = SurveyQuestion(
                section_id=section.id,
                text=q_in.text,
                question_type=q_in.question_type,
                is_required=q_in.is_required,
                order=q_in.order,
                allow_other=q_in.allow_other,
            )
            session.add(question)
            session.flush()

            for opt_in in q_in.options:
                option = SurveyOption(
                    question_id=question.id,
                    label=opt_in.label,
                    value=opt_in.value,
                    order=opt_in.order,
                )
                session.add(option)


# ---- CRUD ------------------------------------------------------------------

@router.get(
    "/",
    response_model=SurveysAdminList,
    dependencies=[Depends(get_current_active_superuser)],
)
def list_surveys(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> Any:
    """List all surveys (admin)."""
    count = session.exec(select(func.count()).select_from(Survey)).one()
    rows = session.exec(
        select(Survey).order_by(Survey.created_at.desc()).offset(skip).limit(limit)
    ).all()
    return SurveysAdminList(data=rows, count=count)


@router.get(
    "/{survey_id}",
    response_model=SurveyAdminDetail,
    dependencies=[Depends(get_current_active_superuser)],
)
def get_survey(survey_id: uuid.UUID, session: SessionDep) -> Any:
    """Get a single survey with full section/question tree (admin)."""
    survey = _get_survey_or_404(session, survey_id)
    return survey


@router.post(
    "/",
    response_model=SurveyAdminDetail,
    dependencies=[Depends(get_current_active_superuser)],
)
def create_survey(
    body: SurveyCreate, session: SessionDep, current_user: CurrentUser
) -> Any:
    """Create a survey with nested sections/questions/options (admin)."""
    survey = Survey(
        title=body.title,
        description=body.description,
        created_by_id=current_user.id,
    )
    session.add(survey)
    session.flush()

    _create_section_tree(session, survey.id, body.sections)

    session.commit()
    session.refresh(survey)
    return survey


@router.put(
    "/{survey_id}",
    response_model=SurveyAdminView,
    dependencies=[Depends(get_current_active_superuser)],
)
def update_survey(
    survey_id: uuid.UUID, body: SurveyUpdate, session: SessionDep
) -> Any:
    """Update survey title/description. Only allowed while draft."""
    survey = _get_survey_or_404(session, survey_id)
    if survey.status != "draft":
        raise HTTPException(
            status_code=409, detail="Cannot edit a survey that is not in draft status"
        )
    update_dict = body.model_dump(exclude_unset=True)
    survey.sqlmodel_update(update_dict)
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return survey


# ---- publish / close -------------------------------------------------------

@router.post(
    "/{survey_id}/publish",
    response_model=SurveyAdminView,
    dependencies=[Depends(get_current_active_superuser)],
)
def publish_survey(survey_id: uuid.UUID, session: SessionDep) -> Any:
    """Transition a survey from draft -> published."""
    survey = _get_survey_or_404(session, survey_id)
    if survey.status != "draft":
        raise HTTPException(
            status_code=409,
            detail=f"Cannot publish: current status is '{survey.status}'",
        )
    survey.status = "published"
    survey.published_at = get_datetime_utc()
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return survey


@router.post(
    "/{survey_id}/close",
    response_model=SurveyAdminView,
    dependencies=[Depends(get_current_active_superuser)],
)
def close_survey(survey_id: uuid.UUID, session: SessionDep) -> Any:
    """Transition a survey from published -> closed."""
    survey = _get_survey_or_404(session, survey_id)
    if survey.status != "published":
        raise HTTPException(
            status_code=409,
            detail=f"Cannot close: current status is '{survey.status}'",
        )
    survey.status = "closed"
    survey.closed_at = get_datetime_utc()
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return survey


# ---- token batch generation ------------------------------------------------

@router.post(
    "/{survey_id}/tokens",
    response_model=TokenGenerateResponse,
    dependencies=[Depends(get_current_active_superuser)],
)
def generate_tokens(
    survey_id: uuid.UUID, body: TokenGenerateRequest, session: SessionDep
) -> Any:
    """
    Generate a batch of single-use survey tokens (admin).
    Returns plaintext tokens *once* — they are stored hashed.
    """
    survey = _get_survey_or_404(session, survey_id)
    if survey.status not in ("draft", "published"):
        raise HTTPException(
            status_code=409, detail="Cannot generate tokens for a closed survey"
        )

    plaintext_tokens: list[str] = []
    for _ in range(body.count):
        raw = secrets.token_urlsafe(24)
        token_hash = hashlib.sha256(raw.encode()).hexdigest()
        token_row = SurveyToken(
            survey_id=survey.id,
            token_hash=token_hash,
            target_org_unit_id=body.target_org_unit_id,
            target_role=body.target_role,
        )
        session.add(token_row)
        plaintext_tokens.append(raw)

    session.commit()
    return TokenGenerateResponse(tokens=plaintext_tokens, count=len(plaintext_tokens))
