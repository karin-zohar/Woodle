---
name: code-review
description: Review code for correctness, React/state patterns, security, and maintainability. Use when reviewing pull requests, examining code changes, or when the user asks for a code review.
---

# Code Review

## When to Apply

- User asks for a code review or review of specific code
- User shares a PR, diff, or file and wants feedback
- Reviewing changes before commit or merge

## Default Scope

**By default, review only the changes in the current branch.** Use `git diff` against the base branch (e.g. `main` or `master`) to get the changed files and lines. Do not review the entire codebase unless the user explicitly asks. If the user points at specific files or a PR, limit the review to that scope.

## Quick Process

1. **Open checklist**: At the start of every code review, **open the review checklist in a separate editor tab** so the user can reference it: read/open `.cursor/skills/code-review/CHECKLIST.md` (this will open it in a tab).
2. **Scope**: Identify what changed (current-branch diff or user-specified files).
3. **Check**: Run through the checklist in CHECKLIST.md.
4. **Report**: Use the feedback format: a single numbered list (most critical → nice to have); be concise and actionable.

## Review Checklist

The full checklist lives in **[CHECKLIST.md](.cursor/skills/code-review/CHECKLIST.md)**. Open that file in a separate editor tab at the start of each review.

## Feedback Format

**Present the review as a numbered list**, ordered from **most critical** to **nice to have**, so issues can be referred to by number (e.g. "fix #3").

1. **Critical** — Must fix before merge (bugs, security, broken behavior).
2. **Suggestion** — Should consider (performance, clarity, minor bugs).
3. **Nice to have** — Optional improvement (style, docs, refactors).

- Number each finding in a single list; higher numbers = lower priority.
- Keep each item to 1–2 sentences with a concrete fix or next step when possible.

## Project Context

- Stack: React, TypeScript, Vite. ESLint: react-hooks, react-refresh, TypeScript recommended.
- Prefer existing patterns in `libs/` and `src/` (hooks, store slices, components).
- For detailed project standards, see [STANDARDS.md](STANDARDS.md).
