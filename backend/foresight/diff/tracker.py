from dataclasses import dataclass, field
from typing import Any, Optional
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
