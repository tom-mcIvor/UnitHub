---
name: read-docs-first
description: Documentation workflow for UnitHub project. Use this skill whenever working on UnitHub code, implementing features, fixing bugs, or making changes. Always read relevant documentation before making code changes.
---

## Instructions
The `docs/` folder contains implementation guides and status updates for all features. Common files include:

- `project-vision.md` - Overall project goals and architecture
- `project-summary.md` - Current project status
- Feature-specific files (e.g., `ai-features.md`, `payment-integration.md`)
- Implementation guides (e.g., `complete-database-integration.md`)
- Testing guides (e.g., `testing-best-practices.md`)
1. Check if a relevant `.md` file exists in `docs/`
2. Read the file to understand current state
3. Make code changes
4. **Update the documentation** to reflect what was changed
5. Remove any outdated or redundant information from the docs


# UnitHub Documentation Workflow

## Core Rule: Read Docs First

Before writing or editing ANY code in the UnitHub project, ALWAYS:

1. **Identify relevant documentation** in the `docs/` folder
2. **Read the related markdown file(s)** to understand:
   - Current implementation status
   - Architecture decisions
   - Testing requirements
   - Known issues or considerations
3. **Then proceed** with code changes

## Documentation Files

## Workflow

### When Adding/Editing Features

1. Check if a relevant `.md` file exists in `docs/`
2. Read the file to understand current state
3. Make code changes
4. **Update the documentation** to reflect what was changed
5. Remove any outdated or redundant information from the docs

### When Starting New Features

1. Check `project-summary.md` for context
2. Read related feature docs
3. Implement the feature
4. Create or update the relevant documentation file
5. Keep docs concise - remove unnecessary details

### Documentation Maintenance

As you work:
- **Update docs immediately** when making changes
- **Remove redundant sections** that duplicate information
- **Keep information current** - delete outdated notes
- **Be concise** - docs should be helpful, not overwhelming

## Key Principle

Documentation should be a living reference that stays in sync with the codebase. Read before coding, update after coding, and keep it clean.
