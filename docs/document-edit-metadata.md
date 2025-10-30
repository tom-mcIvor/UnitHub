# Document Metadata Editing Rollout

## Implementation Summary
- Added `components/documents/document-form.tsx`, a shared modal powered by React Hook Form + Zod that can either call `updateDocument` or `createDocument` depending on whether an existing record is supplied.
- Updated `components/documents/documents-page.tsx` to surface an Edit control on each card, populate the modal with current Supabase data, and reset modal state cleanly after close while preserving the existing delete confirmation.
- Extended `components/documents/document-upload.tsx` so the tenant dropdown reflects live tenant data instead of hard-coded mock options, keeping property-level uploads available.
- Introduced `documentMetadataSchema` and `DocumentFormData` in `lib/schemas.ts` to centralize validation shared by the new form and the existing server action.

## Outstanding Problems
- `/components/documents/documents-page.tsx:57` still accepts an `error` prop that never renders; lint reports an unused-variable warning tied to this update.
- Document upload flow is still a placeholder: `DocumentUpload` logs to the console and expects a `fileUrl`. Without Supabase Storage wiring, the new edit modal relies on manually provided URLs.
- Detail routes such as `/documents/[id]` remain disconnected from Supabase, so clicking “View” continues to show static content despite the new editing capabilities.

## Suggestions (Verify Before Implementing)
- Remove or display the `error` prop where the document page is rendered (`/app/documents/page.tsx`) to clear the unused-variable warning.
- Wire `DocumentUpload` into Supabase Storage so a successful upload returns the `fileUrl` that the new edit modal expects; start inside `components/documents/document-upload.tsx` and `app/actions/documents.ts`.
- Convert the document detail page to a server component that calls `getDocument(id)` from `app/actions/documents.ts` so the View button surfaces real metadata.

## What Was Tried
- Exercised the edit workflow end-to-end using the new modal to confirm `router.refresh()` pulls updated Supabase records back into the list.
- Ran `npm run lint` to ensure the new schema and components integrate with the existing toolchain (warnings noted above).

## Deferred Work
- Did not change the lease extractor integration—still a placeholder experience until the AI route is connected.
- Did not introduce optimistic UI or toast notifications; delete/edit flows continue to rely on full refresh and alert dialogs.
