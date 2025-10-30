# Error Handling & Lint Warning Cleanup

## What Changed
- Updated the delete handlers in `components/tenants/tenants-list.tsx`, `components/rent/rent-tracking-page.tsx`, `components/maintenance/maintenance-page.tsx`, `components/documents/documents-page.tsx`, and `components/communications/communications-page.tsx` to log caught exceptions via `console.error` instead of assigning to unused `error` variables. Each catch block now uses `catch (err)` and keeps the user-facing alert.
- Re-ran `npm run lint`, confirming the unused-variable warnings tied to those handlers are gone.

## Remaining Issues
- ESLint still reports longstanding warnings unrelated to these changes: `app/layout.tsx:7` for the unused `geistMono` font import and `components/ui/use-toast.ts` plus `hooks/use-toast.ts` for `actionTypes` being treated as a value.
- The lint run also continues to emit the Node warning about `eslint.config.js` being parsed as an ES module without `type: "module"`; the warning predates this change.

## Suggestions (Verify First)
- Remove or use `geistMono` in `app/layout.tsx` to silence the unused import warning.
- Refactor the toast helpers so `actionTypes` is exported strictly as a type, or rename it with a `type` alias in `components/ui/use-toast.ts` and `hooks/use-toast.ts`.
- If the ES module warning becomes an issue, add `"type": "module"` to `package.json` or convert `eslint.config.js` to `.cjs`.

## What Was Tried
- Replaced the unused catch variables with logging, leaving the existing alert UX untouched.
- Ran `npm run lint` to validate that the targeted warnings resolved.

## Deferred Work
- Did not touch the toast utilities or the global layout; those structural changes would ripple beyond lint cleanup.
- Left the ESLint module warning for a future tooling pass, since it does not currently break the workflow.
