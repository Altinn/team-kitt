import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from pydantic import EmailStr
from sqlalchemy import Column, DateTime, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime | None = None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime | None = None


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


# ---------------------------------------------------------------------------
# Org structure
# ---------------------------------------------------------------------------

class OrgUnit(SQLModel, table=True):
    __tablename__ = "org_unit"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=255)
    level: str = Field(max_length=50)  # "department", "section", "team"
    parent_id: uuid.UUID | None = Field(
        default=None, foreign_key="org_unit.id", nullable=True
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )

    parent: Optional["OrgUnit"] = Relationship(
        back_populates="children",
        sa_relationship_kwargs={"remote_side": "OrgUnit.id"},
    )
    children: list["OrgUnit"] = Relationship(back_populates="parent")


# ---------------------------------------------------------------------------
# Survey structure
# ---------------------------------------------------------------------------

class Survey(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=500)
    description: str | None = Field(default=None, sa_column=Column(Text))
    status: str = Field(default="draft", max_length=20)  # draft / published / closed
    created_by_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=True
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    published_at: datetime | None = Field(
        default=None, sa_type=DateTime(timezone=True)  # type: ignore
    )
    closed_at: datetime | None = Field(
        default=None, sa_type=DateTime(timezone=True)  # type: ignore
    )

    sections: list["SurveySection"] = Relationship(
        back_populates="survey", cascade_delete=True
    )
    tokens: list["SurveyToken"] = Relationship(
        back_populates="survey", cascade_delete=True
    )
    responses: list["SurveyResponse"] = Relationship(
        back_populates="survey", cascade_delete=True
    )


class SurveySection(SQLModel, table=True):
    __tablename__ = "survey_section"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    survey_id: uuid.UUID = Field(foreign_key="survey.id", nullable=False, ondelete="CASCADE")
    title: str = Field(max_length=500)
    description: str | None = Field(default=None, sa_column=Column(Text))
    order: int = Field(default=0)

    survey: Survey | None = Relationship(back_populates="sections")
    questions: list["SurveyQuestion"] = Relationship(
        back_populates="section", cascade_delete=True
    )


class SurveyQuestion(SQLModel, table=True):
    __tablename__ = "survey_question"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    section_id: uuid.UUID = Field(
        foreign_key="survey_section.id", nullable=False, ondelete="CASCADE"
    )
    text: str = Field(sa_column=Column(Text, nullable=False))
    question_type: str = Field(max_length=50)  # single_choice / multi_choice / free_text / likert
    is_required: bool = Field(default=True)
    order: int = Field(default=0)
    allow_other: bool = Field(default=False)

    section: SurveySection | None = Relationship(back_populates="questions")
    options: list["SurveyOption"] = Relationship(
        back_populates="question", cascade_delete=True
    )


class SurveyOption(SQLModel, table=True):
    __tablename__ = "survey_option"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    question_id: uuid.UUID = Field(
        foreign_key="survey_question.id", nullable=False, ondelete="CASCADE"
    )
    label: str = Field(max_length=500)
    value: str = Field(max_length=255)
    order: int = Field(default=0)

    question: SurveyQuestion | None = Relationship(back_populates="options")


# ---------------------------------------------------------------------------
# Survey tokens (public access links)
# ---------------------------------------------------------------------------

class SurveyToken(SQLModel, table=True):
    __tablename__ = "survey_token"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    survey_id: uuid.UUID = Field(foreign_key="survey.id", nullable=False, ondelete="CASCADE")
    token_hash: str = Field(max_length=255, unique=True, index=True)
    target_org_unit_id: uuid.UUID | None = Field(
        default=None, foreign_key="org_unit.id", nullable=True
    )
    target_role: str | None = Field(default=None, max_length=255)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    expires_at: datetime | None = Field(
        default=None, sa_type=DateTime(timezone=True)  # type: ignore
    )
    used_at: datetime | None = Field(
        default=None, sa_type=DateTime(timezone=True)  # type: ignore
    )

    survey: Survey | None = Relationship(back_populates="tokens")


# ---------------------------------------------------------------------------
# Survey responses & answers
# ---------------------------------------------------------------------------

class SurveyResponse(SQLModel, table=True):
    __tablename__ = "survey_response"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    survey_id: uuid.UUID = Field(foreign_key="survey.id", nullable=False, ondelete="CASCADE")
    token_id: uuid.UUID | None = Field(
        default=None, foreign_key="survey_token.id", nullable=True
    )
    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="user.id", nullable=True
    )
    org_unit_id: uuid.UUID | None = Field(
        default=None, foreign_key="org_unit.id", nullable=True
    )
    role_title: str | None = Field(default=None, max_length=255)
    submitted_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )

    survey: Survey | None = Relationship(back_populates="responses")
    answers: list["SurveyAnswer"] = Relationship(
        back_populates="response", cascade_delete=True
    )
    tool_usages: list["ToolUsage"] = Relationship(
        back_populates="response", cascade_delete=True
    )


class SurveyAnswer(SQLModel, table=True):
    __tablename__ = "survey_answer"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    response_id: uuid.UUID = Field(
        foreign_key="survey_response.id", nullable=False, ondelete="CASCADE"
    )
    question_id: uuid.UUID = Field(
        foreign_key="survey_question.id", nullable=False, ondelete="CASCADE"
    )
    value_json: Any = Field(default=None, sa_column=Column(JSONB))

    response: SurveyResponse | None = Relationship(back_populates="answers")


# ---------------------------------------------------------------------------
# AI Tool whitelist
# ---------------------------------------------------------------------------

class AiTool(SQLModel, table=True):
    __tablename__ = "ai_tool"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=255, unique=True, index=True)
    vendor: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, sa_column=Column(Text))
    risk_level: str | None = Field(default=None, max_length=50)  # approved / review / rejected
    website_url: str | None = Field(default=None, max_length=500)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )

    aliases: list["AiToolAlias"] = Relationship(
        back_populates="tool", cascade_delete=True
    )


class AiToolAlias(SQLModel, table=True):
    __tablename__ = "ai_tool_alias"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tool_id: uuid.UUID = Field(
        foreign_key="ai_tool.id", nullable=False, ondelete="CASCADE"
    )
    alias: str = Field(max_length=255, index=True)

    tool: AiTool | None = Relationship(back_populates="aliases")


# ---------------------------------------------------------------------------
# Tool usage (extracted from survey answers)
# ---------------------------------------------------------------------------

class ToolUsage(SQLModel, table=True):
    __tablename__ = "tool_usage"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    response_id: uuid.UUID = Field(
        foreign_key="survey_response.id", nullable=False, ondelete="CASCADE"
    )
    raw_name: str = Field(max_length=500)
    matched_tool_id: uuid.UUID | None = Field(
        default=None, foreign_key="ai_tool.id", nullable=True
    )
    match_confidence: float | None = Field(default=None)
    usage_frequency: str | None = Field(default=None, max_length=100)
    purpose_tags: Any = Field(default=None, sa_column=Column(JSONB))

    response: SurveyResponse | None = Relationship(back_populates="tool_usages")


# ---------------------------------------------------------------------------
# Public survey schemas (DTOs)
# ---------------------------------------------------------------------------

class SurveyOptionPublic(SQLModel):
    id: uuid.UUID
    label: str
    value: str
    order: int


class SurveyQuestionPublic(SQLModel):
    id: uuid.UUID
    text: str
    question_type: str
    is_required: bool
    order: int
    allow_other: bool
    options: list[SurveyOptionPublic] = []


class SurveySectionPublic(SQLModel):
    id: uuid.UUID
    title: str
    description: str | None = None
    order: int
    questions: list[SurveyQuestionPublic] = []


class SurveyPublicView(SQLModel):
    """Returned by GET /api/public/surveys/{token}."""
    id: uuid.UUID
    title: str
    description: str | None = None
    sections: list[SurveySectionPublic] = []
    target_org_unit_id: uuid.UUID | None = None
    target_role: str | None = None


class AnswerSubmit(SQLModel):
    question_id: uuid.UUID
    value: Any  # stored as JSONB


class SurveySubmitRequest(SQLModel):
    """POST body for /api/public/surveys/{token}/submit."""
    org_unit_id: uuid.UUID | None = None
    role_title: str | None = None
    answers: list[AnswerSubmit]


class SurveySubmitResponse(SQLModel):
    response_id: uuid.UUID
    message: str


# ---------------------------------------------------------------------------
# Admin survey schemas (DTOs)
# ---------------------------------------------------------------------------

class SurveyOptionCreate(SQLModel):
    label: str = Field(max_length=500)
    value: str = Field(max_length=255)
    order: int = 0


class SurveyQuestionCreate(SQLModel):
    text: str
    question_type: str = Field(max_length=50)
    is_required: bool = True
    order: int = 0
    allow_other: bool = False
    options: list[SurveyOptionCreate] = []


class SurveySectionCreate(SQLModel):
    title: str = Field(max_length=500)
    description: str | None = None
    order: int = 0
    questions: list[SurveyQuestionCreate] = []


class SurveyCreate(SQLModel):
    title: str = Field(max_length=500)
    description: str | None = None
    sections: list[SurveySectionCreate] = []


class SurveyUpdate(SQLModel):
    title: str | None = None
    description: str | None = None


class SurveyAdminView(SQLModel):
    """Admin list / detail view."""
    id: uuid.UUID
    title: str
    description: str | None = None
    status: str
    created_by_id: uuid.UUID | None = None
    created_at: datetime | None = None
    published_at: datetime | None = None
    closed_at: datetime | None = None


class SurveyAdminDetail(SurveyAdminView):
    """Admin detail view with nested sections."""
    sections: list[SurveySectionPublic] = []


class SurveysAdminList(SQLModel):
    data: list[SurveyAdminView]
    count: int


class TokenGenerateRequest(SQLModel):
    count: int = Field(ge=1, le=1000)
    target_org_unit_id: uuid.UUID | None = None
    target_role: str | None = None


class TokenGenerateResponse(SQLModel):
    tokens: list[str]
    count: int


# ---------------------------------------------------------------------------
# AI Tool schemas (DTOs)
# ---------------------------------------------------------------------------

class AiToolAliasView(SQLModel):
    id: uuid.UUID
    alias: str


class AiToolView(SQLModel):
    id: uuid.UUID
    name: str
    vendor: str | None = None
    description: str | None = None
    risk_level: str | None = None
    website_url: str | None = None
    created_at: datetime | None = None
    aliases: list[AiToolAliasView] = []


class AiToolsListResponse(SQLModel):
    data: list[AiToolView]
    count: int


class AiToolCreate(SQLModel):
    name: str = Field(max_length=255)
    vendor: str | None = None
    description: str | None = None
    risk_level: str | None = Field(default=None, max_length=50)
    website_url: str | None = None
    aliases: list[str] = []


class AiToolUpdate(SQLModel):
    name: str | None = None
    vendor: str | None = None
    description: str | None = None
    risk_level: str | None = None
    website_url: str | None = None
    aliases: list[str] | None = None  # if provided, replaces all aliases


class MatchRebuildResponse(SQLModel):
    total_usages: int
    matched: int
    unmatched: int


# ---------------------------------------------------------------------------
# Metrics schemas (DTOs)
# ---------------------------------------------------------------------------

class MetricsOverview(SQLModel):
    survey_id: uuid.UUID
    scope: str | None = None
    scope_id: uuid.UUID | None = None
    response_count: int
    tool_usage_count: int
    approved_count: int
    review_count: int
    rejected_count: int
    unmatched_count: int


class ToolMetricItem(SQLModel):
    tool_name: str
    tool_id: uuid.UUID | None = None
    usage_count: int
    risk_level: str | None = None
    color: str  # green / yellow / red / gray


# ---------------------------------------------------------------------------
# Question-level metrics schemas (DTOs)
# ---------------------------------------------------------------------------

class AnswerBreakdownItem(SQLModel):
    value: str
    count: int

class QuestionMetric(SQLModel):
    question_id: uuid.UUID
    question_text: str
    question_type: str
    section_title: str
    section_order: int
    question_order: int
    total_answers: int
    breakdown: list[AnswerBreakdownItem]
    free_text_samples: list[str] = []
