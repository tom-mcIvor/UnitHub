# Document Metadata Editing Rollout

## Implementation Summary
- Added `components/documents/document-form.tsx`, a shared modal powered by React Hook Form + Zod that can either call `updateDocument` or (less commonly) `createDocument` depending on whether an existing record is supplied.
- Updated `components/documents/documents-page.tsx` to surface an Edit control on each card, repointed the download icon to `/api/documents/[id]/download`, and reset modal state cleanly after close while preserving the existing delete confirmation.
- Introduced `components/documents/document-detail.tsx` plus `/app/documents/[id]/page.tsx` so the “View” button fetches Supabase metadata server-side, renders an editable detail sheet, and now calls the download proxy rather than the public Storage URL.
- Extended `components/documents/document-upload.tsx` to capture form input, upload files directly to Supabase Storage, record the object path, and persist both path and public URL via `createDocument`.
- Introduced `documentMetadataSchema` and `DocumentFormData` in `lib/schemas.ts` to centralize validation shared by the new form and the existing server action.

## Outstanding Problems
- `/components/documents/documents-page.tsx` still receives an `error` prop but never renders it, so list-level failures are silent.
- `/app/api/documents/[id]/download/route.ts` proxies files but does not yet enforce authentication or tenant scoping—downloads remain effectively public.
- Storage cleanup failures are only logged inside `deleteDocument`; the UI always sees a success response even when the storage removal step fails.

## Suggestions (Verify Before Implementing)
- Render the `error` prop surfaced by `/app/documents/page.tsx` so end users know when the list fails to load.
- Layer Supabase Auth/RLS and enforce checks inside `/app/api/documents/[id]/download/route.ts` before making the bucket private.
- Consider propagating storage cleanup failures back to the caller (e.g., return a warning object from `deleteDocument`) so the UI can warn the operator.

## What Was Tried
- Exercised the edit workflow end-to-end using the new modal to confirm `router.refresh()` pulls updated Supabase records back into the list.
- Ran `npm run lint` to ensure the new schema and components integrate with the existing toolchain (warnings noted above).

## Deferred Work
- Did not change the lease extractor integration—still a placeholder experience until the AI route is connected.
- Did not introduce optimistic UI or toast notifications; delete/edit flows continue to rely on full refresh and alert dialogs.
