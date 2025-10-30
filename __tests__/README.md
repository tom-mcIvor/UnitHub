# UnitHub Testing Documentation

## Test Suite Overview

This project uses **Jest** and **React Testing Library** for testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Files

### Server Actions Tests
- `__tests__/actions/tenants.test.ts` - CRUD operations for tenants ✅ PASSING
- `__tests__/actions/rent.test.ts` - CRUD operations for rent payments ✅ PASSING

### Component Tests
- `__tests__/components/tenant-form.test.tsx` - Tenant form validation and submission ❌ NEEDS MOCK UPDATES
- `__tests__/components/rent-payment-form.test.tsx` - Rent payment form ❌ NEEDS MOCK UPDATES
- `__tests__/components/tenants-list.test.tsx` - Tenants list display and filtering ❌ NEEDS MOCK UPDATES
- `__tests__/components/rent-tracking-page.test.tsx` - Rent tracking page ❌ NEEDS MOCK UPDATES

## Current Status

**Passing Tests**: 14/20
**Test Suites**: 2/6 passing

### What Works
- ✅ Server actions tests (tenants and rent)
- ✅ Server action error handling
- ✅ Database CRUD operations mocking

### Known Issues

#### Next.js Server Components in Tests
Component tests that import files with server actions fail with:
```
ReferenceError: Request is not defined
```

**Cause**: Next.js server-side imports (`next/cache`, server actions) don't work in jsdom environment.

**Solutions**:
1. **Separate concerns**: Move business logic into separate testable functions
2. **Mock deeper**: Mock the entire component file, not just the actions
3. **Use E2E tests**: Use Playwright/Cypress for full component testing
4. **Test isolation**: Test presentational components separately from containers

## Test Coverage

### Server Actions (Full Coverage)
- ✅ `getTenants()` - Fetch all tenants
- ✅ `getTenant(id)` - Fetch single tenant
- ✅ `createTenant()` - Create with valid data
- ✅ `createTenant()` - Error on missing fields
- ✅ `updateTenant()` - Update tenant
- ✅ `deleteTenant()` - Delete tenant
- ✅ `getRentPayments()` - Fetch payments
- ✅ `createRentPayment()` - Create payment
- ✅ `createRentPayment()` - Validation errors
- ✅ `updateRentPayment()` - Update payment
- ✅ `deleteRentPayment()` - Delete payment

### Components (Partial Coverage)
Form validation, rendering, and user interactions are tested but need environment fixes.

## Test Patterns Used

### Server Action Testing Pattern
```typescript
// Mock Supabase client
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

### Component Testing Pattern
```typescript
// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}))

// Render and test
render(<Component />)
expect(screen.getByText(/expected text/i)).toBeInTheDocument()
```

## Recommendations

### Short Term
1. Focus on server action tests (already passing)
2. Add integration tests for critical paths
3. Use Playwright for E2E testing

### Long Term
1. Refactor components to separate container/presentation
2. Extract business logic into pure functions
3. Add Storybook for component development
4. Implement visual regression testing

## Adding New Tests

### For Server Actions
```typescript
describe('newAction', () => {
  it('should perform action successfully', async () => {
    const result = await newAction(params)
    expect(result.success).toBe(true)
  })
})
```

### For Components
```typescript
describe('NewComponent', () => {
  it('renders correctly', () => {
    render(<NewComponent />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
```

## Configuration Files

- `jest.config.js` - Jest configuration with Next.js support
- `jest.setup.js` - Test environment setup with polyfills
- `package.json` - Test scripts and dependencies

## Dependencies

```json
{
  "jest": "^30.2.0",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/user-event": "^14.6.1",
  "jest-environment-jsdom": "^30.2.0"
}
```
