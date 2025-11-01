# UnitHub Documentation

Welcome to the UnitHub documentation. This directory contains all project documentation organized by topic.

---

## 🧪 Testing Documentation

**Start here:** [`testing-roadmap.md`](./testing-roadmap.md) ⭐

The testing roadmap is your complete testing guide containing:
- 📊 Current test coverage status
- 🎯 Quick start guides
- 🏃 How to run tests
- 📚 Related documentation index
- 📋 4-phase implementation plan
- 🎓 Learning resources
- 📞 Troubleshooting help
- ✅ Complete test checklist

### Other Testing Docs

**Core Guides:**
- **[Testing Best Practices](./testing-best-practices.md)** - Patterns and guidelines for writing tests
- **[Testing Implementation](./testing-implementation.md)** - Technical setup details and known issues

**Recent Test Expansion Sessions:**
- **[Maintenance Server Action Edge Cases (2025-11-01)](./test-expansion-2025-11-01-maintenance-server-actions.md)** - Maintenance actions 100% lines, overall coverage 58.59%
- **[Communications Server Action Edge Cases (2025-11-01)](./test-expansion-2025-11-01-communications-server-actions.md)** - Full error coverage, overall coverage 57.62%
- **[Tenants Server Action Edge Cases (2025-11-01)](./test-expansion-2025-11-01-tenants-server-actions.md)** - Align tenants actions with per-test mocks, coverage 56.84%
- **[Documents Server Action Edge Cases (2025-11-01)](./test-expansion-2025-11-01-documents-server-actions.md)** - Supabase failure paths, storage cleanup, header test stabilisation
- **[Server Action Edge Cases (2025-11-01)](./test-expansion-2025-11-01-server-actions.md)** - Rent actions 57.5% → 100%, overall coverage 55.05%
- **[Coverage Push Session (2025-11-01)](./test-expansion-2025-11-01-coverage-push.md)** - Layouts, dynamic pages, API routes, UI primitives (+36 tests, 53.6% coverage)
- **[Documents Workflow Expansion](./test-expansion-documents-workflow.md)** - Document upload, forms, detail views, lease extraction
- **[Session 2 (2025-11-01)](./test-expansion-session-2-2025-11-01.md)** - Settings, communications, maintenance page tests
- **[Session 1 (2025-11-01)](./test-expansion-2025-11-01.md)** - Layout components, theme provider, rent charts

**Historical Issues (Resolved):**
- **[Test Fixes and Payment Status](./test-fixes-and-payment-status.md)** - Syntax errors, API compatibility, validation fixes
- **[Test Memory Optimization](./test-memory-optimization.md)** - Memory configuration and heap size setup

---

## 📋 Project Planning

- **[Project Vision](./project-vision.md)** - Overall project goals and target market
- **[Project Summary](./project-summary.md)** - What has been built so far
- **[AI Features](./ai-features.md)** - AI-powered features and implementation plans

---

## 🔧 Integration & Setup

- **[Supabase Integration Status](./supabase-integration-status.md)** - Database setup progress
- **[Tenant Database Integration](./tenant-database-integration.md)** - Tenant module integration
- **[Complete Database Integration](./complete-database-integration.md)** - Full database integration details
- **[GitHub Actions CI/CD](./github-actions-ci.md)** - Automated testing and code review workflows

---

## 💰 Features

- **[Payment Integration](./payment-integration.md)** - Bank payment tracking plans (Phase 2 stretch goal)

---

## 🛠️ Development Logs

- **[Communications CRUD Update](./communications-crud-update.md)**
- **[Document Edit Metadata](./document-edit-metadata.md)**
- **[Edit Delete UI Implementation](./edit-delete-ui-implementation.md)**
- **[Error Handling Lint Cleanup](./error-handling-lint-cleanup.md)**
- **[Logging Lint Followup](./logging-lint-followup.md)**

---

## 📖 How to Use This Documentation

### For New Contributors
1. Read [Project Vision](./project-vision.md) to understand the product
2. Review [Project Summary](./project-summary.md) to see what's built
3. Check [Testing Roadmap](./testing-roadmap.md) before writing code
4. Follow [Testing Best Practices](./testing-best-practices.md) when writing tests

### For Testing
1. **Start**: [Testing Roadmap](./testing-roadmap.md)
2. **Writing tests**: [Testing Best Practices](./testing-best-practices.md)
3. **Debugging**: [Testing Implementation](./testing-implementation.md)

### For Feature Development
1. Check if feature is in [Project Vision](./project-vision.md) or [AI Features](./ai-features.md)
2. Review relevant integration docs
3. Write tests following the testing docs
4. Document changes in appropriate log files

---

**Last Updated**: 2025-11-01 (Maintenance server action edge cases)
