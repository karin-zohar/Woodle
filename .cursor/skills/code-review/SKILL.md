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

1. **Scope**: Identify what changed (current-branch diff or user-specified files).
2. **Check**: Run through the checklist below.
3. **Report**: Use the feedback format; be concise and actionable.

## Review Checklist

- [ ] **Coding principles**: Follows project conventions; single responsibility; clear separation of concerns.
- [ ] **Naming conventions**: Variables, functions, components, and files named consistently and descriptively (see [STANDARDS.md](STANDARDS.md)).
- [ ] **Readability**: Code is easy to follow; complex logic is explained or simplified; formatting consistent.
- [ ] **Error handling**: Timeouts, missing or incorrect API/input fields are handled; user-facing errors are clear; no unhandled rejections or silent failures.
- [ ] **Number of renders**: No unnecessary re-renders; hooks (deps, memoization) used correctly; state updates predictable.
- [ ] **Efficiency of data loading**: API calls are minimal and well-scoped; no over-fetching or redundant requests; caching considered where appropriate.
- [ ] **Overall application loading speed**: Critical path is lean; heavy work deferred or lazy-loaded; no blocking operations on initial load.
- [ ] **Correctness**: Logic is sound; edge cases and null/undefined handled.
- [ ] **Security**: No obvious vulnerabilities (XSS, injection, sensitive data exposure).
- [ ] **Maintainability**: Functions focused; duplication minimized.

## Feedback Format

Use this format so findings are easy to prioritize:

- **Critical**: Must fix before merge (bugs, security, broken behavior).
- **Suggestion**: Should consider (performance, clarity, minor bugs).
- **Nice to have**: Optional improvement (style, docs, refactors).

Keep each item to 1–2 sentences with a concrete fix or next step when possible.

## Project Context

- Stack: React, TypeScript, Vite. ESLint: react-hooks, react-refresh, TypeScript recommended.
- Prefer existing patterns in `libs/` and `src/` (hooks, store slices, components).
- For detailed project standards, see [STANDARDS.md](STANDARDS.md).
