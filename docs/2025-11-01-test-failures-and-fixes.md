# Test Failures and Fixes (2025-11-01)

## Implemented Changes

*   Updated the `documentMetadataSchema` to include `insurance` as a valid type for the `type` field. This fixed the failing tests for the `createDocument` action.

## Existing Problems

The test suite is still failing with multiple errors. The most pressing issues are:

*   **`app/actions/__tests__/tenants.test.ts` is failing:** The test suite for the tenants actions is failing to run due to a syntax error in `app/actions/tenants.ts`.
*   **`ReferenceError: Response is not defined`:** This error is occurring in multiple API route tests.
*   **`invariant expected app router to be mounted`:** This error is occurring in the `components/maintenance/__tests__/maintenance-form.test.tsx` test.
*   **`TypeError: Cannot redefine property: createMaintenanceRequest`:** This error is occurring in the `components/maintenance/__tests__/maintenance-form.test.tsx` test.

## Suggested Solutions

*   **`app/actions/tenants.ts` syntax error:** The syntax error in `app/actions/tenants.ts` needs to be identified and fixed. The error message "Return statement is not allowed here" suggests that there is a `return` statement outside of a function.
*   **`ReferenceError: Response is not defined`:** This error is likely caused by the test environment not having access to the `Response` object. This can be fixed by importing `Response` from `next/server` in the test files.
*   **`invariant expected app router to be mounted`:** This error is likely caused by the test environment not being set up to handle the Next.js App Router. This can be fixed by mocking the `useRouter` hook from `next/navigation`.
*   **`TypeError: Cannot redefine property: createMaintenanceRequest`:** This error is likely caused by a conflict in the test setup where `createMaintenanceRequest` is being mocked multiple times.

## What I Tried

*   I attempted to fix the `tenants` tests by modifying the `createTenant` and `updateTenant` actions to handle missing `rentAmount` and `depositAmount` fields. This caused the test runner to crash.
*   I attempted to fix the `tenants` tests by modifying the test case to provide valid data for the missing fields. This also caused the test runner to crash.

## Next Steps

1.  Fix the syntax error in `app/actions/tenants.ts`.
2.  Fix the `ReferenceError: Response is not defined` error in the API route tests.
3.  Fix the `invariant expected app router to be mounted` error in the `maintenance-form` test.
4.  Fix the `TypeError: Cannot redefine property: createMaintenanceRequest` error in the `maintenance-form` test.
5.  Rerun the tests to verify that all tests pass.
6.  Proceed with the git commit and push as requested by the user.
