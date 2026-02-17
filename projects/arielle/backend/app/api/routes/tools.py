import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep, get_current_active_superuser
from app.models import (
    AiTool,
    AiToolAlias,
    AiToolCreate,
    AiToolsListResponse,
    AiToolUpdate,
    AiToolView,
    MatchRebuildResponse,
    Message,
    ToolUsage,
)

router = APIRouter(prefix="/tools", tags=["tools"])


# ---- CRUD ------------------------------------------------------------------

@router.get(
    "/",
    response_model=AiToolsListResponse,
    dependencies=[Depends(get_current_active_superuser)],
)
def list_tools(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """List all whitelisted AI tools (admin)."""
    count = session.exec(select(func.count()).select_from(AiTool)).one()
    rows = session.exec(
        select(AiTool).order_by(AiTool.name).offset(skip).limit(limit)
    ).all()
    return AiToolsListResponse(data=rows, count=count)


@router.get(
    "/{tool_id}",
    response_model=AiToolView,
    dependencies=[Depends(get_current_active_superuser)],
)
def get_tool(tool_id: uuid.UUID, session: SessionDep) -> Any:
    """Get a single tool with aliases (admin)."""
    tool = session.get(AiTool, tool_id)
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    return tool


@router.post(
    "/",
    response_model=AiToolView,
    dependencies=[Depends(get_current_active_superuser)],
)
def create_tool(body: AiToolCreate, session: SessionDep) -> Any:
    """Create a new AI tool with optional aliases (admin)."""
    existing = session.exec(
        select(AiTool).where(AiTool.name == body.name)
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Tool with this name already exists")

    tool = AiTool(
        name=body.name,
        vendor=body.vendor,
        description=body.description,
        risk_level=body.risk_level,
        website_url=body.website_url,
    )
    session.add(tool)
    session.flush()

    for alias_str in body.aliases:
        session.add(AiToolAlias(tool_id=tool.id, alias=alias_str))

    session.commit()
    session.refresh(tool)
    return tool


@router.put(
    "/{tool_id}",
    response_model=AiToolView,
    dependencies=[Depends(get_current_active_superuser)],
)
def update_tool(tool_id: uuid.UUID, body: AiToolUpdate, session: SessionDep) -> Any:
    """Update a tool. If aliases list is provided it replaces all existing aliases."""
    tool = session.get(AiTool, tool_id)
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")

    update_data = body.model_dump(exclude_unset=True, exclude={"aliases"})
    tool.sqlmodel_update(update_data)
    session.add(tool)

    if body.aliases is not None:
        # Delete existing aliases and replace
        existing = session.exec(
            select(AiToolAlias).where(AiToolAlias.tool_id == tool.id)
        ).all()
        for a in existing:
            session.delete(a)
        session.flush()
        for alias_str in body.aliases:
            session.add(AiToolAlias(tool_id=tool.id, alias=alias_str))

    session.commit()
    session.refresh(tool)
    return tool


@router.delete(
    "/{tool_id}",
    dependencies=[Depends(get_current_active_superuser)],
)
def delete_tool(tool_id: uuid.UUID, session: SessionDep) -> Message:
    """Delete a tool (admin)."""
    tool = session.get(AiTool, tool_id)
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    session.delete(tool)
    session.commit()
    return Message(message="Tool deleted successfully")


# ---- match / rebuild -------------------------------------------------------

def _build_lookup(session: Any) -> dict[str, uuid.UUID]:
    """Build a normalized-name -> tool_id lookup from canonical names + aliases."""
    lookup: dict[str, uuid.UUID] = {}

    tools = session.exec(select(AiTool)).all()
    for tool in tools:
        lookup[tool.name.strip().lower()] = tool.id

    aliases = session.exec(select(AiToolAlias)).all()
    for alias in aliases:
        lookup[alias.alias.strip().lower()] = alias.tool_id

    return lookup


@router.post(
    "/match/rebuild",
    response_model=MatchRebuildResponse,
    dependencies=[Depends(get_current_active_superuser)],
)
def rebuild_matches(session: SessionDep) -> Any:
    """
    Re-match all ToolUsage rows against the current whitelist.
    Uses exact normalized match (lower + strip) against canonical names and aliases.
    Sets matched_tool_id and match_confidence (1.0 for exact, null for no match).
    """
    lookup = _build_lookup(session)

    usages = session.exec(select(ToolUsage)).all()
    matched = 0
    for usage in usages:
        normalized = usage.raw_name.strip().lower()
        tool_id = lookup.get(normalized)
        if tool_id:
            usage.matched_tool_id = tool_id
            usage.match_confidence = 1.0
            matched += 1
        else:
            usage.matched_tool_id = None
            usage.match_confidence = None
        session.add(usage)

    session.commit()

    total = len(usages)
    return MatchRebuildResponse(
        total_usages=total,
        matched=matched,
        unmatched=total - matched,
    )
