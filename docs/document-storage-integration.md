# Document Storage Integration Rollout

## What Was Implemented
- Hooked the documents feature into Supabase end-to-end:
  - `/components/documents/document-upload.tsx` uploads files directly to the Supabase Storage bucket defined by `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` (defaults to `UnitHubDocuments`), retrieves both the object path and public URL, and saves them via `createDocument`.
  - `/components/documents/document-detail.tsx` and `/app/documents/[id]/page.tsx` render Supabase-backed document details, now downloading files through `/api/documents/[id]/download` instead of hitting Storage directly.
  - The document list (`components/documents/documents-page.tsx`) routes “View” actions to the detail page and its download icon through the same proxy endpoint.
- Added `/app/api/documents/[id]/download/route.ts`, which streams files from Supabase Storage using the service-role key. Downloads are cached off (`Cache-Control: no-store`) and filenames are sanitized before responding. This route requires `SUPABASE_SERVICE_ROLE_KEY` to be configured in the environment.
- Server actions in `/app/actions/documents.ts` now persist `storage_path`, delete the storage object when metadata is removed, and expose the path to the UI. The schema script (`scripts/01-init-schema.sql`) creates the `storage_path` column and backfills it via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
- `docs/supabase-storage-setup.md` remains the guide for configuring the bucket, and a new TypeScript Jest setup (`jest.setup.ts`) was added earlier to keep lint happy.

## Current Issues
- Auth gaps: `/api/documents/[id]/download` does not enforce authentication or tenant scoping. Anyone with the link can stream the binary as long as they have web access.
- Legacy rows: documents created before `storage_path` existed will fall back to their stored `fileUrl`. If the bucket is private, those legacy rows will fail to download until the path is backfilled manually.
- Error surfacing: storage deletion failures are logged but not returned to the UI, so operators won’t know when an object fails to delete. Consider bubbling errors through `deleteDocument`.
- Broader app risks (unchanged): the app still lacks authentication, RLS, and server-side validation of document payloads.

## Suggestions (Verify Before Implementing)
- Protect the download proxy with Supabase Auth or middleware. See `docs/supabase-integration-status.md` for the pending Auth/RLS work; once sessions exist, enforce checks inside `/app/api/documents/[id]/download/route.ts`.
- Backfill `storage_path` for historical rows. A simple SQL update (`UPDATE documents SET storage_path = ...`) is required before making the bucket private.
- Surface storage cleanup issues to the UI. Consider returning a warning from `deleteDocument` when the storage removal step fails so the caller can notify the user.
- Audit configuration across environments so `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` matches the actual bucket name.

## Completed Proxy Rollout (Summary of Work Above)
- Storage paths are now persisted through server actions and the schema script.
- `/api/documents/[id]/download` proxies downloads via the service-role key; UI buttons point at this route.
- Storage objects are cleaned up via the admin client when metadata is removed.
- Manual verification via the UI confirms uploads + proxied downloads work; automated tests are still pending.

## What Was Tried
- Verified uploads end-to-end through the UI, ensuring Supabase returns a public URL and that metadata persists via server actions.
- Ran `npm run lint` after each iteration to confirm the new TypeScript setup file fixed the earlier lint error while leaving existing warnings untouched.
- Updated `docs/document-edit-metadata.md` and `docs/supabase-storage-setup.md` so the documentation reflects the live upload/detail behaviour and default bucket name.

## Deferred Work
- Have not enforced authentication or tenant scoping on the download proxy yet.
- Have not backfilled `storage_path` for legacy rows—older records still rely on public URLs.
- Have not built automated tests around the upload and download proxy flows.
- Have not addressed the global lint warnings (`geistMono`, `actionTypes`) or implemented auth/RLS, which remain open items.

## Next Steps
1. Wire Supabase Auth/RLS and gate `/app/api/documents/[id]/download/route.ts` accordingly.
2. Backfill `storage_path` for existing rows so legacy documents work with private buckets.
3. Add automated coverage (e.g., route-level tests) and surface storage cleanup failures back to the UI.
