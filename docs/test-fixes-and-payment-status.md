# Test Suite Fixes and Payment Status Updates (2025-11-01)

## What Was Implemented

### Test Suite Fixed (136/137 tests passing - 99.3%)

**Problem**: 31 tests failing due to syntax errors, API compatibility issues, and validation problems.

**Root Causes**:
1. Duplicate code in `/app/actions/tenants.ts` (lines 129-228 duplicated outside function scope)
2. AI API routes using `Response.json()` which is not available in Next.js test environment
3. Validation logic calling `parseFloat(undefined)` which returns `NaN`, causing Zod validation to fail with "Expected number, received nan"
4. Test data using invalid values (phone numbers <10 chars, missing required priority field)

**Solutions Applied**:
- Removed duplicate code block from `app/actions/tenants.ts`
- Updated all AI routes (`app/api/ai/*/route.ts`) to use `NextResponse.json()` instead of `Response.json()`
- Added `NextResponse` mock in `jest.setup.ts` for test environment
- Fixed `parseFloat` calls in server actions to handle undefined: `rawData.amount ? parseFloat(rawData.amount as string) : undefined`
- Updated test data in `app/actions/__tests__/tenants.test.ts` and `components/maintenance/__tests__/maintenance-form.test.tsx`

**Files Modified**:
- `app/actions/tenants.ts` - Removed lines 129-228 (duplicate code), fixed parseFloat validation
- `app/actions/rent.ts` - Fixed parseFloat validation
- `app/actions/maintenance.ts` - Fixed parseFloat validation
- `app/api/ai/extract-lease/route.ts` - Changed to NextResponse
- `app/api/ai/categorize-maintenance/route.ts` - Changed to NextResponse
- `app/api/ai/generate-reminder/route.ts` - Changed to NextResponse
- `app/api/ai/suggest-vendor/route.ts` - Changed to NextResponse
- `jest.setup.ts` - Added NextResponse mock
- `app/actions/__tests__/tenants.test.ts` - Fixed phone number format
- `components/maintenance/__tests__/maintenance-form.test.tsx` - Fixed duplicate code, added priority field

### Automatic Payment Status Updates

**Problem**: Rent payments stored as "pending" in database never changed to "overdue" even after due date passed.

**Solution**: Implemented dynamic status calculation in `app/actions/rent.ts:16-42` in the `mapDbToRentPayment()` function.

**How It Works**:
```typescript
// If status is 'pending' and due date has passed, mark as 'overdue'
if (row.status === 'pending' && row.due_date) {
  const dueDate = new Date(row.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time for date-only comparison

  if (dueDate < today) {
    actualStatus = 'overdue'
  }
}
```

**Status is computed on every fetch** - no cron jobs, database triggers, or scheduled functions needed. Database still stores "pending", but UI displays "overdue" when appropriate.

---

## Problems That Still Exist

### 1. One Failing UI Test
**Location**: `components/maintenance/__tests__/maintenance-form.test.tsx:66-82`

**Issue**: Test expects success message "Maintenance request created successfully!" but times out after 1409ms.

**Possible Causes**:
- Async timing issue with `router.refresh()` and `setTimeout()` in form component
- Mock for `createMaintenanceRequest` may not be properly applied to the component
- Success state may not be rendering before test timeout

**Suggested Solutions** (may not be correct):
- Increase test timeout with `waitFor` options
- Mock `useRouter` to track `refresh()` calls instead of checking for success message
- Remove the test entirely (core functionality works, this is just a UI integration test)

**What Was Tried**:
- Changed from `fireEvent.submit()` to `user.click()` on submit button
- Added priority field selection to form
- Created local mock for `createMaintenanceRequest` in test

**What Could Be Done**:
- Debug with `screen.debug()` to see actual DOM state
- Check if success message is being cleaned up by `onClose()` before test can find it
- Refactor form to expose success state for easier testing

### 2. Incomplete Authentication
**Location**: All server actions, database schema

**Issue**: Authentication exists but no Row Level Security (RLS) policies, no `user_id` columns, server actions fetch all data regardless of authenticated user.

**Relation to Code Added**: Payment status calculation doesn't consider user isolation. When RLS is added, the `mapDbToRentPayment()` function will still work correctly because it operates on already-filtered rows.

**Suggested Solutions**:
- Add `user_id UUID REFERENCES auth.users(id)` column to: `tenants`, `rent_payments`, `maintenance_requests`, `documents`, `communication_logs`
- Enable RLS in Supabase: `ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;`
- Create policies: `CREATE POLICY "Users see own data" ON tenants FOR SELECT USING (auth.uid() = user_id);`
- Update all server actions to get `user_id` from session and filter queries: `await supabase.from('tenants').select('*').eq('user_id', userId)`

**Where to Look**:
- `/lib/supabase/server.ts` - Get user session
- `/app/actions/*.ts` - Add user_id filtering to all queries
- Supabase dashboard - Enable RLS and create policies

### 3. Missing Edit/Delete UI
**Location**: All feature pages (rent, maintenance, documents, communications)

**Issue**: Server actions for `updateX()` and `deleteX()` exist but no UI buttons/modals to trigger them.

**Relation to Code Added**: Test fixes ensure update/delete server actions work correctly. Payment status calculation will work on updated records.

**Suggested Solutions**:
- Add Edit/Delete buttons to table rows in `components/*/page.tsx` components
- Create edit modals similar to create forms (reuse form components with `editingRequest` prop)
- Add confirmation dialogs before delete using `sonner` toast library

**Where to Look**:
- `components/tenants/tenant-page.tsx` - Has edit/delete UI as reference
- `components/maintenance/maintenance-form.tsx` - Already supports edit mode with `editingRequest` prop
- `components/rent/rent-tracking-page.tsx` - Needs edit/delete buttons added

---

## What Was Not Done

### Toast Notifications
`sonner` library is installed (`package.json`) but not configured. Could add success/error toasts instead of inline messages.

**Where to Look**: `app/layout.tsx` - Add `<Toaster />` component

### Confirmation Dialogs
No "Are you sure?" confirmation before deletes. Could cause accidental data loss.

### Test Memory Optimization
One test uses 1409ms before timeout. Could optimize test setup or increase memory allocation.

---

## Next Steps

1. **Add Edit/Delete UI** to rent, maintenance, documents, communications pages
2. **Configure toast notifications** - Add `<Toaster />` to layout, replace inline success messages
3. **Implement RLS** - Add user_id columns, enable policies, update server actions
4. **Fix or skip failing UI test** - Either debug timing issue or mark as integration test to skip

---

## Related Documentation
- See `complete-database-integration.md` for original database setup
- See `2025-11-01-auth-and-next-steps.md` for authentication implementation notes
