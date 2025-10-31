# Dashboard & Detail Pages Real Data Integration

**Date**: 2025-10-31
**Status**: Complete - Dashboard and detail pages now fetch from database

---

## What Was Implemented

### 1. Dashboard Server Actions (`/app/actions/dashboard.ts`) - New File (247 lines)

Created 4 server actions to aggregate dashboard statistics:

- `getDashboardStats()` - Returns total tenants count, monthly income (sum of all rent_amount), pending/overdue payment count, open/in-progress maintenance count
- `getRecentTenants()` - Returns last 4 tenants ordered by created_at DESC
- `getUpcomingPayments()` - Returns pending/overdue payments due within next 30 days, with tenant JOIN
- `getRecentMaintenanceRequests()` - Returns last 5 open/in-progress maintenance requests with tenant JOIN

All actions return `{ success, data, error }` structure. JOINs flatten nested tenant data into flat objects (e.g., `tenant_name`, `unit_number`).

### 2. Dashboard Page Updated (`/app/page.tsx`)

Converted to async Server Component:
- Fetches all 4 dashboard data sources in parallel using `Promise.all()`
- Added `export const dynamic = 'force-dynamic'` to prevent static generation
- Passes data as props to `<DashboardOverview>` client component

### 3. Dashboard Components Updated

**`/components/dashboard/dashboard-overview.tsx`**
- Changed from hardcoded mock data to accepting props: `stats`, `recentTenants`, `upcomingPayments`, `recentMaintenance`
- Added error display banner
- Formats monthly income with 2 decimal places and locale formatting
- All stat cards now show real data or "0" fallback

**`/components/dashboard/recent-tenants.tsx`**
- Accepts `tenants: RecentTenant[]` prop
- Displays `tenant.unit_number` from database (snake_case)
- Shows "No tenants yet" empty state
- "View All" button links to `/tenants`

**`/components/dashboard/upcoming-payments.tsx`**
- Accepts `payments: UpcomingPayment[]` prop
- Formats dates using `toLocaleDateString()` (e.g., "Oct 31, 2025")
- Formats amounts with 2 decimal places
- Shows "No upcoming payments" empty state
- Uses `payment.tenant_name` and `payment.unit_number` from JOIN

**`/components/dashboard/maintenance-overview.tsx`**
- Accepts `requests: RecentMaintenanceRequest[]` prop
- Displays `request.unit_number` from JOIN
- Shows "No open maintenance requests" empty state
- Priority badges use existing color logic

### 4. Tenant Detail Page Fixed (`/app/tenants/[id]/page.tsx`)

Converted to async Server Component:
- Calls `getTenant(id)` server action
- Added `export const dynamic = 'force-dynamic'`
- Changed params type to `Promise<{ id: string }>` (Next.js 15+ requirement)
- Returns `notFound()` if tenant not found or error occurs

**`/components/tenants/tenant-detail.tsx`**
- Changed from mock data to accepting `tenant: Tenant` prop
- Updated all field references to camelCase fields provided by server actions
- Added edit modal support via `<TenantForm>` with pre-populated data

### 5. Maintenance Detail Page Fixed (`/app/maintenance/[id]/page.tsx`)

Converted to async Server Component:
- Calls `getMaintenanceRequest(id)` server action (now in parallel with `getTenants()`)
- Added `export const dynamic = 'force-dynamic'`
- Changed params type to `Promise<{ id: string }>`
- Returns `notFound()` if request not found or error occurs

**`/components/maintenance/maintenance-detail.tsx`**
- Changed from mock data to accepting `request: MaintenanceRequestWithTenant` prop
- Added edit modal support via `<MaintenanceForm>` using live tenant data for dropdowns
- Maintains formatting helpers for status, priority, and cost display

---

## Problems That Still Exist

### 1. No Authentication System
**Location**: All pages and server actions
**Issue**: Anyone can access all data without login. No user sessions exist.

**How this relates to new code**: Dashboard and detail pages now fetch real data, but there's no way to restrict data by user. All users would see all tenants/payments/maintenance if deployed publicly.

**Suggested solutions** (not guaranteed to work):
- Enable Supabase Auth in dashboard
- Create `/app/(auth)/login/page.tsx` and `/app/(auth)/signup/page.tsx`
- Add `/middleware.ts` to check `supabase.auth.getUser()` and redirect if not authenticated
- See `supabase-integration-status.md` #2 for more details

**Where to look**:
- Supabase Dashboard → Authentication → Providers
- Next.js docs: https://nextjs.org/docs/app/building-your-application/routing/middleware

### 2. No Row Level Security (RLS) Policies
**Location**: Supabase database
**Issue**: Database has no RLS policies. Any authenticated user with Supabase client can read/write all data.

**How this relates to new code**: Server actions use `createClient()` from `/lib/supabase/server.ts` which has full access. Once auth is added, need RLS to prevent users from accessing each other's data.

**Suggested solutions**:
- Add `user_id UUID REFERENCES auth.users(id)` column to all tables
- Create RLS policies in Supabase SQL Editor:
  ```sql
  ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can only access their own tenants"
    ON tenants FOR ALL
    USING (user_id = auth.uid());
  ```
- Repeat for `rent_payments`, `maintenance_requests`, `documents`, `communication_logs`

**Where to look**:
- Supabase Dashboard → Database → Policies
- `/scripts/01-init-schema.sql` (need to add user_id column)

### 3. Dashboard Shows Aggregate Data Across All Users
**Location**: `/app/actions/dashboard.ts`
**Issue**: Stats queries don't filter by user_id. In multi-tenant app, dashboard would show stats from all users.

**How this relates to new code**: `getDashboardStats()` does `COUNT(*)` and `SUM(rent_amount)` without WHERE clause.

**Suggested solutions**:
- After adding auth and `user_id` columns, update queries:
  ```typescript
  const { data: { user } } = await supabase.auth.getUser()
  const { count } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
  ```
- Apply to all dashboard queries

**Where to look**:
- `/app/actions/dashboard.ts:50-90` - Stats aggregation queries
- `/app/actions/dashboard.ts:127-160` - Recent tenants query
- `/app/actions/dashboard.ts:176-200` - Upcoming payments query
- `/app/actions/dashboard.ts:217-238` - Maintenance requests query

### 4. Payment Status Not Auto-Calculated
**Location**: `/app/actions/dashboard.ts:176`
**Issue**: `getUpcomingPayments()` filters by `status IN ('pending', 'overdue')` but status is stored in database. Payments don't automatically become "overdue" when due_date passes.

**How this relates to new code**: Dashboard relies on static database values. If payment due_date is 2025-10-25 and today is 2025-10-31, but status is still "pending", it shows as pending.

**Suggested solutions**:
- Calculate status dynamically in query:
  ```typescript
  const { data } = await supabase.from('rent_payments').select('*')
  const enriched = data.map(p => ({
    ...p,
    status: new Date(p.due_date) < new Date() && p.status === 'pending' ? 'overdue' : p.status
  }))
  ```
- Or create Supabase database function to compute status
- Or use Supabase Edge Function scheduled daily to update statuses

**Where to look**:
- `/app/actions/dashboard.ts:176-200` - Where payments are fetched
- `/app/actions/rent.ts:27-47` - Where all payments are fetched (same issue)

### 5. No Loading States
**Location**: `/app/page.tsx`, `/app/tenants/[id]/page.tsx`, `/app/maintenance/[id]/page.tsx`
**Issue**: Pages show nothing while fetching data. No loading skeleton or spinner.

**How this relates to new code**: Converted pages to async Server Components. During fetch, user sees blank screen.

**Suggested solutions**:
- Create `/app/loading.tsx` for dashboard loading state
- Create `/app/tenants/[id]/loading.tsx` for detail page loading
- Use Next.js Suspense boundaries:
  ```tsx
  <Suspense fallback={<Skeleton />}>
    <DashboardOverview {...data} />
  </Suspense>
  ```

**Where to look**:
- Next.js docs: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

### 6. No Server-Side Validation
**Location**: All server actions
**Issue**: Server actions trust client data without re-validation. Can be bypassed.

**How this relates to new code**: Dashboard and detail pages call server actions, but those actions only check field presence (e.g., `if (!formData.get('name'))`). No format validation (email, phone, date ranges).

**Suggested solutions**:
- Import Zod schemas from `/lib/schemas.ts` into server actions
- Parse before database operation:
  ```typescript
  import { tenantSchema } from '@/lib/schemas'
  const parsed = tenantSchema.parse(Object.fromEntries(formData))
  ```
- Catch ZodError and return validation errors to client

**Where to look**:
- `/app/actions/tenants.ts:122-161` - updateTenant missing validation
- `/app/actions/rent.ts:108-217` - createRentPayment missing validation
- `/lib/schemas.ts` - Zod schemas already exist

---

## What Was Tried

### Parallel Data Fetching
Used `Promise.all()` in `/app/page.tsx:14-19` to fetch all 4 dashboard data sources simultaneously instead of sequentially. Reduces total wait time from sum of all queries to max of slowest query.

### JOIN vs Separate Queries
Server actions use Supabase JOIN syntax to fetch related tenant data in single query:
```typescript
.select(`
  id, amount, due_date, status,
  tenants (name, unit_number)
`)
```
Then flatten nested object in code. Alternative would be separate queries and manual JOIN in code.

### Dynamic Route Segments
Next.js 15 changed `params` from synchronous object to Promise. Updated to:
```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```
Build would fail without this change.

---

## What Could Have Been Done But Wasn't

### Real-time Dashboard Updates
Could use Supabase Realtime subscriptions to update stats when data changes:
```typescript
supabase
  .channel('dashboard')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tenants' }, () => {
    router.refresh()
  })
  .subscribe()
```
Not implemented because dashboard already refetches on navigation.

### Pagination for Dashboard Widgets
Recent tenants/payments/maintenance use `.limit()` but no pagination controls. Could add "Load More" buttons or infinite scroll.
Not implemented to keep scope minimal.

### Error Boundaries
Could create `/app/error.tsx` to catch server action errors gracefully.
Not implemented - errors currently show as blank page or "error" message.

### Dashboard Refresh Button
Could add manual refresh button to reload dashboard data without full page reload.
Not implemented - user can refresh browser or navigate away/back.

### Caching Strategy
Could add `revalidate` to pages for ISR or use React cache() function for deduplication.
Not implemented - using `force-dynamic` fetches fresh data every time.

### Type Safety Improvements
Could use `supabase gen types typescript` CLI to generate TypeScript types from database schema instead of manually defining in `/lib/types.ts`.
Not implemented - manual types work but could drift from database.

---

## Files Created
- `/app/actions/dashboard.ts`

## Files Modified
- `/app/page.tsx`
- `/app/tenants/[id]/page.tsx`
- `/app/maintenance/[id]/page.tsx`
- `/components/dashboard/dashboard-overview.tsx`
- `/components/dashboard/recent-tenants.tsx`
- `/components/dashboard/upcoming-payments.tsx`
- `/components/dashboard/maintenance-overview.tsx`
- `/components/tenants/tenant-detail.tsx`
- `/components/maintenance/maintenance-detail.tsx`

## Database Tables Used
- `tenants` - For all dashboard stats and detail pages
- `rent_payments` - For pending payments widget and monthly income calculation
- `maintenance_requests` - For open maintenance widget
- No schema changes made

## Next Recommended Steps
1. Implement authentication (Supabase Auth + middleware)
2. Add Row Level Security policies to database
3. Add `user_id` column to all tables and update queries
4. Add loading states to async pages
5. Wire up Edit buttons in detail pages
6. Add server-side validation with Zod
