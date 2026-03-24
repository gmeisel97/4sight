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
