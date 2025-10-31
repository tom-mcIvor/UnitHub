# Testing Best Practices Guide

**UnitHub Testing Documentation**
**Last Updated**: 2025-10-31
**Current Test Coverage**: 53 tests passing (server actions + components)

---

## Table of Contents

1. [Test Structure Overview](#test-structure-overview)
2. [What's Currently Being Tested](#whats-currently-being-tested)
3. [What's Yet to Be Tested](#whats-yet-to-be-tested)
4. [Testing Best Practices](#testing-best-practices)
5. [How to Write Tests](#how-to-write-tests)
6. [Running Tests](#running-tests)
7. [Debugging Failed Tests](#debugging-failed-tests)

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
- ✅ Fetch all tenants with proper ordering
- ✅ Fetch single tenant by ID
- ✅ Create tenant with valid data
- ✅ Validation error on missing required fields
- ✅ Update existing tenant
- ✅ Delete tenant by ID

**Tests**: 6 passing | **Lines**: 152

#### **Rent Payments** (`app/actions/__tests__/rent.test.ts`)
- ✅ Fetch all rent payments with tenant JOIN
- ✅ Create rent payment with valid data
- ✅ Validation error on missing fields
- ✅ Update existing rent payment
- ✅ Delete rent payment by ID

**Tests**: 5 passing | **Lines**: 135

#### **Maintenance Requests** (`app/actions/__tests__/maintenance.test.ts`)
- ✅ Fetch all maintenance requests with tenant info
- ✅ Fetch single maintenance request by ID
- ✅ Create maintenance request with valid data
- ✅ Validation error on missing required fields
- ✅ Update existing maintenance request
- ✅ Delete maintenance request by ID

**Tests**: 6 passing | **Lines**: 162

#### **Documents** (`app/actions/__tests__/documents.test.ts`)
- ✅ Fetch all documents with optional tenant info
- ✅ Fetch single document by ID
- ✅ Create document with tenant
- ✅ Create document without tenant (property-level)
- ✅ Validation error on missing required fields
- ✅ Update existing document
- ✅ Delete document by ID

**Tests**: 7 passing | **Lines**: 156

#### **Communication Logs** (`app/actions/__tests__/communications.test.ts`)
- ✅ Fetch all communication logs with tenant info
- ✅ Fetch single communication log by ID
- ✅ Create communication log with valid data
- ✅ Validation error on missing required fields
- ✅ Update existing communication log
- ✅ Delete communication log by ID

**Tests**: 6 passing | **Lines**: 141

**Total Server Action Tests**: 30 passing ✅

### ✅ Component Suites (Stabilized)

#### **Tenant Form** (`components/tenants/__tests__/tenant-form.test.tsx`)
- ✅ Renders each required field
- ✅ Displays validation errors
- ✅ Handles cancel flow
- ✅ Submits valid payloads

#### **Tenants List** (`components/tenants/__tests__/tenants-list.test.tsx`)
- ✅ Renders tenant data and empty states
- ✅ Surfaces error banner copy
- ✅ Supports name/unit filtering
- ✅ Opens the modal workflow

#### **Rent Payment Form** (`components/rent/__tests__/rent-payment-form.test.tsx`)
- ✅ Confirms field population
- ✅ Validates required inputs
- ✅ Records successful submissions via toast confirmation

#### **Rent Tracking Page** (`components/rent/__tests__/rent-tracking-page.test.tsx`)
- ✅ Renders summary stats
- ✅ Filters by status and search
- ✅ Shows empty/error states

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
- Loading states
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
npm test
```

### Run Specific Test Suite
```bash
npm test -- app/actions/__tests__/tenants.test.ts
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Only Server Action Tests
```bash
npm test -- app/actions/__tests__
```

### Run Only Component Tests (Currently Blocked)
```bash
npm test -- components
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

### Short Term (1-2 weeks)
1. ✅ Complete all server action tests (DONE)
2. ⏳ Fix component test environment issues
3. ⏳ Add tests for edge cases in server actions
4. ⏳ Set up E2E testing with Playwright

### Medium Term (1 month)
1. ⏳ Create integration test suite with test database
2. ⏳ Add visual regression testing with Storybook
3. ⏳ Implement CI/CD pipeline with automatic testing
4. ⏳ Add code coverage reporting

### Long Term (2-3 months)
1. ⏳ Achieve 80%+ overall code coverage
2. ⏳ Performance testing and benchmarking
3. ⏳ Security testing (SQL injection, XSS, CSRF)
4. ⏳ Accessibility testing (WCAG compliance)

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
- `jest.setup.js` - Global test setup

---

## Summary

**Current Status**: ✅ 30/30 server action tests passing

**What's Working**:
- Complete server action test coverage
- Proper mocking of Supabase and Next.js cache
- Co-located test structure
- Fast test execution (~1.8s)

**What Needs Work**:
- Component tests blocked by environment issues
- No integration or E2E tests yet
- Limited edge case coverage
- No visual regression testing

**Key Principle**: **Test behavior, not implementation**

Focus on what the code does (outputs) for given inputs, not how it does it (internal logic).
