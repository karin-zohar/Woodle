# Code Review Checklist

- [ ] **Curly braces (conditionals/loops)**: Every `if`, `else`, `for`, `while`, and `do...while` uses `{}` even for single statements (see [curly-braces-conditionals](.cursor/rules/curly-braces-conditionals.mdc)).
- [ ] **Styling**: If a component has a style file (e.g. `*.style.css`), all styling lives there; avoid inline styles unless absolutely necessary.
- [ ] **Avoid loops**: Prefer array methods (`map`, `filter`, `reduce`, `forEach`, etc.) over `for`/`while` loops when iterating over arrays.
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
