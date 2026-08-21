---
name: no-touch
description: Strongly enforces a read-only, no-modification policy on all workspace code and configuration files. Strictly prohibits modifying existing files while allowing temporary scratch files if necessary.
---

# No-Touch Skill Policy

This skill enforces a **strict non-destructive / read-only policy** for all workspace files.

## Core Rules & Constraints

1. **NEVER Modify Existing Files**:
   - Do NOT use file modification tools (`replace_file_content`, `multi_replace_file_content`, etc.) on existing source, configuration, documentation, or asset files.
   - Do NOT overwrite existing workspace files using `write_to_file`.
   - Preserve all existing files in their exact current state.

2. **Temporary Files Only (If Needed)**:
   - Creating temporary or scratch files is allowed ONLY if strictly required for verification, analysis, or scratchpad computation needed by the prompt.
   - All temporary files must be placed in scratch / temporary locations (e.g. within artifacts/scratch or temporary paths) and should not pollute source directories.

3. **Read-Only Analysis & Explanation**:
   - Use investigation and inspection tools (`view_file`, `grep_search`, `list_dir`, etc.) to analyze code.
   - Provide answers through clear markdown explanations, code snippets, diff illustrations, and tables in the chat response.
