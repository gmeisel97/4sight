# 4sight — Cursor for Excel

> **AI-powered spreadsheet editing with cell-level diffs. Built for founders, by founders.**

4sight is an AI overlay for Excel and Google Sheets that lets users chat with their spreadsheet in plain English and see proposed changes cell by cell — accepting or rejecting each one, like a code diff. Think Cursor, but for finance.

---

## The Problem

Founders speak vision. Investors speak numbers. The gap between them isn't ambition — it's communication.

- Building financial projections requires finance expertise most early founders don't have
- Generic AI tools (ChatGPT, etc.) generate full models instantly, but you can't see what changed, can't tweak one cell, and can't trust the assumptions
- Raw Excel gives you full control, but requires hours and a finance degree to build something good

**4sight is the middle ground**: AI proposes, humans decide — one cell at a time.

---

## How It Works

```
1. UPLOAD   →   Drop in your Excel or Google Sheets file
2. CHAT     →   Ask in plain English: "Add an LTV:CAC analysis" or "Build a sensitivity table"
3. REVIEW   →   See every proposed change before it touches your spreadsheet
4. DECIDE   →   Accept or reject each change individually, like a code diff
```

---

## Key Features

**Chat Interface** — Talk to your spreadsheet like a person. No formulas, no finance degree required.

**Cell-Level Diff System** — Every AI-proposed change is staged as "pending" before touching your data. Accept, reject, or rethink change by change — full transparency, full control.

**VC-Grade Financial Intelligence** — Built-in knowledge of Seed through Series B best practices including:
- Unit economics (LTV, CAC, NRR, Magic Number, CAC Payback Period)
- Three-statement model integrity (P&L, Balance Sheet, Cash Flow linkage)
- Gross margin benchmarks by industry
- Cap table modeling (SAFEs, priced rounds, dilution, liquidation waterfalls)
- Valuation methods (revenue multiples, DCF, comparable company analysis)

**IB Formatting Standards** — Automatically enforces investment banking formatting conventions:
- Three-color system (blue = inputs, black = formulas, green = cross-sheet references)
- Visual hierarchy (section headers, summaries, worksheet titles)
- Number format standards (parentheses for negatives, thousands separators, currency)

**Specialized Agents** — Purpose-built AI agents for specific financial tasks:
- `chat_agent` — General purpose, handles any request
- `ltv_cac_agent` — LTV:CAC specialist with formula expertise
- `sensitivity_agent` — Builds scenario and sensitivity tables
- `dashboard_agent` — Creates KPI summary blocks and dashboards

**Format Checker** — Dedicated endpoint that audits any spreadsheet against IB standards and returns a prioritized list of formatting fixes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, Uvicorn |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Spreadsheet Parsing | openpyxl, pandas |
| Frontend | React |
| Data Validation | Pydantic |
| Config Management | python-dotenv, pydantic-settings |

---

## Project Structure

```
4sight/
├── backend/
│   └── foresight/
│       ├── agents/                  # AI agents (one per specialized job)
│       │   ├── base_agent.py        # Core agent — VC + IB formatting knowledge
│       │   ├── chat_agent.py        # General purpose
│       │   ├── ltv_cac_agent.py     # LTV:CAC specialist
│       │   ├── sensitivity_agent.py # Scenario/sensitivity tables
│       │   └── dashboard_agent.py   # KPI summaries
│       ├── api/
│       │   └── routes.py            # FastAPI endpoints
│       ├── db/                      # Database models (future)
│       ├── diff/
│       │   └── tracker.py           # Cell-level change staging system
│       ├── skills/
│       │   └── 4sight/
│       │       ├── SKILL.md         # Claude Code architecture blueprint
│       │       └── references/
│       │           ├── vc_best_practices.md          # Seed-Series B standards
│       │           └── excel_formatting_standards.md # IB formatting rules
│       ├── spreadsheet/
│       │   └── parser.py            # Excel/CSV parser and snapshot builder
│       ├── config.py                # Environment and settings
│       ├── server.py                # FastAPI entry point
│       └── .env.example             # Required environment variables
└── frontend/                        # React frontend (in progress)
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload an Excel file, returns `session_id` |
| POST | `/api/chat` | Send a message, returns proposed cell changes |
| POST | `/api/accept` | Accept a proposed change — applies it to the spreadsheet |
| POST | `/api/reject` | Reject a proposed change — discards it |
| GET | `/api/pending/{session_id}` | Get all pending changes awaiting review |
| POST | `/api/format-check` | Run a full IB formatting audit on the spreadsheet |

Interactive API docs available at `http://localhost:8000/docs` when running locally.

---

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+ (for frontend)
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/gmeisel97/4sight.git
cd 4sight/backend/foresight

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install fastapi uvicorn anthropic openpyxl pandas python-dotenv pydantic-settings

# 4. Set up your environment variables
cp .env.example .env
# Edit .env and add your Anthropic API key

# 5. Start the server
uvicorn server:app --reload --port 8000
```

Server runs at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

```bash
# In a separate terminal
cd 4sight/frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

---

## Environment Variables

Create a `.env` file in `backend/foresight/` with the following:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

⚠️ Never commit your `.env` file. It is listed in `.gitignore` and will not be included in pushes to GitHub.

---

## The Diff System — Our Core Differentiator

The key architectural decision that makes 4sight different from every other AI spreadsheet tool is the **DiffTracker**. Every AI-proposed change goes through `DiffTracker.propose()` and is stored as `pending` before it touches any data. Nothing is written to the spreadsheet until the user explicitly accepts it.

This means:
- **Full auditability** — every change has a reason attached
- **Full control** — users can reject any change they disagree with
- **Full trust** — the AI proposes, humans decide

This is exactly what investors and finance professionals said they needed in our customer discovery: not an AI that rewrites their model, but an AI that shows its work and earns approval before changing anything.

---

## Roadmap

- [x] Core FastAPI backend with cell-level diff system
- [x] Multi-agent architecture (chat, LTV/CAC, sensitivity, dashboard)
- [x] VC best practices knowledge base (Seed → Series B)
- [x] IB formatting standards (Berkeley-Haas DFMW)
- [x] Format-check endpoint
- [ ] React frontend with Chat and Changes tabs
- [ ] Excel/Google Sheets browser extension
- [ ] Rules engine (custom formatting constraints)
- [ ] Professional templates library (SaaS model, DCF, LBO, Cap Table)
- [ ] Multi-user collaboration and version history
- [ ] Direct Excel file write-back on accept

---

## Why Now

1. **AI agents can now control a screen** — the technical capability exists
2. **Cursor proved the market** — developers paid $20-100/month for a better IDE; finance professionals will pay the same for a better spreadsheet
3. **The gap is wide open** — everyone is using ChatGPT to draft models; nobody has solved precise editing, diffs, and auditability

**That's 4sight.**

---

*For questions or partnership inquiries, reach out via GitHub Issues.*
