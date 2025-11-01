# Testing Best Practices Guide

**UnitHub Testing Documentation**
**Last Updated**: 2025-11-02 (Multi-Tenancy & Google OAuth Tests)
**Current Test Coverage**: 303/303 tests passing (100%)

---

## Table of Contents

1. [Test Structure Overview](#test-structure-overview)
2. [What's Currently Being Tested](#whats-currently-being-tested)
3. [What's Yet to Be Tested](#whats-yet-to-be-tested)
4. [Testing Best Practices](#testing-best-practices)
5. [How to Write Tests](#how-to-write-tests)
6. [Running Tests](#running-tests)
7. [Debugging Failed Tests](#debugging-failed-tests)
8. [Auth Testing Patterns](#auth-testing-patterns)

---

## Test Structure Overview

This project uses **co-located tests** following the pattern:

```
app/actions/
├── __tests__/           # Server action tests
│   ├── tenants.test.ts
│   ├── rent.test.ts
│   ├── maintenance.test.ts
│   ├── documents.test.ts
│   └── communications.test.ts
├── tenants.ts
├── rent.ts
└── ...

components/tenants/
├── __tests__/           # Component tests
│   ├── tenant-form.test.tsx
│   └── tenants-list.test.tsx
├── tenant-form.tsx
└── tenants-list.tsx
```

**Benefits of Co-located Tests:**
- Tests live next to the code they test
- Easy to find and update tests
- Clear relationship between code and tests
- Follows industry best practices (used by React, Next.js, etc.)

---

## What's Currently Being Tested

### ✅ Server Actions (100% Coverage - All Passing)

#### **Tenants** (`app/actions/__tests__/tenants.test.ts`)
- ✅ Happy-path CRUD coverage for tenants (list, read, create, update, delete)
- ✅ Validation failure for required fields
- ✅ Supabase error responses and unexpected `createClient` rejections for each action
- ✅ Dual revalidation assertions for updates and deletes

**Tests**: 17 passing

#### **Rent Payments** (`app/actions/__tests__/rent.test.ts`)
- ✅ `getRentPayment` success, missing record, and unexpected rejection
- ✅ `getRentPayments` handles overdue mapping, Supabase errors, and exception paths
- ✅ `createRentPayment` validates payloads, handles insert failures, and unexpected rejects
- ✅ `updateRentPayment` covers validation, Supabase failure, and exception branches
- ✅ `deleteRentPayment` asserts Supabase error handling and exception branches

**Tests**: 18 passing

#### **Maintenance Requests** (`app/actions/__tests__/maintenance.test.ts`)
- ✅ CRUD workflows with tenant joins
- ✅ Validation error coverage for required fields
- ✅ Delete flow exercising Supabase error handling

**Tests**: 6 passing

#### **Documents** (`app/actions/__tests__/documents.test.ts`)
- ✅ `getDocuments` and `getDocument` with success, Supabase error, and unexpected reject scenarios
- ✅ `createDocument` and `updateDocument` cover validation, Supabase error returns, and exception paths
- ✅ `deleteDocument` covers storage cleanup success, Supabase failures, storage removal errors, and client creation rejects
- ✅ Ensures revalidatePath and admin storage interactions are invoked correctly

**Tests**: 19 passing

#### **Communication Logs** (`app/actions/__tests__/communications.test.ts`)
- ✅ Happy-path CRUD coverage for communications (list, read, create, update, delete)
- ✅ Validation error handling for required fields
- ✅ Supabase error responses and unexpected `createClient` rejections across all actions
- ✅ Revalidation assertions for create/update/delete flows
- ✅ Fallback mapping coverage for missing tenant data

**Tests**: 17 passing

**Total Server Action Tests**: 77 passing ✅

**Layout Component Tests**: 5 passing ✅
- `components/layout/__tests__/sidebar.test.tsx` - 2 tests
- `components/layout/__tests__/header.test.tsx` - 1 test
- `components/layout/__tests__/dashboard-layout.test.tsx` - 2 tests

**Page Component Tests** ✅
- `app/__tests__/dashboard-page.test.tsx`
- `app/(dashboard)/tenants/__tests__/page.test.tsx`
- `app/(dashboard)/tenants/__tests__/tenant-detail-page.test.tsx`
- `app/(dashboard)/rent/__tests__/page.test.tsx`
- `app/(dashboard)/maintenance/__tests__/page.test.tsx`
- `app/(dashboard)/maintenance/__tests__/maintenance-detail-page.test.tsx`
- `app/(dashboard)/communications/__tests__/page.test.tsx`
- `app/(dashboard)/documents/__tests__/page.test.tsx`
- `app/(dashboard)/settings/__tests__/page.test.tsx`

**Documents, Rent & Communications Component Tests** ✅
- `components/documents/__tests__/documents-page.test.tsx`
- `components/documents/__tests__/document-upload.test.tsx`
- `components/documents/__tests__/document-form.test.tsx`
- `components/documents/__tests__/document-detail.test.tsx`
- `components/documents/__tests__/lease-extractor.test.tsx`
- `components/communications/__tests__/communication-form.test.tsx`
- `components/rent/__tests__/payment-reminder-generator.test.tsx`
- `components/rent/__tests__/rent-chart.test.tsx`
- `components/rent/__tests__/rent-tracking-page.test.tsx`

**Other Component Tests** ✅
- `components/__tests__/theme-provider.test.tsx`

### ✅ Component Suites (Stabilized)

#### **Tenant Form** (`components/tenants/__tests__/tenant-form.test.tsx`)
- ✅ Renders each required field
- ✅ Displays validation errors
- ✅ Handles cancel flow
- ✅ Submits valid payloads and asserts toast notifications

#### **Tenants List** (`components/tenants/__tests__/tenants-list.test.tsx`)
- ✅ Renders tenant data and empty states
- ✅ Surfaces error banner copy
- ✅ Supports name/unit filtering
- ✅ Opens the modal workflow

#### **Rent Payment Form** (`components/rent/__tests__/rent-payment-form.test.tsx`)
- ✅ Confirms field population
- ✅ Validates required inputs
- ✅ Records successful submissions and asserts toast notifications

#### **Rent Tracking Page** (`components/rent/__tests__/rent-tracking-page.test.tsx`)
- ✅ Renders summary stats
- ✅ Filters by status and search
- ✅ Shows empty/error states

#### **Documents Page** (`components/documents/__tests__/documents-page.test.tsx`)
- ✅ Covers filtering by type and search
- ✅ Opens upload/form modals and delete confirmation
- ✅ Mocks server action delete flow and router refresh

#### **Document Upload Modal** (`components/documents/__tests__/document-upload.test.tsx`)
- ✅ Handles required field validation and Supabase upload happy path
- ✅ Surfaces upload failures and asserts toast notifications
- ✅ Verifies success banner, router refresh, and close timer

#### **Document Metadata Form** (`components/documents/__tests__/document-form.test.tsx`)
- ✅ Exercises create/update flows with zod validation
- ✅ Confirms success and error toast notifications
- ✅ Refreshes data and closes after debounce timer

#### **Document Detail View** (`components/documents/__tests__/document-detail.test.tsx`)
- ✅ Shows extracted lease data
- ✅ Guards download button when file path missing
- ✅ Launches edit modal with initial data

#### **Lease Extractor** (`components/documents/__tests__/lease-extractor.test.tsx`)
- ✅ Simulates drag/drop upload and async extraction
- ✅ Displays confidence badges and import call
- ✅ Handles cancel + import flows

#### **Payment Reminder Generator** (`components/rent/__tests__/payment-reminder-generator.test.tsx`)
- ✅ Calls AI reminder endpoint with correct payload
- ✅ Renders loading and generated states
- ✅ Mocks clipboard copy + reset timer

#### **Communication Form** (`components/communications/__tests__/communication-form.test.tsx`)
- ✅ Validates required fields before submission
- ✅ Drives create vs update flows with FormData payload assertions
- ✅ Surfaces server-side errors and asserts toast notifications

Component suites use mocks for Next.js router hooks, server actions, and the `RentChart` module to keep tests isolated from server-only APIs.

---

## What's Yet to Be Tested

### 1. ❌ Integration Tests

**What's Missing**: Full end-to-end request/response cycles

**Recommended Coverage**:
- API routes (if any exist)
- Database operations with actual test database
- Form submission → Server Action → Database → UI update flow
- Error handling across full stack
- Authentication flows (when implemented)

**Setup Required**:
- Test database (Supabase test project or Docker postgres)
- Database seed scripts for consistent test data
- Cleanup scripts to reset state between tests
- Separate `tests/integration/` directory

### 2. ❌ Edge Cases and Error Scenarios

**Server Actions Need**:
- Network failure handling
- Database constraint violations
- Concurrent operation conflicts
- Large dataset performance
- Special characters in input (SQL injection attempts)
- Empty string vs null vs undefined handling
- UUID validation
- Date range validation

**Components Need**:
- App shell providers (`app/layout.tsx`, `(dashboard)/layout.tsx`)
- Dynamic document page (`app/(dashboard)/documents/[id]/page.tsx`)
- Shared UI primitives (`components/ui/**`) smoke coverage
- Slow network simulation
- Form submission during network failure
- Optimistic UI updates
- Accessibility (keyboard navigation, screen readers)

### 3. ❌ Visual Regression Tests

**Missing Coverage**:
- Component appearance changes
- Responsive design breakpoints
- Dark mode (if implemented)
- Browser compatibility

**Recommended Tools**:
- Storybook for component development
- Chromatic or Percy for visual diffs
- Jest snapshots for static components

### 4. ❌ E2E Tests

**Missing Coverage**:
- Complete user journeys
- Multi-page workflows
- Real browser interactions
- Mobile device testing

**Recommended Tools**:
- Playwright (recommended for Next.js)
- Cypress
- Testing across Chrome, Firefox, Safari

### 5. ❌ Performance Tests

**Missing Coverage**:
- Server action response times
- Component render performance
- Database query optimization
- Bundle size monitoring
- Memory leak detection

---

## Testing Best Practices

### 1. Test Organization

**✅ DO**:
```typescript
describe('Module Name', () => {
  describe('functionName', () => {
    it('should do specific thing when condition', async () => {
      // Arrange
      const input = setupInput()

      // Act
      const result = await functionName(input)

      // Assert
      expect(result).toBe(expected)
    })
  })
})
```

**❌ DON'T**:
```typescript
test('it works', async () => {
  const result = await doEverything()
  expect(result).toBeTruthy() // Too vague
})
```

### 2. Test Naming Conventions

**Format**: `should [expected behavior] when [condition]`

**✅ Good Examples**:
- `should return error when required fields are missing`
- `should fetch all tenants successfully`
- `should update tenant with valid data`

**❌ Bad Examples**:
- `test create tenant` (not descriptive)
- `it works` (too vague)
- `test1`, `test2` (meaningless)

### 3. Mock Strategies

#### **Server Actions**
```typescript
// Mock Supabase at the module level
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: mockData,
        error: null,
      })),
    })),
  })),
}))

// Mock Next.js cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))
```

#### **Components** (When Working)
```typescript
// Mock navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}))

// Mock server actions
jest.mock('@/app/actions/tenants', () => ({
  createTenant: jest.fn(),
  getTenants: jest.fn(),
}))
```

### 4. Test Data Management

**✅ DO**: Use realistic, representative data
```typescript
const mockTenant = {
  id: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID
  name: 'John Doe',
  email: 'john@example.com',
  unit_number: '101',
  rent_amount: '1200.00', // Match DB format (string)
}
```

**❌ DON'T**: Use overly simple or unrealistic data
```typescript
const mockTenant = {
  id: '1', // Not a real UUID
  name: 'a',
  email: 'b',
  unit_number: '1',
  rent_amount: 0, // Wrong type
}
```

### 5. Assertion Best Practices

**✅ Specific Assertions**:
```typescript
expect(result.success).toBe(true)
expect(result.error).toBeNull()
expect(result.data).toBeDefined()
expect(result.data?.name).toBe('John Doe')
```

**❌ Weak Assertions**:
```typescript
expect(result).toBeTruthy() // Too vague
expect(result.data).not.toBeUndefined() // Use toBeDefined()
```

### 6. Test Independence

**✅ DO**: Each test should be independent
```typescript
describe('getTenants', () => {
  beforeEach(() => {
    jest.clearAllMocks() // Reset mocks before each test
  })

  it('should fetch tenants', async () => {
    // Test doesn't depend on other tests
  })
})
```

**❌ DON'T**: Share state between tests
```typescript
let tenantId // Shared variable causes test coupling
it('creates tenant', async () => {
  tenantId = result.id
})
it('updates tenant', async () => {
  await updateTenant(tenantId) // Depends on previous test
})
```

### 7. Coverage Goals

**Target Coverage by Layer**:
- **Server Actions**: 100% (critical business logic)
- **Components**: 80%+ (UI logic and interactions)
- **Integration**: Key user journeys (happy path + error paths)
- **E2E**: Critical workflows (auth, payments, core features)

**Don't chase 100% coverage** - focus on:
- Business logic
- Error handling
- Edge cases
- User-critical paths

---

## How to Write Tests

### Step 1: Understand the Code

Before writing tests, understand:
- What does the function do?
- What are the inputs and outputs?
- What are the edge cases?
- What can go wrong?

### Step 2: Create Test File

Place test file in `__tests__/` directory next to source code:
```
app/actions/myaction.ts
app/actions/__tests__/myaction.test.ts
```

### Step 3: Set Up Mocks

Mock external dependencies:
```typescript
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    // Mock Supabase methods
  })),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))
```

### Step 4: Write Test Structure

```typescript
describe('Module or Component Name', () => {
  describe('functionName', () => {
    it('should [behavior] when [condition]', async () => {
      // Arrange: Set up test data
      const formData = new FormData()
      formData.append('name', 'Test')

      // Act: Execute the function
      const result = await functionName(formData)

      // Assert: Verify the outcome
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })
  })
})
```

### Step 5: Test Happy Path First

Start with the successful case:
```typescript
it('should create tenant successfully', async () => {
  const formData = new FormData()
  formData.append('name', 'John Doe')
  formData.append('email', 'john@example.com')
  // ... all required fields

  const result = await createTenant(formData)

  expect(result.success).toBe(true)
  expect(result.error).toBeNull()
  expect(result.data).toBeDefined()
})
```

### Step 6: Test Error Cases

Then test failure scenarios:
```typescript
it('should return error when required fields are missing', async () => {
  const formData = new FormData()
  formData.append('name', 'John Doe')
  // Missing other required fields

  const result = await createTenant(formData)

  expect(result.success).toBe(false)
  expect(result.error).toBe('Missing required fields')
  expect(result.data).toBe(null)
})
```

### Step 7: Run Tests

```bash
npm test -- path/to/test
```

### Step 8: Refine

- Add more edge cases
- Improve assertions
- Add comments for complex logic
- Ensure tests are readable

---

## Running Tests

### Run All Tests
```bash
npx jest --runInBand
```

> ℹ️ `npm test` without `--runInBand` can still crash a Jest worker. Until the script is updated, prefer the explicit command above.

### Run Specific Test Suite
```bash
npx jest --runInBand app/actions/__tests__/tenants.test.ts
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npx jest --coverage --runInBand --silent
```

### Run Only Server Action Tests
```bash
npx jest --runInBand app/actions/__tests__
```

### Run Only Component Tests
```bash
npx jest --runInBand components
```

---

## Debugging Failed Tests

### 1. Read the Error Message

```
Error: Expected true, received false
  at Object.toBe (tenants.test.ts:45:29)
```

Look at:
- Line number (45)
- File name (tenants.test.ts)
- What was expected vs received

### 2. Add Console Logs

```typescript
it('should create tenant', async () => {
  const result = await createTenant(formData)
  console.log('Result:', result) // Debug output
  expect(result.success).toBe(true)
})
```

### 3. Check Mock Setup

Ensure mocks return correct data:
```typescript
const mockTenants = [
  {
    id: '123',
    name: 'John Doe',
    unit_number: '101', // Check: snake_case or camelCase?
  },
]
```

### 4. Verify Async Handling

Ensure `async/await` is used:
```typescript
// ❌ Wrong
it('should create tenant', () => {
  const result = createTenant(formData) // Missing await
  expect(result.success).toBe(true)
})

// ✅ Correct
it('should create tenant', async () => {
  const result = await createTenant(formData)
  expect(result.success).toBe(true)
})
```

### 5. Isolate the Problem

Run only the failing test:
```bash
npm test -- -t "should create tenant"
```

### 6. Check Environment

For component tests failing with `Request is not defined`:
- This is a known issue with Next.js server imports in jsdom
- See `docs/testing-implementation.md` for solutions

---

## Next Steps

**📋 See [`docs/testing-roadmap.md`](./testing-roadmap.md) for your complete testing guide including:**
- Overview and current status
- Quick start guides for different scenarios
- How to run tests and view coverage
- 4-phase implementation plan
- Learning resources and troubleshooting
- Complete test checklist

### Quick Reference

**Phase 1 - Fix Foundation** (1-2 days)
- Fix component coverage tracking
- Un-mock RentChart
- Create test helpers

**Phase 2 - Core Coverage** (1 week)
- Test all AI API routes
- Test all page components
- Test untested application components
- Test layout components

**Phase 3 - Integration Testing** (3-4 days)
- Set up test database
- Test critical workflows
- Verify data integrity

**Phase 4 - E2E & Advanced** (1 week)
- Set up Playwright E2E tests
- Visual regression with Storybook
- Accessibility testing
- Performance benchmarking

### Coverage Goals
- Current: **57.62%** overall (Updated 2025-11-01 Communications Server Action Edge Cases)
- Phase 1: **25%** ✅ (Exceeded)
- Phase 2: **50%** ✅ (Exceeded)
- Phase 3: **60%** (In Progress - 95% complete)
- Phase 4: **70%+**

---

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing)
- [Playwright Documentation](https://playwright.dev/)

### Internal Docs
- `docs/testing-implementation.md` - Detailed implementation notes
- `jest.config.js` - Jest configuration
- `jest.setup.ts` - Global test setup

---

---

## Auth Testing Patterns

After implementing multi-tenancy and Google OAuth, all server action tests require auth mocks.

### Pattern: Mock Supabase Auth

```typescript
const createSupabaseMock = () => {
  const mockUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
  }

  return {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({ data: [...], error: null })),
      })),
    })),
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      }),
    },
  }
}
```

### Pattern: Chain `.eq()` for user_id Filtering

All queries now include `.eq('user_id', user.id)`, so mocks must support chaining:

```typescript
const chain: any = {}
chain.eq = jest.fn(() => chain)
chain.order = jest.fn(() => chain)
chain.limit = jest.fn(() => ({ data: [...], error: null }))

return { select: jest.fn(() => chain) }
```

### Pattern: Test Unauthenticated Access

```typescript
it('should return error when user not authenticated', async () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      }),
    },
  }

  const result = await getTenants()

  expect(result.success).toBe(false)
  expect(result.error).toBe('User not authenticated')
})
```

See `app/actions/__tests__/dashboard.test.ts` for a complete working example.

---

## Summary

**Current Status**: 303/303 tests passing (100% pass rate)

**What's Working**:
- All server action tests updated with auth.getUser() mocks
- Multi-tenancy user_id filtering tested in dashboard actions
- Component tests for tenants, rent, dashboard, maintenance, documents, communications, settings stable
- Layout component tests (sidebar, header, dashboard layout) include new SignUpForm mock
- All 58 test suites passing
- Auth state listener pattern tested (no flash rendering)

**What Still Needs Work**:
- Auth component tests missing (SignInForm, SignUpForm)
- OAuth callback route tests missing
- Integration tests for multi-tenancy isolation
- RLS policy testing
- E2E tests for Google OAuth flow
- Visual regression testing

**Key Principle**: **Test behavior, not implementation**

Focus on what the code does (outputs) for given inputs, not how it does it (internal logic).
