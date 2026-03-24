---
name: 4sight
description: >
  Use this skill whenever building any feature of 4sight — the "Cursor for Excel"
  AI assistant. This skill covers spreadsheet parsing, AI-powered change proposals,
  the cell-level diff/accept/reject system, agents, rules, and templates.
  Trigger this skill any time the user asks to: upload or analyze a spreadsheet,
  propose or apply cell changes, build the chat interface, create a new agent,
  add a rule, add a template, or work on any part of the 4sight backend or frontend.
---

# 4sight Skill

4sight is an AI overlay for Excel and Google Sheets. It lets users chat with their
spreadsheet in plain English, then see AI-proposed changes cell by cell — accepting
or rejecting each one, like a code diff. Think Cursor, but for finance.

---

## Core Philosophy

Always remember the three things that make 4sight different from ChatGPT:
1. **Precision** — changes happen at the cell level, not to the whole sheet at once.
2. **Auditability** — every change is tracked. The user can always see what changed, why, and who approved it.
3. **Trust** — the user is always in control. AI proposes. Humans decide.

Never write code that modifies a spreadsheet without first staging the changes
in the diff system so the user can review them.

---

## Project Structure

```
backend/foresight/
├── agents/         # AI agents (each does one specialized job)
├── api/            # FastAPI route handlers (URL endpoints)
├── db/             # Database models and storage logic
├── diff/           # Change tracking: propose, accept, reject
├── spreadsheet/    # Excel/CSV parsing and cell manipulation
├── skills/         # This skill and future skills
├── config.py       # API keys, settings, environment variables
├── server.py       # Entry point — starts the FastAPI server
└── __init__.py     # Makes this a Python package
```

---

## Module 1: Spreadsheet Parser (`spreadsheet/`)

### Purpose
Read an uploaded Excel file and turn it into a structured format that the AI can
understand and that the diff system can track.

### Key file: `spreadsheet/parser.py`

```python
import openpyxl
import pandas as pd
from typing import Any

def parse_excel(file_path: str) -> dict:
    """
    Reads an Excel file and returns a structured snapshot of every cell.
    This snapshot is what gets passed to the AI for analysis.
    
    Returns a dict like:
    {
      "Sheet1": {
        "A1": {"value": "Revenue", "formula": None},
        "B1": {"value": 100000,   "formula": "=SUM(B2:B12)"},
        ...
      }
    }
    """
    wb = openpyxl.load_workbook(file_path, data_only=False)
    snapshot = {}
    
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        snapshot[sheet_name] = {}
        for row in ws.iter_rows():
            for cell in row:
                if cell.value is not None:
                    snapshot[sheet_name][cell.coordinate] = {
                        "value": cell.value,
                        "formula": cell.value if str(cell.value).startswith("=") else None
                    }
    return snapshot


def snapshot_to_prompt(snapshot: dict) -> str:
    """
    Converts the snapshot into a readable text block that can be
    sent to Claude as context. Only includes non-empty cells.
    """
    lines = []
    for sheet, cells in snapshot.items():
        lines.append(f"Sheet: {sheet}")
        for coord, data in cells.items():
            lines.append(f"  {coord}: {data['value']}")
    return "\n".join(lines)
```

### Rules for the spreadsheet module
- Always preserve original formulas — never convert formula cells to static values.
- Never write directly to the file. Only read here. Writing goes through the diff system.
- If a file has more than 500 non-empty cells, summarize by sheet rather than listing every cell.

---

## Module 2: The Diff System (`diff/`)

### Purpose
This is 4sight's superpower. Every AI-proposed change is stored as a "diff" before
it touches the spreadsheet. The user reviews diffs and accepts or rejects each one.

### Key file: `diff/tracker.py`

```python
from dataclasses import dataclass, field
from typing import Optional
import uuid
from datetime import datetime

@dataclass
class CellChange:
    """Represents a single proposed change to one cell."""
    change_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    sheet: str = ""
    cell: str = ""           # e.g. "B4"
    old_value: Any = None
    new_value: Any = None
    reason: str = ""         # Plain English explanation shown to the user
    status: str = "pending"  # "pending", "accepted", or "rejected"
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())


class DiffTracker:
    """
    Holds all pending, accepted, and rejected changes for a session.
    This is the source of truth for what the AI wants to change.
    """
    
    def __init__(self):
        self.changes: list[CellChange] = []
    
    def propose(self, sheet, cell, old_value, new_value, reason) -> CellChange:
        """Add a proposed change. Does NOT touch the spreadsheet yet."""
        change = CellChange(
            sheet=sheet, cell=cell,
            old_value=old_value, new_value=new_value,
            reason=reason
        )
        self.changes.append(change)
        return change
    
    def accept(self, change_id: str) -> Optional[CellChange]:
        """Mark a change as accepted. The API will then apply it to the file."""
        for change in self.changes:
            if change.change_id == change_id:
                change.status = "accepted"
                return change
        return None
    
    def reject(self, change_id: str) -> Optional[CellChange]:
        """Mark a change as rejected. It will never touch the spreadsheet."""
        for change in self.changes:
            if change.change_id == change_id:
                change.status = "rejected"
                return change
        return None
    
    def pending(self) -> list[CellChange]:
        return [c for c in self.changes if c.status == "pending"]
    
    def accepted(self) -> list[CellChange]:
        return [c for c in self.changes if c.status == "accepted"]
```

### Rules for the diff system
- A change is NEVER written to the spreadsheet until its status is "accepted".
- Every change must have a plain-English `reason` — this is what the user reads in the UI.
- Change IDs must be short enough to display in a UI (8 characters is enough).

---

## Module 3: AI Agent (`agents/`)

### Purpose
Agents are the "brains." They receive the spreadsheet snapshot and a user message,
then return a list of proposed cell changes. Each agent specializes in one job.

### Key file: `agents/base_agent.py`

```python
import anthropic
import json
from diff.tracker import DiffTracker
from spreadsheet.parser import snapshot_to_prompt

client = anthropic.Anthropic()  # Reads ANTHROPIC_API_KEY from environment

SYSTEM_PROMPT = """
You are 4sight, an expert financial modeling assistant embedded in Excel.
Your job is to help users improve their spreadsheets.

When the user asks you to make changes, you must respond ONLY with a JSON array
of proposed cell changes. Do not explain yourself in prose — just return JSON.

Each item in the array must have exactly these fields:
- sheet: the sheet name (string)
- cell: the cell coordinate like "B4" (string)  
- new_value: the new value or formula to put in that cell (string or number)
- reason: one sentence explaining WHY this change helps (string)

Example response:
[
  {"sheet": "Sheet1", "cell": "B10", "new_value": "=B4*12", "reason": "Annualizes monthly revenue for the income statement."},
  {"sheet": "Sheet1", "cell": "A10", "new_value": "Annual Revenue", "reason": "Labels the new annual revenue row."}
]

If no changes are needed, return an empty array: []
Never include markdown, backticks, or explanation outside the JSON.
"""

def run_agent(user_message: str, snapshot: dict, tracker: DiffTracker) -> list:
    """
    Sends the spreadsheet context + user message to Claude,
    parses the response as cell changes, and adds them to the tracker.
    Returns the list of proposed CellChange objects.
    """
    spreadsheet_context = snapshot_to_prompt(snapshot)
    
    full_message = f"""Here is the current spreadsheet:

{spreadsheet_context}

User request: {user_message}"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": full_message}]
    )
    
    # Parse the JSON response from Claude
    raw = response.content[0].text.strip()
    proposed_changes = json.loads(raw)
    
    # Stage each change in the diff tracker (does NOT touch the spreadsheet)
    results = []
    for change in proposed_changes:
        # Look up the current value so we can show "old vs new"
        current = snapshot.get(change["sheet"], {}).get(change["cell"], {})
        old_val = current.get("value", None)
        
        staged = tracker.propose(
            sheet=change["sheet"],
            cell=change["cell"],
            old_value=old_val,
            new_value=change["new_value"],
            reason=change["reason"]
        )
        results.append(staged)
    
    return results
```

### Built-in agents to create
Build these as separate files inside `agents/`, each with their own system prompt:

**`agents/chat_agent.py`** — General purpose. Handles any user request. This is the default.

**`agents/ltv_cac_agent.py`** — Specializes in LTV:CAC analysis. Knows the standard formulas (LTV = ARPU / Churn, CAC Payback = CAC / Gross Margin, etc.).

**`agents/sensitivity_agent.py`** — Builds sensitivity tables. Takes a key assumption cell and a range, then generates a data table showing outcomes under different scenarios.

**`agents/dashboard_agent.py`** — Adds summary sections and KPI blocks to the spreadsheet. Creates clean labeled headers and summary rows.

---

## Module 4: API Routes (`api/`)

### Purpose
These are the URLs that the frontend calls. Each route handles one user action.

### Key file: `api/routes.py`

```python
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


@router.get("/pending/{session_id}")
async def get_pending(session_id: str):
    """Returns all changes still waiting for accept/reject."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    pending = sessions[session_id]["tracker"].pending()
    return {"pending": [{"change_id": c.change_id, "cell": c.cell, "reason": c.reason} for c in pending]}
```

---

## Module 5: Server Entry Point (`server.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from config import settings

app = FastAPI(
    title="4sight API",
    description="Cursor for Excel — AI-powered spreadsheet editing with cell-level diffs",
    version="0.1.0"
)

# Allow the frontend (running on a different port) to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"status": "4sight is running", "version": "0.1.0"}
```

---

## Module 6: Config (`config.py`)

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    anthropic_api_key: str
    environment: str = "development"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Rules & Templates (future modules)

### Rules (`rules/`)
Rules are constraints the AI must follow when proposing changes. Store them as a list
that gets appended to the agent's system prompt. Examples:
- "No circular references" — reject any formula that references its own cell.
- "Preserve audit trail" — never delete rows, only add new ones.
- "Assumptions cells are locked" — never modify cells in the Assumptions section.

### Templates (`spreadsheet/templates/`)
Templates are pre-built Excel files with standard structure. When a user picks a template,
load it, parse it with the spreadsheet parser, and start a new session with it.
Start with: SaaS Financial Model, DCF Valuation Model, LBO Analysis, Budget vs Actual.

---

## How to run 4sight locally

```bash
# 1. Activate your virtual environment
venv\Scripts\activate

# 2. Install dependencies
pip install fastapi uvicorn anthropic openpyxl pandas python-dotenv pydantic-settings

# 3. Create your .env file with your Anthropic API key
echo ANTHROPIC_API_KEY=your_key_here > .env

# 4. Start the server
uvicorn server:app --reload --port 8000
```

Then open your browser to `http://localhost:8000` to confirm it's running,
and `http://localhost:8000/docs` to see the interactive API documentation
(FastAPI generates this automatically — it shows every endpoint you can call).

---

## When Claude Code builds a new feature

Always follow this order:
1. Add any new data structures to `diff/tracker.py` first.
2. Add the parsing logic in `spreadsheet/`.
3. Add or update the agent in `agents/`.
4. Add the API route in `api/routes.py`.
5. Test by running the server and calling the endpoint directly.

Never skip the diff step. Every AI-proposed change goes through `DiffTracker.propose()` before touching data.
