import hashlib
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import SessionDep
from app.models import (
    Survey,
    SurveyAnswer,
    SurveyPublicView,
    SurveyResponse,
    SurveySubmitRequest,
    SurveySubmitResponse,
    SurveyToken,
    get_datetime_utc,
)

router = APIRouter(prefix="/surveys", tags=["public-surveys"])


def _hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode()).hexdigest()


def _resolve_token(session: Any, raw_token: str) -> SurveyToken:
    """Look up a token by its SHA-256 hash. Raises 404 / 410 as needed."""
    token_hash = _hash_token(raw_token)
    stmt = select(SurveyToken).where(SurveyToken.token_hash == token_hash)
    token_row = session.exec(stmt).first()
    if not token_row:
        raise HTTPException(status_code=404, detail="Survey token not found")
    return token_row


@router.get("/{token}", response_model=SurveyPublicView)
def get_public_survey(token: str, session: SessionDep) -> Any:
    """
    Return the full survey structure for a given public token.
    No authentication required.
    """
    token_row = _resolve_token(session, token)

    if token_row.used_at is not None:
        raise HTTPException(status_code=409, detail="Token has already been used")

    survey = session.get(Survey, token_row.survey_id)
    if not survey or survey.status != "published":
        raise HTTPException(status_code=404, detail="Survey not found or not published")

    return SurveyPublicView(
        id=survey.id,
        title=survey.title,
        description=survey.description,
        sections=survey.sections,
        target_org_unit_id=token_row.target_org_unit_id,
        target_role=token_row.target_role,
    )


@router.post("/{token}/submit", response_model=SurveySubmitResponse)
def submit_public_survey(
    token: str, body: SurveySubmitRequest, session: SessionDep
) -> Any:
    """
    Submit answers for a public survey. Marks the token as used.
    Returns 409 if token was already consumed.
    """
    token_row = _resolve_token(session, token)

    if token_row.used_at is not None:
        raise HTTPException(status_code=409, detail="Token has already been used")

    survey = session.get(Survey, token_row.survey_id)
    if not survey or survey.status != "published":
        raise HTTPException(status_code=404, detail="Survey not found or not published")

    # Create the response row
    response = SurveyResponse(
        survey_id=survey.id,
        token_id=token_row.id,
        org_unit_id=body.org_unit_id,
        role_title=body.role_title,
    )
    session.add(response)
    session.flush()  # get response.id before inserting answers

    # Create answer rows
    for ans in body.answers:
        answer = SurveyAnswer(
            response_id=response.id,
            question_id=ans.question_id,
            value_json=ans.value,
        )
        session.add(answer)

    # Mark token as used
    token_row.used_at = get_datetime_utc()
    session.add(token_row)

    session.commit()
    session.refresh(response)

    return SurveySubmitResponse(
        response_id=response.id,
        message="Survey submitted successfully",
    )
