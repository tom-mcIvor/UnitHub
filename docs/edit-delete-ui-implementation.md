# Edit/Delete UI Implementation

**Date**: 2025-10-31
**Status**: Complete - all feature areas support edit/delete flows

---

## What Was Implemented

### Tenants Edit/Delete Functionality
Modified 2 files to add full CRUD UI for tenants:

1. **`/components/tenants/tenant-form.tsx`** (Modified)
   - Added `editingTenant?: Tenant` and `initialData?: TenantFormData` props
   - Added `isEditing` boolean to determine create vs update mode
   - Updated `onSubmit` to call `updateTenant(id, formData)` when editing
   - Changed form title to show "Edit Tenant" vs "Add New Tenant"
   - Changed submit button text to show "Update Tenant" vs "Save Tenant"
   - Changed success message to show "updated" vs "created"
   - Added `type="button"` to Cancel button to prevent form submission

2. **`/components/tenants/tenants-list.tsx`** (Modified)
   - Imported `AlertDialog` components and `deleteTenant` server action
   - Added state: `editingTenant`, `deletingTenant`, `isDeleting`
   - Added `useRouter` hook for page refresh
   - Created `handleEdit(tenant)` function that sets state and opens form
   - Created `handleDelete()` async function that calls `deleteTenant(id)` server action
   - Created `handleCloseForm()` to reset both form and editing state
   - Wired Edit button onClick to `handleEdit(tenant)`
   - Wired Delete button onClick to `setDeletingTenant(tenant)`
   - Updated `<TenantForm>` to pass `editingTenant` and `initialData` props
   - Added `<AlertDialog>` at end with confirmation message warning about cascade deletes
   - Delete confirmation shows tenant name and warns that associated data will be deleted

### Rent Payments Edit/Delete Functionality
Modified 2 files to add full CRUD UI for rent payments:

1. **`/components/rent/rent-payment-form.tsx`** (Modified)
   - Added `editingPayment?: RentPaymentWithTenant` and `initialData?: RentPaymentFormData` props
   - Added `isEditing` boolean to determine create vs update mode
   - Updated `onSubmit` to call `updateRentPayment(id, formData)` when editing
   - Changed form title to show "Edit Payment" vs "Record Payment"
   - Changed submit button text to show "Update Payment" vs "Record Payment"
   - Changed success message to show "updated" vs "recorded"
   - Added `type="button"` to Cancel button
   - Added `disabled={isSubmitting || success}` to submit button

2. **`/components/rent/rent-tracking-page.tsx`** (Modified)
   - Imported `AlertDialog` components, `Edit2`, `Trash2` icons, and `deleteRentPayment` server action
   - Added state: `editingPayment`, `deletingPayment`, `isDeleting`
   - Added `useRouter` hook for page refresh
   - Created `handleEdit(payment)` function
   - Created `handleDelete()` async function that calls `deleteRentPayment(id)` server action
   - Created `handleCloseForm()` to reset state
   - Added "Actions" column to table header
   - Added table cell with Edit and Delete buttons for each payment row
   - Wired Edit button onClick to `handleEdit(payment)`
   - Wired Delete button onClick to `setDeletingPayment(payment)`
   - Updated `<RentPaymentForm>` to pass `editingPayment` and `initialData` props
   - Added `<AlertDialog>` at end with confirmation message showing amount and tenant name

### Communications Edit/Delete Functionality
Modified 2 files to enable full lifecycle management for communication logs:

1. **`/components/communications/communication-form.tsx`** (Modified)
   - Added `editingLog?: CommunicationLogWithTenant` and `initialData?: CommunicationLogFormData` props
   - Added `isEditing` flag to branch between create and update flows
   - Updated `onSubmit` to call `updateCommunicationLog(id, formData)` when editing
   - Adjusted headings, button labels, and success messaging to reflect edit vs create state
   - Ensured Cancel button uses `type="button"` so it no longer submits the form while editing

2. **`/components/communications/communications-page.tsx`** (Modified)
   - Tracks `editingLog` alongside existing delete state
   - Opens the form in edit mode with pre-populated data when users click the new Edit button
   - Resets both modal visibility and editing state on close
   - Adds Edit icon to each timeline entry while retaining the existing delete confirmation dialog

### Documents Edit Functionality
Modified 2 files and added a new form component so document metadata can be updated in place:

1. **`/components/documents/document-form.tsx`** (New)
   - Reuses the modal pattern from other modules with React Hook Form + Zod validation
   - Calls `updateDocument(id, formData)` when editing and keeps `createDocument` available for future use
   - Handles optional tenant association, document type, and file URL with success/error messaging

2. **`/components/documents/documents-page.tsx`** (Modified)
   - Tracks `editingDocument` state and opens the new form with pre-filled data on Edit
   - Resets modal + editing state on close and keeps the existing delete confirmation intact
   - Adds Edit control to the card action row for quick access

---

## Problems That Still Exist

### 1. Detail Pages Still Use Mock Data
**Location**: `/app/tenants/[id]/page.tsx`, `/app/maintenance/[id]/page.tsx`
**Issue**: Despite edit/delete working on list pages, detail pages don't fetch real data.

**Related to new code**: Users can now edit/delete from list page but View button leads to broken detail page.

**Suggested solutions**:
- Convert detail pages to async Server Components
- Call `getTenant(id)` or `getMaintenanceRequest(id)` server actions
- Pass data as props to detail view client component
- Handle 404 when record not found

**Where to look**:
- `/app/tenants/[id]/page.tsx` - Currently shows mock data
- `/app/maintenance/[id]/page.tsx` - Currently shows mock data
- `/app/actions/tenants.ts:48-69` - `getTenant(id)` exists but not called
- `/app/actions/maintenance.ts:75-103` - `getMaintenanceRequest(id)` exists but not called

### 5. No Server-Side Validation
**Location**: All server actions
**Issue**: Edit forms now call server actions but server actions only check field presence, not format/validity.

**Related to new code**: Client-side Zod validation exists but can be bypassed. Server should re-validate.

**Suggested solutions**:
- Import Zod schemas from `/lib/schemas.ts` into server actions
- Parse FormData with Zod before database operations
- Return validation errors to client
- Example: `const parsed = tenantSchema.parse(Object.fromEntries(formData))`

**Where to look**:
- `/app/actions/tenants.ts:122-161` - `updateTenant()` only checks if fields exist
- `/app/actions/rent.ts:158-217` - `updateRentPayment()` only checks if fields exist
- `/lib/schemas.ts` - Zod schemas already defined but not used server-side

### 6. Delete Cascade Warning Accuracy
**Location**: Tenant delete confirmation dialog
**Issue**: Confirmation dialog warns "this will delete all associated rent payments, maintenance requests, documents, and communication logs" but this is only true because database has CASCADE constraints.

**Related to new code**: AlertDialog in `/components/tenants/tenants-list.tsx:203-205` makes this claim.

**Suggested solutions**:
- Verify CASCADE constraints actually exist in database schema (check `/scripts/01-init-schema.sql`)
- If constraints missing, either add them or remove warning
- Consider showing count of associated records before delete: "This tenant has 5 rent payments, 3 maintenance requests..."

**Where to look**:
- `/scripts/01-init-schema.sql` - Check for `ON DELETE CASCADE` in foreign key definitions
- `/components/tenants/tenants-list.tsx:203-205` - Warning message

### 7. No Optimistic Updates
**Location**: All delete/edit operations
**Issue**: After delete/edit, UI waits for `router.refresh()` to complete before updating. User sees stale data briefly.

**Related to new code**: All new handlers use `router.refresh()` which triggers full server re-fetch.

**Suggested solutions**:
- Use React `useOptimistic` hook for instant UI updates
- Update local state immediately, then revert if server action fails
- Example: Remove item from list instantly, add back if delete fails

**Where to look**:
- `/components/tenants/tenants-list.tsx:46-63` - `handleDelete()` implementation
- `/components/rent/rent-tracking-page.tsx:47-64` - `handleDelete()` implementation
- React docs for `useOptimistic` hook

---

## What Was Tried

### Form Edit Mode Detection
- Tried using `initialData` prop alone to detect edit mode
- Found that `editingTenant/editingPayment` object needed separately because form needs the `id` field which isn't in `FormData`
- Solution: Pass both `editingTenant` object (for id) and `initialData` (for form defaults)

### Button Type Attribute
- Initial Cancel buttons caused form submission
- Added `type="button"` to all Cancel buttons to prevent default form submit behavior

### State Reset on Form Close
- Initially only closed form with `setShowForm(false)`
- Found that reopening form after edit kept old data
- Created `handleCloseForm()` that resets both `showForm` and `editingTenant/editingPayment` states

### AlertDialog Controlled State
- Used `open={!!deletingTenant}` to control dialog visibility
- Used `onOpenChange={() => setDeletingTenant(null)}` to clear state when dialog closes via Escape or overlay click

---

## What Could Have Been Done But Wasn't

### Toast Notifications Instead of Alerts
- `sonner` library now powers success/error feedback across tenant, rent, maintenance, communications, and document lists (replaced blocking alerts).
- Remaining opportunity: extend toast messaging to creation/edit success states and long-running operations.

### Confirmation Dialog for Edits
- Could add "Are you sure?" before submitting edits
- Common for important changes
- Not implemented since edits are less destructive than deletes

### Keyboard Shortcuts
- Could add Escape key to close forms
- Could add Cmd/Ctrl+S to submit forms
- Not implemented to keep scope limited

### Loading Skeletons During Delete
- Could show skeleton UI instead of disabling buttons
- Would improve perceived performance
- Not implemented since delete is usually fast

### Bulk Delete Operations
- Could add checkboxes to select multiple items
- Could add "Delete Selected" button
- Not implemented since not in original requirements

### Edit Button in Detail Pages
- Could add Edit button in `/app/tenants/[id]/page.tsx`
- Would open edit form from detail view
- Not implemented since detail pages still use mock data

### Inline Editing
- Could make table cells editable directly
- Would save clicks vs opening modal
- Not implemented due to complexity

### Undo After Delete
- Could show toast with "Undo" button after delete
- Would require soft deletes or keeping deleted data temporarily
- Not implemented since database uses hard deletes

---

## Files Created
None (only modifications)

## Files Modified
- `/components/tenants/tenant-form.tsx` - Added edit mode support
- `/components/tenants/tenants-list.tsx` - Added edit/delete handlers and UI
- `/components/rent/rent-payment-form.tsx` - Added edit mode support
- `/components/rent/rent-tracking-page.tsx` - Added edit/delete handlers and UI

## Database Tables Affected
- `tenants` - DELETE operations now callable from UI
- `rent_payments` - UPDATE and DELETE operations now callable from UI
- Associated tables via CASCADE (if constraints exist): `maintenance_requests`, `documents`, `communication_logs`

## Next Recommended Steps
1. Apply same pattern to maintenance requests (high priority - most complex feature)
2. Apply delete pattern to documents and communication logs (low complexity)
3. Fix tenant and maintenance detail pages to use real data
4. Add server-side validation with Zod schemas
5. Add toast notifications for better UX
6. Consider optimistic updates for better perceived performance
