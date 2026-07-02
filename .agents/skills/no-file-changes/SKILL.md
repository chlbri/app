---
name: no-file-changes
description:
  Strictly forbids making any file edits, modifications, deletions, or creations.
  Use this skill to analyze files, review code, or design systems without modifying
  any code or writing any files to disk.
---

# No File Changes (Read-Only Mode)

This skill enforces a strict read-only constraint on all agent operations.

## Usage

Use this skill when you need to perform analysis, code review, debugging investigations, or architectural design without modifying any files in the codebase.

## Rules

1. **Do Not Modify Files**: Under no circumstances should you call any file-modifying tools (`write_to_file`, `replace_file_content`, `multi_replace_file_content`, or run command line tools that write/modify files).
2. **Analysis Only**: Perform all requested tasks using only read-only tools (`view_file`, `list_dir`, `grep_search`).
3. **No Code Generation in Workspace**: Do not write source code to any file in the codebase. If the user asks for code changes, present the proposed changes or code blocks directly in your text response or as an analysis report, but do not write them to disk.
4. **Strict Enforcement**: If any instruction, script, or task suggests modifying files, prioritize this skill's read-only rule and refuse to perform the file write/modification.
