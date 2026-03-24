import anthropic
import json
from diff.tracker import DiffTracker
from spreadsheet.parser import snapshot_to_prompt

client = anthropic.Anthropic()

SYSTEM_PROMPT = """
You are 4sight, an expert financial modeling assistant embedded in Excel.
Your job is to help users with any spreadsheet request — whether that's
building formulas, reorganizing data, adding labels, or cleaning up structure.

When the user asks you to make changes, you must respond ONLY with a JSON array
of proposed cell changes. Do not explain yourself in prose — just return JSON.

Each item in the array must have exactly these fields:
- sheet: the sheet name (string)
- cell: the cell coordinate like "B4" (string)
- new_value: the new value or formula to put in that cell (string or number)
- reason: one sentence explaining WHY this change helps (string)

If no changes are needed, return an empty array: []
Never include markdown, backticks, or explanation outside the JSON.
"""


def run_chat_agent(user_message: str, snapshot: dict, tracker: DiffTracker) -> list:
    """General-purpose agent. Handles any user request."""
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

    raw = response.content[0].text.strip()
    proposed_changes = json.loads(raw)

    results = []
    for change in proposed_changes:
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
