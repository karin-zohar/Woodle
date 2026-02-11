# Code Review Standards

Project-specific criteria for Woodle (React, TypeScript, Vite).

## React & Hooks

- **useState/useReducer**: Updates are immutable; no mutating state in place.
- **useEffect**: Dependency arrays complete and correct; no missing deps that cause stale closures.
- **Custom hooks**: Follow patterns in `libs/hooks/` (e.g. `useGame`, `useModal`); return stable references where it matters.
- **Components**: Prefer small, single-purpose components; props typed with interfaces.

## State & Data

- **Redux/store**: Use slices in `src/store/slices/`; keep actions and reducers simple; avoid putting derived data in store when it can be computed.
- **Events**: Custom events via `libs/helpers/dispatchCustomEvent.ts` and `libs/constants/gameEvents.ts`; use consistently.

## Structure & Naming

- **Files**: PascalCase for components; camelCase for utilities/hooks; kebab-case for CSS.
- **Components**: Colocate styles (e.g. `ComponentName.style.css`) and keep imports from project aliases consistent.
- **Naming conventions**: Components and types in PascalCase; functions, variables, and hooks in camelCase; constants in UPPER_SNAKE or camelCase by project habit; booleans/handlers read clearly (e.g. `isLoading`, `onSubmit`).

## ESLint

- Config in `eslint.config.js`: react-hooks, react-refresh, TypeScript. Reviews should not suggest patterns that conflict with these rules.

## Error Handling

- **API/data**: Handle timeouts, non-2xx responses, and missing or malformed fields; validate or normalize before use.
- **User feedback**: Surface clear messages for failures; avoid silent failures or unhandled promise rejections.
- **Boundaries**: Use error boundaries for UI; keep fallbacks minimal and safe.

## Security

- No `dangerouslySetInnerHTML` unless sanitized; no user input in eval or dynamic code; no secrets in client code.
