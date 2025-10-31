# Dashboard & Detail Component Testing

**Date**: 2025-10-31  
**Scope**: Frontend test coverage for dashboard widgets, tenant detail, maintenance detail, and AI API helpers

---

## Implemented

- Added React Testing Library coverage for the dashboard surface (`components/dashboard/__tests__/…`) to verify real Supabase-fed props render stats, tables, and empty/error states.
- Introduced detail-view smoke tests for tenants and maintenance requests to guard currency, date formatting, and fallback handling (`components/tenants/__tests__/tenant-detail.test.tsx`, `components/maintenance/__tests__/maintenance-detail.test.tsx`).
- Replaced duplicated Web `Request` stubs in AI route tests with a shared helper (`app/api/ai/test-utils.ts`) and pointed suites at it, keeping the jest environment server-friendly.
- Migrated the global Jest setup to TypeScript (`jest.setup.ts`) so jsdom gains `Response.json` without pulling in Undici, and updated `jest.config.js` accordingly.

---

## Current Issues & Context

- **AI route tests don’t exercise native `Response`**: The new stub only covers `Response.json`, so streaming/path-specific behaviour stays untested. If routes expand beyond simple JSON returns they could break unnoticed.  
  *Suggestions*: layer in `whatwg-fetch`/`undici` (with proper polyfills) or write targeted integration tests that hit the Next.js route handler. Review `app/api/ai/*/route.ts` for new response patterns.

- **Dashboard coverage is still shallow**: Tests assert static rendering but skip user interactions (e.g., navigation via “View All”). Behavioural regressions in linked flows remain possible.  
  *Suggestions*: add click assertions using `next/navigation` mocks similar to `components/tenants/__tests__/tenants-list.test.tsx`, or expand to page-level tests under `app/page.tsx`.

- **Detail components depend on camelCase tenant/request data**: Tests mirror the current `Tenant`/`MaintenanceRequestWithTenant` shapes but the live Supabase mapper still returns snake_case until mapping functions are updated. Until that backend mapping work lands, mismatches could surface.  
  *Suggestions*: align `lib/types.ts` and `app/actions/*` mappers (see `app/actions/maintenance.ts` and `app/actions/tenants.ts`) or introduce adapter logic inside the components.

- **Coverage for documents & payments flows unchanged**: Newly added tests do not touch `components/documents/*` or rent workflows beyond existing suites, so the Phase 2 roadmap items remain outstanding.

---

## What Was Tried

- Ran `npm test -- --runInBand --detectOpenHandles` to validate the full suite after adding component and AI route tests.
- Attempted to polyfill the Fetch API with `undici`; abandoned after cascading TextEncoder/ReadableStream issues and replaced with the lighter custom `Response` stub.

---

## Deferred / Next Steps

1. Expand dashboard tests to cover navigation and error recovery (e.g., verifying `Link` usage).  
2. Backfill tests for documents dashboard/cards, matching the new component suite structure.  
3. Replace the custom `Response` stub once a stable fetch polyfill is vetted, or guard it with integration tests.  
4. Capture component coverage metrics (Phase 1 task) by fixing the current tooling gap noted in `docs/testing-roadmap.md`.

