# Test Suite Memory Optimization

**Date**: 2025-10-31
**Updated**: 2025-11-01
**Status**: ✅ Resolved - 137 tests passing without memory overflow

---

## Problem

Test suite crashed with `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory` when running all tests. Error occurred after `tenant-form.test.tsx` completed, indicating heap exhaustion during parallel test execution.

---

## Root Cause

- Jest default configuration runs tests in parallel using multiple worker processes
- Node.js default heap size (typically 2GB) insufficient for 108 tests across 23 suites
- Recursive error handlers in Next.js unhandled rejection hooks compounded memory pressure

---

## Solution Implemented

Modified `package.json` test scripts to configure Node heap size and Jest worker count:

```json
"test": "NODE_OPTIONS=--max-old-space-size=4096 jest --maxWorkers=2",
"test:watch": "NODE_OPTIONS=--max-old-space-size=4096 jest --watch --maxWorkers=2",
"test:coverage": "NODE_OPTIONS=--max-old-space-size=4096 jest --coverage --maxWorkers=2"
```

**Changes**:
- `NODE_OPTIONS=--max-old-space-size=4096`: Increases Node heap to 4GB
- `--maxWorkers=2`: Limits Jest to 2 parallel workers (default is CPU cores - 1)

**Location**: `package.json:10-12`

---

## Results

Before fix:
```
FATAL ERROR: Reached heap limit Allocation failed
Exit code 134
```

After fix:
```
Test Suites: 31 passed, 31 total
Tests:       137 passed, 137 total (136 passing as of 2025-11-01)
Time:        ~10 s
```

---

## Related Issues Fixed

While resolving memory issues, also fixed test failures unrelated to memory:

1. **Request is not defined** in component tests - mocked form components
2. **`.rejects.toThrowError()` errors** - changed to `.rejects.toThrow()`
3. **Missing `getTenants` mock** in maintenance page test

See `docs/page-route-testing-progress.md` for details.

---

## Trade-offs

**Positives**:
- Tests complete successfully without crashes
- Predictable resource usage
- Faster overall execution (6.7s vs. potential timeout/crash)

**Negatives**:
- Reduced parallelism (2 workers vs. ~7 on 8-core CPU)
- Increased heap size uses more system memory
- CI environments may need memory configuration

---

## Alternative Approaches Not Taken

1. **Split test suites** - Could run component/action/page tests separately, but adds complexity
2. **Increase heap without limiting workers** - Tried, still crashed on some runs
3. **Use `--runInBand`** - Runs tests serially (slower), but memory-safe fallback option

---

## Next Steps

1. Monitor memory usage as test count grows (currently 137 tests across 31 suites)
2. Consider splitting test suites if count exceeds 200-300 tests
3. Configure CI runner memory limits to match local environment (4GB heap + overhead)
4. See [test-fixes-and-payment-status.md](./test-fixes-and-payment-status.md) for latest test fixes

---

## Files Modified

- `package.json` - Updated test scripts with `NODE_OPTIONS` and `--maxWorkers`
