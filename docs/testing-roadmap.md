# Testing Roadmap - UnitHub

**Created**: 2025-10-31
**Current Coverage**: 26.72% overall | 108 Jest tests passing
**Target Coverage**: 60-70% overall by end of roadmap

> 📚 **This is your complete testing guide** - includes overview, implementation plan, and resources all in one place.

---

## 📊 Current Status

**Overall Coverage**: 26.72%
- **Server Actions**: ~71.75% ✅ (dashboard actions now covered)
- **Components**: 0% tracked ⚠️ (RTL suites exist but coverage tooling still ignores them)
- **Pages**: 0% ❌
- **API Routes**: 100% ✅ (AI categorize/extract/reminder/suggest routes)

**Total Tests**: 108 passing

### ✅ Completed
- [x] Jest & RTL setup
- [x] Server action tests (tenants, rent, maintenance, documents, communications, dashboard)
- [x] Component tests (tenant/rent/dashboard/maintenance suites) - coverage still not tracked
- [x] Test documentation
- [x] Co-located test structure
- [x] AI API route tests (categorize, extract lease, reminder, suggest vendor)

### 🚧 In Progress
- [ ] Fix component coverage tracking
- [ ] Add page component tests

### ❌ Not Started
- [ ] Integration tests
- [ ] E2E tests
- [ ] Visual regression tests
- [ ] Accessibility tests
- [ ] Performance tests

---

## 🎯 Quick Start Guide

### For New Contributors

1. **Read**: [Testing Best Practices](./testing-best-practices.md) - Sections 1-4
2. **Review**: Existing test files in `app/actions/__tests__/` to see patterns
3. **Write**: Your first test following the established patterns
4. **Run**: `npm test -- path/to/your/test.ts`

### For Project Planning

1. **Read**: This document - Full roadmap
2. **Identify**: Which phase you're working on
3. **Pick**: Tasks from the [checklist](#appendix-test-checklist)
4. **Track**: Progress by checking off completed items

### For Debugging Test Failures

1. **Check**: Error message and stack trace
2. **Review**: [Testing Implementation](./testing-implementation.md) - "Known Issues"
3. **Try**: Solutions from "What Was Tried" section
4. **Reference**: [Testing Best Practices](./testing-best-practices.md) - "Debugging Failed Tests"

### If You Have Limited Time

**1 hour**: Read [Testing Best Practices](./testing-best-practices.md) and write one test
**1 day**: Complete [Phase 1](#phase-1-fix-foundation)
**1 week**: Complete [Phase 2](#phase-2-core-application-coverage)
**1 month**: Complete Phases 1-3

---

## 🏃 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- app/actions/__tests__/tenants.test.ts

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run only server action tests
npm test -- app/actions/__tests__

# Run only component tests
npm test -- components
```

### Coverage Reports

After running `npm run test:coverage`:
- Open `coverage/lcov-report/index.html` in browser
- View line-by-line coverage
- Identify untested code

---

## 📚 Related Documentation

### Testing Docs
- **[Testing Best Practices](./testing-best-practices.md)** - Guidelines and patterns for writing tests
- **[Testing Implementation](./testing-implementation.md)** - Technical setup details and known issues
- **[Component Test Suite Stabilization](./component-test-suite-stabilization.md)** - Historical component test fixes
- **[Additional Server Action Tests](./additional-server-action-tests.md)** - Server action test coverage details

### Configuration Files
- `jest.config.js` - Main Jest configuration
- `jest.setup.ts` - Global test setup (polyfills, matchers)
- `package.json` - Test scripts and dependencies

### Future Config (Phase 4)
- `playwright.config.ts` - E2E test configuration (to be created)
- `.storybook/main.ts` - Storybook configuration (to be created)
- `lighthouserc.js` - Performance testing (to be created)

---

## Table of Contents

1. [Testing Priorities](#testing-priorities)
2. [Phase 1: Fix Foundation](#phase-1-fix-foundation)
3. [Phase 2: Core Application Coverage](#phase-2-core-application-coverage)
4. [Phase 3: Integration Testing](#phase-3-integration-testing)
5. [Phase 4: E2E & Advanced Testing](#phase-4-e2e--advanced-testing)
6. [Success Metrics](#success-metrics)
7. [Timeline Estimates](#timeline-estimates)
8. [Maintenance Plan](#maintenance-plan)
9. [Learning Resources](#learning-resources)
10. [Getting Help](#getting-help)
11. [Appendix: Test Checklist](#appendix-test-checklist)

---

## Current State Details

### ✅ What's Working
- **Server Actions**: 30 tests, 60-74% coverage
  - Tenants (6 tests)
  - Rent (5 tests)
  - Maintenance (6 tests)
  - Documents (7 tests)
  - Communications (6 tests)
- **Component Tests**: 23 tests passing but 0% coverage counted
  - Tenant form & list (11 tests)
  - Rent payment form & tracking page (12 tests)

### ❌ What's Missing
- **Page components**: 0% coverage (all routes untested)
- **API routes**: 0% coverage (AI features untested)
- **Application components**: 0% coverage (forms, pages, layouts)
- **Integration tests**: None
- **E2E tests**: None

### 🎯 Goal
Achieve **60-70% overall coverage** with focus on:
1. Business-critical paths (rent tracking, tenant management)
2. AI features (your competitive advantage)
3. User workflows (end-to-end scenarios)

---

## Testing Priorities

### Priority Matrix

| Component | Business Impact | Current Coverage | Priority |
|-----------|----------------|------------------|----------|
| AI API Routes | 🔴 High | 0% | **P0 - Critical** |
| Page Components | 🔴 High | 0% | **P0 - Critical** |
| Component Coverage Tracking | 🟡 Medium | Broken | **P0 - Critical** |
| Form Components | 🔴 High | 0% | **P1 - High** |
| Dashboard Components | 🟡 Medium | 0% | **P1 - High** |
| Integration Tests | 🔴 High | 0% | **P2 - Medium** |
| E2E Tests | 🟡 Medium | 0% | **P2 - Medium** |
| Chart Component | 🟡 Medium | Mocked | **P3 - Low** |
| Layout Components | 🟢 Low | 0% | **P3 - Low** |
| UI Components | 🟢 Low | 0% | **P4 - Nice to Have** |

---

## Phase 1: Fix Foundation

**Goal**: Fix existing test infrastructure issues and establish baseline
**Duration**: 1-2 days
**Target Coverage Increase**: 12% → 25%

### Tasks

#### 1.1 Fix Component Coverage Tracking
**Priority**: P0
**Estimated Time**: 2-4 hours

**Issue**: Component tests pass but show 0% coverage in reports

**Steps**:
1. Check `jest.config.js` coverage collection patterns
2. Verify that `components/**/*.{ts,tsx}` is included in `collectCoverageFrom`
3. Test with single component: `npm test -- --coverage components/tenants/__tests__/tenant-form.test.tsx`
4. Check if mocking is preventing coverage collection
5. Review jest-environment-jsdom configuration
6. Consider adding `@jest/globals` for better environment handling

**Expected Outcome**: Component tests should show in coverage reports

**Files to Update**:
- `jest.config.js`
- Possibly `jest.setup.ts`

---

#### 1.2 Un-mock RentChart
**Priority**: P3
**Estimated Time**: 1-2 hours

**Issue**: RentChart is completely mocked, leaving actual chart code untested

**Steps**:
1. Review why RentChart was mocked (check React act warnings)
2. Try un-mocking with proper `waitFor` assertions
3. If Recharts causes issues, create a lightweight wrapper component
4. Add data transformation tests separately
5. Consider visual regression testing for charts

**Expected Outcome**: Real RentChart code is tested

**Files to Update**:
- `components/rent/__tests__/rent-tracking-page.test.tsx`
- Potentially create `components/rent/__tests__/rent-chart.test.tsx`

---

#### 1.3 Document Current Test Patterns
**Priority**: P1
**Estimated Time**: 1 hour

**Steps**:
1. Review all passing tests to identify patterns
2. Extract reusable test utilities
3. Create test helpers for common mocking scenarios
4. Document in `docs/testing-best-practices.md`

**Expected Outcome**: Clear patterns for writing new tests

**Files to Create**:
- `tests/utils/test-helpers.ts` (mock factories)
- `tests/utils/test-data.ts` (fixture data)

---

## Phase 2: Core Application Coverage

**Goal**: Test all user-facing application code
**Duration**: 1 week
**Target Coverage Increase**: 25% → 50%

### 2.1 Test API Routes (AI Features)
**Priority**: P0
**Estimated Time**: 1 day

**Routes to Test**:
- ✅ `app/api/ai/categorize-maintenance/route.ts`
- ✅ `app/api/ai/extract-lease/route.ts`
- ✅ `app/api/ai/generate-reminder/route.ts`
- ✅ `app/api/ai/suggest-vendor/route.ts`

**For Each Route, Test**:
1. Successful request with valid payload
2. Error handling for missing required fields
3. OpenAI API failure scenarios
4. Invalid JSON responses from OpenAI
5. Rate limiting (if implemented)
6. Response format validation

**Test Structure**:
```typescript
// app/api/ai/__tests__/categorize-maintenance.test.ts
describe('POST /api/ai/categorize-maintenance', () => {
  it('should categorize maintenance request successfully', async () => {
    // Mock OpenAI API
    // Send request with description
    // Verify response format and category
  })

  it('should return error when description is missing', async () => {
    // Send request without description
    // Verify error response
  })

  it('should handle OpenAI API failures gracefully', async () => {
    // Mock OpenAI API to fail
    // Verify fallback behavior
  })
})
```

**Files to Create**:
- `app/api/ai/__tests__/categorize-maintenance.test.ts`
- `app/api/ai/__tests__/extract-lease.test.ts`
- `app/api/ai/__tests__/generate-reminder.test.ts`
- `app/api/ai/__tests__/suggest-vendor.test.ts`

**Expected Coverage**: 80%+ for all AI routes

---

### 2.1b Test Document Storage Integration
**Priority**: P0
**Estimated Time**: 1 day

**Targets**:
- `app/actions/documents.ts` (create/update/delete flows)
- `app/api/documents/[id]/download/route.ts`

**Scenarios to Cover**:
1. `createDocument` persists `storage_path` and returns mapped data.
2. `updateDocument` keeps the stored path while updating metadata.
3. `deleteDocument` removes the DB record and invokes the storage client with the expected path (capture/log failures).
4. Download proxy streams binaries with correct headers (`Content-Type`, `Content-Disposition`, `Cache-Control`).
5. Download proxy handles missing `storage_path` or Supabase download errors with the right status codes.

**Test Structure**:
- Add suites under `app/actions/__tests__/documents.test.ts` and `app/api/documents/__tests__/download.test.ts` using the Supabase client mocks in `app/api/ai/test-utils.ts`.

**Expected Coverage**: 85%+ across document actions and the proxy route.

---

### 2.2 Test Page Components
**Priority**: P0
**Estimated Time**: 2 days

**Pages to Test**:
- ✅ `app/page.tsx` (Dashboard)
- ✅ `app/tenants/page.tsx`
- ✅ `app/rent/page.tsx`
- ✅ `app/maintenance/page.tsx`
- ✅ `app/communications/page.tsx`
- ✅ `app/documents/page.tsx`
- ✅ `app/settings/page.tsx`
- ✅ `app/tenants/[id]/page.tsx`
- ✅ `app/maintenance/[id]/page.tsx`

**For Each Page, Test**:
1. Renders without crashing (smoke test)
2. Fetches data using server actions
3. Handles loading states
4. Handles error states
5. Passes data to child components correctly

**Test Structure**:
```typescript
// app/tenants/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import TenantsPage from '../page'
import { getTenants } from '@/app/actions/tenants'

jest.mock('@/app/actions/tenants')

describe('Tenants Page', () => {
  it('should render tenants list', async () => {
    (getTenants as jest.Mock).mockResolvedValue({
      data: [mockTenant1, mockTenant2],
      error: null,
    })

    render(await TenantsPage())

    expect(screen.getByText('Tenants')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should display error message when fetch fails', async () => {
    (getTenants as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Database connection failed',
    })

    render(await TenantsPage())

    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
```

**Files to Create**:
- `app/__tests__/page.test.tsx`
- `app/tenants/__tests__/page.test.tsx`
- `app/rent/__tests__/page.test.tsx`
- `app/maintenance/__tests__/page.test.tsx`
- `app/communications/__tests__/page.test.tsx`
- `app/documents/__tests__/page.test.tsx`
- `app/settings/__tests__/page.test.tsx`
- `app/tenants/[id]/__tests__/page.test.tsx`
- `app/maintenance/[id]/__tests__/page.test.tsx`

**Expected Coverage**: 50-60% for pages

---

### 2.3 Test Untested Application Components
**Priority**: P1
**Estimated Time**: 2 days

**Components to Test**:

#### Maintenance Components
- ✅ `components/maintenance/maintenance-form.tsx`
- ✅ `components/maintenance/maintenance-page.tsx`
- ✅ `components/maintenance/maintenance-detail.tsx`
- ✅ `components/maintenance/ai-categorization.tsx`

#### Document Components
- ✅ `components/documents/document-upload.tsx`
- ✅ `components/documents/documents-page.tsx`
- ✅ `components/documents/lease-extractor.tsx`

#### Communication Components
- ✅ `components/communications/communication-form.tsx`
- ✅ `components/communications/communications-page.tsx`

#### Dashboard Components
- ✅ `components/dashboard/dashboard-overview.tsx`
- ✅ `components/dashboard/stat-card.tsx`
- ✅ `components/dashboard/maintenance-overview.tsx`
- ✅ `components/dashboard/upcoming-payments.tsx`
- ✅ `components/dashboard/recent-tenants.tsx`

#### Other Components
- ✅ `components/rent/payment-reminder-generator.tsx`
- ✅ `components/settings/settings-page.tsx`
- ✅ `components/tenants/tenant-detail.tsx`

**For Each Component, Test**:
1. Renders with required props
2. Handles user interactions (clicks, form inputs)
3. Calls appropriate callbacks/actions
4. Displays validation errors
5. Handles loading and error states

**Test Structure**:
```typescript
// components/maintenance/__tests__/maintenance-form.test.tsx
describe('MaintenanceForm', () => {
  const mockOnClose = jest.fn()
  const mockTenants = [mockTenant1, mockTenant2]

  it('should render all form fields', () => {
    render(<MaintenanceForm onClose={mockOnClose} tenants={mockTenants} />)

    expect(screen.getByText('Tenant *')).toBeInTheDocument()
    expect(screen.getByText('Category *')).toBeInTheDocument()
    expect(screen.getByText('Title *')).toBeInTheDocument()
  })

  it('should show validation errors for missing fields', async () => {
    render(<MaintenanceForm onClose={mockOnClose} tenants={mockTenants} />)

    const submitButton = screen.getByText('Create Request')
    await userEvent.click(submitButton)

    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })

  it('should submit form with valid data', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ success: true })
    jest.mock('@/app/actions/maintenance', () => ({
      createMaintenanceRequest: mockCreate,
    }))

    render(<MaintenanceForm onClose={mockOnClose} tenants={mockTenants} />)

    // Fill form...
    await userEvent.click(screen.getByText('Create Request'))

    expect(mockCreate).toHaveBeenCalledWith(expect.any(FormData))
  })
})
```

**Files to Create**:
- `components/maintenance/__tests__/maintenance-form.test.tsx`
- `components/maintenance/__tests__/maintenance-page.test.tsx`
- `components/maintenance/__tests__/maintenance-detail.test.tsx`
- `components/maintenance/__tests__/ai-categorization.test.tsx`
- `components/documents/__tests__/document-upload.test.tsx`
- `components/documents/__tests__/documents-page.test.tsx`
- `components/documents/__tests__/lease-extractor.test.tsx`
- `components/communications/__tests__/communication-form.test.tsx`
- `components/communications/__tests__/communications-page.test.tsx`
- `components/dashboard/__tests__/dashboard-overview.test.tsx`
- `components/dashboard/__tests__/stat-card.test.tsx`
- `components/dashboard/__tests__/maintenance-overview.test.tsx`
- `components/dashboard/__tests__/upcoming-payments.test.tsx`
- `components/dashboard/__tests__/recent-tenants.test.tsx`
- `components/rent/__tests__/payment-reminder-generator.test.tsx`
- `components/settings/__tests__/settings-page.test.tsx`
- `components/tenants/__tests__/tenant-detail.test.tsx`

**Expected Coverage**: 70-80% for application components

---

### 2.4 Test Layout Components
**Priority**: P3
**Estimated Time**: 2 hours

**Components to Test**:
- ✅ `components/layout/dashboard-layout.tsx`
- ✅ `components/layout/header.tsx`
- ✅ `components/layout/sidebar.tsx`

**For Each Layout, Test**:
1. Renders children correctly
2. Navigation links are present
3. Active route highlighting (if applicable)
4. Mobile responsive behavior

**Expected Coverage**: 60%+ for layouts

---

## Phase 3: Integration Testing

**Goal**: Test complete workflows across multiple components/actions
**Duration**: 3-4 days
**Target Coverage Increase**: 50% → 60%

### 3.1 Set Up Test Database
**Priority**: P2
**Estimated Time**: 4 hours

**Options**:
1. **Supabase Test Project** (Recommended)
   - Create separate Supabase project for testing
   - Use same schema as production
   - Seed with test data

2. **Docker PostgreSQL**
   - Run local postgres container
   - Apply migrations
   - More control, but more setup

**Steps**:
1. Create test database
2. Apply schema migrations
3. Create seed data scripts
4. Create cleanup scripts
5. Add test database credentials to `.env.test`

**Files to Create**:
- `tests/db/seed.sql`
- `tests/db/cleanup.sql`
- `tests/db/setup.ts`
- `.env.test`

---

### 3.2 Integration Test Suite Structure
**Priority**: P2
**Estimated Time**: 1 day

**Create Directory Structure**:
```
tests/
├── integration/
│   ├── setup.ts              # Test database setup
│   ├── teardown.ts           # Cleanup after tests
│   ├── fixtures/             # Test data
│   │   ├── tenants.ts
│   │   ├── rent-payments.ts
│   │   └── maintenance.ts
│   └── workflows/            # Workflow tests
│       ├── tenant-management.test.ts
│       ├── rent-tracking.test.ts
│       ├── maintenance-flow.test.ts
│       └── document-management.test.ts
```

**Configuration**:
```javascript
// jest.integration.config.js
module.exports = {
  ...require('./jest.config'),
  testMatch: ['**/tests/integration/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
  globalTeardown: '<rootDir>/tests/integration/teardown.ts',
}
```

---

### 3.3 Test Critical Workflows
**Priority**: P2
**Estimated Time**: 2 days

#### Workflow 1: Tenant Management
**File**: `tests/integration/workflows/tenant-management.test.ts`

**Test Cases**:
1. Create new tenant → Verify in database
2. Update tenant information → Verify changes persist
3. Delete tenant → Verify cascade deletes (payments, maintenance, etc.)
4. Create tenant with invalid data → Verify error handling
5. Search/filter tenants → Verify query results

---

#### Workflow 2: Rent Tracking
**File**: `tests/integration/workflows/rent-tracking.test.ts`

**Test Cases**:
1. Create tenant → Add rent payment → Verify status
2. Mark payment as paid → Verify due date calculation for next month
3. Payment becomes overdue → Verify status change
4. Update payment amount → Verify total calculations
5. Delete payment → Verify tenant payment history

---

#### Workflow 3: Maintenance Request Flow
**File**: `tests/integration/workflows/maintenance-flow.test.ts`

**Test Cases**:
1. Create maintenance request → AI categorizes → Assign vendor
2. Update request status (open → in-progress → completed)
3. Track estimated vs actual cost
4. Associate request with tenant
5. Delete request → Verify cleanup

---

#### Workflow 4: Document Management
**File**: `tests/integration/workflows/document-management.test.ts`

**Test Cases**:
1. Upload lease document → AI extracts data → Create tenant
2. Upload document to existing tenant
3. Update document metadata
4. Download document
5. Delete document → Verify file cleanup

---

### 3.4 Test Data Integrity
**Priority**: P2
**Estimated Time**: 1 day

**Test Cases**:
- Cascade deletes work correctly
- Foreign key constraints are enforced
- Unique constraints prevent duplicates
- Timestamps update correctly
- Transactions rollback on errors

**File**: `tests/integration/data-integrity.test.ts`

---

## Phase 4: E2E & Advanced Testing

**Goal**: Test in real browser environment, visual regressions, performance
**Duration**: 1 week
**Target Coverage Increase**: 60% → 70%+

### 4.1 Set Up Playwright
**Priority**: P2
**Estimated Time**: 2 hours

**Steps**:
1. Install Playwright: `npm install -D @playwright/test`
2. Initialize config: `npx playwright install`
3. Create test directory: `tests/e2e/`
4. Configure browsers (Chromium, Firefox, WebKit)
5. Set up test fixtures

**Files to Create**:
- `playwright.config.ts`
- `tests/e2e/fixtures/auth.ts`
- `tests/e2e/fixtures/data.ts`

---

### 4.2 E2E Test Critical User Journeys
**Priority**: P2
**Estimated Time**: 3 days

#### Journey 1: New Landlord Onboarding
**File**: `tests/e2e/onboarding.spec.ts`

**Steps**:
1. Sign up / log in
2. Add first tenant
3. Record first rent payment
4. View dashboard
5. Verify data displays correctly

---

#### Journey 2: Monthly Rent Collection
**File**: `tests/e2e/rent-collection.spec.ts`

**Steps**:
1. View rent tracking page
2. Filter by "due" status
3. Mark payments as paid
4. Verify status updates
5. Check dashboard reflects changes

---

#### Journey 3: Maintenance Request Handling
**File**: `tests/e2e/maintenance-workflow.spec.ts`

**Steps**:
1. Create new maintenance request
2. AI categorizes automatically
3. Assign vendor
4. Update status to in-progress
5. Mark as completed
6. Verify in tenant detail view

---

#### Journey 4: Document Upload & AI Extraction
**File**: `tests/e2e/document-ai.spec.ts`

**Steps**:
1. Navigate to documents page
2. Upload PDF lease
3. Wait for AI extraction
4. Review extracted data
5. Create tenant from extracted data
6. Verify tenant details match extraction

---

### 4.3 Visual Regression Testing
**Priority**: P3
**Estimated Time**: 2 days

**Tool**: Storybook + Chromatic

**Steps**:
1. Install Storybook: `npx storybook@latest init`
2. Create stories for key components
3. Set up Chromatic for visual diffs
4. Capture baseline screenshots
5. Configure CI to run visual tests

**Components to Story**:
- StatCard
- TenantForm
- RentPaymentForm
- MaintenanceForm
- RentChart
- Dashboard overview

**Files to Create**:
- `.storybook/main.ts`
- `.storybook/preview.ts`
- `components/dashboard/stat-card.stories.tsx`
- `components/tenants/tenant-form.stories.tsx`
- `components/rent/rent-payment-form.stories.tsx`
- (etc.)

---

### 4.4 Accessibility Testing
**Priority**: P3
**Estimated Time**: 1 day

**Tool**: jest-axe + Playwright accessibility testing

**Steps**:
1. Install jest-axe: `npm install -D jest-axe`
2. Add axe tests to component tests
3. Run Playwright accessibility audits
4. Fix violations (WCAG AA standard)

**Example**:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should have no accessibility violations', async () => {
  const { container } = render(<TenantForm {...props} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

### 4.5 Performance Testing
**Priority**: P4
**Estimated Time**: 1 day

**Areas to Test**:
1. Server action response times
2. Component render performance
3. Database query optimization
4. Bundle size monitoring

**Tools**:
- Lighthouse CI
- Jest performance benchmarks
- React Profiler

**Files to Create**:
- `tests/performance/server-actions.bench.ts`
- `tests/performance/component-renders.bench.ts`
- `lighthouserc.js`

---

## Success Metrics

### Coverage Targets by Phase

| Phase | Target Coverage | Key Metrics |
|-------|----------------|-------------|
| Phase 1 | 25% | Component coverage tracking fixed, RentChart tested |
| Phase 2 | 50% | All pages & components tested, AI routes covered |
| Phase 3 | 60% | Integration tests for 4 workflows, data integrity verified |
| Phase 4 | 70% | E2E tests for critical journeys, accessibility compliance |

### Quality Gates

**Before Merging to Main**:
- ✅ All tests pass
- ✅ Coverage doesn't decrease
- ✅ No accessibility violations
- ✅ E2E tests pass for modified features

**Before Production Deploy**:
- ✅ Integration tests pass
- ✅ Visual regression approved
- ✅ Performance benchmarks within threshold
- ✅ Security tests pass (if applicable)

---

## Timeline Estimates

### Aggressive Timeline (Full-time focus)
- **Phase 1**: 1-2 days
- **Phase 2**: 5 days
- **Phase 3**: 4 days
- **Phase 4**: 5 days
- **Total**: ~3 weeks

### Realistic Timeline (Part-time, alongside other work)
- **Phase 1**: 1 week
- **Phase 2**: 2-3 weeks
- **Phase 3**: 2 weeks
- **Phase 4**: 2 weeks
- **Total**: 7-8 weeks

### Phased Rollout (Recommended)
- **Phase 1**: Week 1
- **Phase 2**: Weeks 2-4
- **Phase 3**: Weeks 5-6
- **Phase 4**: Weeks 7-8
- **Buffer**: Week 9 for bug fixes and refinement

---

## Quick Wins (If Time-Constrained)

If you can't complete the full roadmap, prioritize these high-impact tests:

1. **Fix component coverage** (Phase 1.1) - 2 hours
2. **Test AI API routes** (Phase 2.1) - 1 day
3. **Test page smoke tests** (Phase 2.2 minimal) - 1 day
4. **Test untested forms** (Phase 2.3 subset) - 2 days
5. **One E2E test for rent tracking** (Phase 4.2 subset) - 4 hours

**Total Quick Wins**: ~1 week for 40-50% coverage improvement

---

## Maintenance Plan

### After Completing Roadmap

**Weekly**:
- Review failed tests in CI
- Update snapshots if UI changes intentionally
- Check coverage reports for new code

**Monthly**:
- Review flaky tests
- Update test data fixtures
- Refactor brittle tests
- Check for outdated mocks

**Quarterly**:
- Audit test suite performance
- Remove obsolete tests
- Update testing dependencies
- Review and update this roadmap

---

## 🎓 Learning Resources

### Internal Resources
- **Example tests**: `app/actions/__tests__/tenants.test.ts` (well-structured reference)
- **Test helpers**: (to be created in Phase 1)
- **Mock patterns**: See any `__tests__` file for mocking examples
- **Documentation**:
  - `docs/testing-implementation.md` - Current test infrastructure
  - `docs/testing-best-practices.md` - Testing guidelines and patterns
  - `jest.config.js` - Jest configuration
  - `jest.setup.ts` - Test environment setup

### External Resources
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) by Kent C. Dodds
- [Storybook for React](https://storybook.js.org/docs/react/get-started/introduction)

---

## 📞 Getting Help

### Common Issues

**Issue**: `TextEncoder is not defined`
**Solution**: Already fixed in `jest.setup.ts`, ensure you're running latest config

**Issue**: `Request is not defined` in component tests
**Solution**: See [Testing Implementation](./testing-implementation.md) - Known Issues section

**Issue**: Component tests show 0% coverage
**Solution**: Known issue, tracked in Phase 1.1 of this roadmap

**Issue**: Tests pass locally but fail in CI
**Solution**: Ensure all mocks are properly scoped, check environment variables

**Issue**: Mock not working as expected
**Solution**: Check mock is defined before imports, use `jest.clearAllMocks()` in `beforeEach`

**Issue**: Async test timing out
**Solution**: Ensure you're using `async/await`, increase timeout if needed, check for unresolved promises

### Where to Ask Questions

1. **Check documentation first**:
   - This roadmap for planning questions
   - [Testing Best Practices](./testing-best-practices.md) for how-to questions
   - [Testing Implementation](./testing-implementation.md) for technical issues

2. **Review existing tests**:
   - Look for similar test patterns in `app/actions/__tests__/`
   - Check component tests in `components/**/__tests__/`

3. **Debug systematically**:
   - Read the full error message
   - Check stack trace for file and line number
   - Add `console.log` to understand what's happening
   - Isolate the failing test with `-t "test name"`

---

## Appendix: Test Checklist

Use this checklist to track progress:

### Phase 1: Foundation
- [ ] Fix component coverage tracking
- [ ] Un-mock RentChart
- [ ] Create test helpers and utilities
- [ ] Document test patterns

### Phase 2: Core Coverage
- [ ] Test AI API: categorize-maintenance
- [ ] Test AI API: extract-lease
- [ ] Test AI API: generate-reminder
- [ ] Test AI API: suggest-vendor
- [ ] Test API route: Documents download proxy
- [ ] Test server actions: Documents (storage path & cleanup)
- [ ] Test page: Dashboard
- [ ] Test page: Tenants
- [ ] Test page: Rent
- [ ] Test page: Maintenance
- [ ] Test page: Communications
- [ ] Test page: Documents
- [ ] Test page: Settings
- [ ] Test page: Tenant Detail
- [ ] Test page: Maintenance Detail
- [ ] Test component: MaintenanceForm
- [ ] Test component: MaintenancePage
- [ ] Test component: MaintenanceDetail
- [ ] Test component: AICategorization
- [ ] Test component: DocumentUpload
- [ ] Test component: DocumentsPage
- [ ] Test component: LeaseExtractor
- [ ] Test component: CommunicationForm
- [ ] Test component: CommunicationsPage
- [ ] Test component: DashboardOverview
- [ ] Test component: StatCard
- [ ] Test component: MaintenanceOverview
- [ ] Test component: UpcomingPayments
- [ ] Test component: RecentTenants
- [ ] Test component: PaymentReminderGenerator
- [ ] Test component: SettingsPage
- [ ] Test component: TenantDetail
- [ ] Test layout: DashboardLayout
- [ ] Test layout: Header
- [ ] Test layout: Sidebar

### Phase 3: Integration
- [ ] Set up test database
- [ ] Create integration test structure
- [ ] Test workflow: Tenant management
- [ ] Test workflow: Rent tracking
- [ ] Test workflow: Maintenance flow
- [ ] Test workflow: Document management (upload → proxy download → storage cleanup)
- [ ] Test data integrity

### Phase 4: E2E & Advanced
- [ ] Set up Playwright
- [ ] E2E test: Onboarding journey
- [ ] E2E test: Rent collection
- [ ] E2E test: Maintenance workflow
- [ ] E2E test: Document AI
- [ ] Set up Storybook
- [ ] Create component stories
- [ ] Set up Chromatic
- [ ] Add accessibility tests
- [ ] Set up performance testing

---

## 🎯 Summary & Next Steps

### What You Have Now
✅ **53 passing tests** covering critical server actions
✅ **Solid foundation** with Jest, RTL, and co-located test structure
✅ **Clear roadmap** to reach 60-70% coverage
✅ **Comprehensive documentation** for all testing needs

### What's Next

**Immediate Actions** (This Week):
1. Start with [Phase 1, Task 1.1](#11-fix-component-coverage-tracking) - Fix component coverage tracking (2-4 hours)
2. Work through Phase 1 tasks to establish solid foundation (1-2 days total)
3. Check off completed items in the [Test Checklist](#appendix-test-checklist)

**Short Term** (This Month):
1. Complete [Phase 2](#phase-2-core-application-coverage) - Test all application code (1 week)
2. Focus on AI API routes first - they're your competitive advantage
3. Track progress and adjust timeline as needed

**Long Term** (Next 2 Months):
1. Complete [Phase 3](#phase-3-integration-testing) and [Phase 4](#phase-4-e2e--advanced-testing)
2. Achieve 60-70% overall coverage
3. Set up CI/CD integration for automated testing

### Quick Reference

**To write a test**: See [Testing Best Practices](./testing-best-practices.md)
**Having issues**: Check [Getting Help](#getting-help) section above
**Need specifics**: Look at existing tests in `app/actions/__tests__/`
**Planning work**: Use the [Test Checklist](#appendix-test-checklist)

### Remember
- **Test behavior, not implementation**
- **Focus on critical paths first**
- **Keep tests simple and readable**
- **Don't chase 100% coverage** - focus on value

---

**Last Updated**: 2025-10-31
**Next Review**: After Phase 1 completion
**Maintained By**: Development Team
