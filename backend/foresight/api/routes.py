from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import tempfile, os

from spreadsheet.parser import parse_excel
from agents.base_agent import run_agent
from diff.tracker import DiffTracker

router = APIRouter()

# In-memory session store (replace with DB later)
sessions = {}


class ChatRequest(BaseModel):
    session_id: str
    message: str


class AcceptRequest(BaseModel):
    session_id: str
    change_id: str


class FormatCheckRequest(BaseModel):
    session_id: str


@router.post("/upload")
async def upload_spreadsheet(file: UploadFile = File(...)):
    """
    Step 1: User uploads their Excel file.
    We parse it and store the snapshot in memory.
    Returns a session_id the frontend uses for all future requests.
    """
    import uuid
    session_id = str(uuid.uuid4())[:8]

    # Save file temporarily to parse it
    with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    snapshot = parse_excel(tmp_path)
    os.unlink(tmp_path)  # Clean up temp file

    sessions[session_id] = {
        "snapshot": snapshot,
        "tracker": DiffTracker(),
        "filename": file.filename
    }

    return {"session_id": session_id, "sheets": list(snapshot.keys())}


@router.post("/chat")
async def chat(req: ChatRequest):
    """
    Step 2: User sends a message like "add an LTV calculation."
    The AI proposes changes. They are NOT applied yet.
    Returns a list of pending changes for the user to review.
    """
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[req.session_id]
    proposed = run_agent(req.message, session["snapshot"], session["tracker"])

    return {
        "proposed_changes": [
            {
                "change_id": c.change_id,
                "sheet": c.sheet,
                "cell": c.cell,
                "old_value": c.old_value,
                "new_value": c.new_value,
                "reason": c.reason
            }
            for c in proposed
        ]
    }


@router.post("/accept")
async def accept_change(req: AcceptRequest):
    """
    Step 3a: User accepts one proposed change.
    This is when the change actually gets written to the spreadsheet snapshot.
    """
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[req.session_id]
    change = session["tracker"].accept(req.change_id)

    if not change:
        raise HTTPException(status_code=404, detail="Change not found")

    # Apply the accepted change to the in-memory snapshot
    if change.sheet not in session["snapshot"]:
        session["snapshot"][change.sheet] = {}
    session["snapshot"][change.sheet][change.cell] = {"value": change.new_value, "formula": None}

    return {"status": "accepted", "change_id": req.change_id}


@router.post("/reject")
async def reject_change(req: AcceptRequest):
    """Step 3b: User rejects a proposed change. It is discarded."""
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    change = sessions[req.session_id]["tracker"].reject(req.change_id)
    if not change:
        raise HTTPException(status_code=404, detail="Change not found")

    return {"status": "rejected", "change_id": req.change_id}


@router.post("/format-check")
async def format_check(req: FormatCheckRequest):
    """
    Runs an automated formatting audit against IB standards.
    Proposes cell-level fixes for every formatting issue found.
    """
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[req.session_id]
    format_prompt = (
        "Please audit this spreadsheet against professional investment banking "
        "formatting standards. Check for: hardcoded assumptions inside formulas "
        "(should be blue input cells), incorrect font colors (inputs must be blue, "
        "formulas must be black, cross-sheet references must be green), missing "
        "labels, negative numbers shown with minus signs instead of parentheses, "
        "missing thousands separators, merged cells, visible gridlines, missing "
        "sheet titles, and inconsistent visual hierarchy. Propose specific cell-level "
        "fixes for every formatting issue you find."
    )
    proposed = run_agent(format_prompt, session["snapshot"], session["tracker"])
    return {
        "proposed_changes": [
            {
                "change_id": c.change_id,
                "sheet": c.sheet,
                "cell": c.cell,
                "old_value": c.old_value,
                "new_value": c.new_value,
                "reason": c.reason
            }
            for c in proposed
        ]
    }


@router.get("/pending/{session_id}")
async def get_pending(session_id: str):
    """Returns all changes still waiting for accept/reject."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    pending = sessions[session_id]["tracker"].pending()
    return {"pending": [{"change_id": c.change_id, "cell": c.cell, "reason": c.reason} for c in pending]}
