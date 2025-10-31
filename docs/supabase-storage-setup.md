# Supabase Storage Setup for UnitHub Document Uploads

Follow these steps to ensure the new document upload flow can store files and expose them to the UI.

## 1. Create or Confirm the Storage Bucket
- Visit the Supabase dashboard → *Storage* → *Buckets*.
- Create a bucket named `UnitHubDocuments` (or reuse a different name if you prefer).
- Set the bucket access to **Public** so the generated URLs can be consumed directly by the browser.

> Want to use a different bucket name? Update the `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` variable in `.env.local` to match. The app defaults to `UnitHubDocuments` when the variable is absent.

> **Schema update:** ensure the `documents` table has a `storage_path TEXT` column. Run `ALTER TABLE documents ADD COLUMN IF NOT EXISTS storage_path TEXT;` inside the Supabase SQL editor if it is missing.

## 2. (Optional) Configure Access Policies
- If the bucket is private, add a storage policy that grants read access to objects for authenticated users.
- Reference: Supabase Storage Policies → create a policy on `objects` with `SELECT` permissions.

## 3. Verify the Environment Variables
In `.env.local`, make sure the Supabase client values exist and match your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<optional-but-recommended-for-server-actions>
# Optional if your bucket name is different:
# NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=my-documents
```

Restart the Next.js dev server after changing environment variables.

## 4. Create a Test Upload
1. Run the dev server: `npm run dev`.
2. Navigate to `/documents` in the browser and click **Upload Document**.
3. Fill in the tenant, type, title, attach a file, and submit.
4. After a successful upload, confirm the card shows the new document and that clicking **Download** opens the file.

## 5. Clean Up (If Needed)
- Delete test files inside Supabase dashboard → *Storage* → *documents*.
- Supabase Storage charges per GB stored, so keep the bucket tidy in non-production environments.

You’re ready to keep the UI and database in sync with Supabase-backed file uploads.***
