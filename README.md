# UnitHub

A full-stack property management application designed for small-to-medium residential property managers overseeing 10-50 units. Built to bridge the gap between limited free tools and expensive enterprise solutions, UnitHub provides essential property management features enhanced with AI-powered automation.

## Purpose

UnitHub addresses the needs of property managers. The application streamlines daily operations including tenant management, rent tracking, maintenance coordination, document organization, and tenant communication.

## Core Features

**Tenant Management**
- Complete tenant database with lease terms and contact information
- Advanced search and filtering capabilities
- Detailed tenant profiles with payment history and maintenance requests

**Rent Tracking**
- Real-time payment status monitoring (paid, pending, overdue)
- Financial analytics with monthly income charts
- Payment history tracking and recording

**Maintenance System**
- Request submission and tracking workflow
- Priority-based categorization (urgent, high, medium, low)
- Vendor assignment and cost estimation
- Status management (pending, in-progress, completed)

**Document Management**
- Secure file storage for leases, inspection reports, and receipts
- Drag-and-drop upload functionality
- Document categorization and retrieval

**Communication Logs**
- Chronological record of all tenant interactions
- Support for multiple communication types (email, phone, in-person, messages)
- Searchable history with type-based filtering

**AI-Powered Automation**
- Automatic maintenance request categorization and priority detection
- Intelligent lease data extraction from PDF documents
- Cost estimation for maintenance requests
- Vendor matching based on request type
- Professional payment reminder generation

## Technology Stack

**Frontend**
- Next.js 16 with App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui component library (Radix UI primitives)
- React Hook Form with Zod validation

**Backend & Database**
- Supabase (PostgreSQL)
- Next.js Server Actions for type-safe server operations
- Row Level Security (RLS) for multi-tenant data isolation
- Supabase Storage for file management

**Authentication**
- Supabase Auth with email/password authentication
- Google OAuth integration
- Secure session management with middleware-based route protection

**AI Integration**
- Vercel AI SDK
- OpenAI API (GPT-4) for natural language processing and document analysis

**Testing & Quality**
- Jest with React Testing Library
- 303 comprehensive tests with 100% pass rate
- Test coverage across components, server actions, API routes, and pages
- GitHub Actions CI/CD pipeline for automated testing and linting

**Development Tools**
- ESLint for code quality
- TypeScript for type safety
- Recharts for data visualization

## Development Process & Learning

While I had prior experience with Next.js, this project significantly expanded my technical capabilities through several key areas:

**Supabase Mastery**
- Implemented PostgreSQL database schema with proper relationships and indexes
- Configured Row Level Security policies for secure multi-tenant architecture
- Integrated Supabase Auth with both traditional and OAuth flows
- Utilized Supabase Storage for file management

**Advanced Next.js Patterns**
- Leveraged Server Components and Server Actions for optimal performance
- Implemented proper client/server component boundaries
- Configured middleware for authentication and route protection
- Utilized Next.js caching and revalidation strategies

**AI-Assisted Development Workflow**
- Employed Claude Code for systematic feature development and code generation
- Used Gemini for alternative perspectives on complex problems
- Integrated Codex as a GitHub Action for automated code reviews on every commit
- Maintained comprehensive documentation throughout the development process
- Followed test-driven development practices with AI assistance
- Implemented proper git workflows and commit hygiene with AI-guided best practices

**Multi-Tenancy Architecture**
- Designed and implemented secure data isolation patterns
- Configured RLS policies to ensure users can only access their own data
- Tested multi-tenant scenarios thoroughly

**Testing Discipline**
- Wrote comprehensive test suites covering server actions, components, and API routes
- Achieved 100% test pass rate through iterative refinement
- Implemented mocking strategies for external services (Supabase, OpenAI)
- Set up continuous integration with GitHub Actions

**Full-Stack Integration**
- Connected frontend forms to backend server actions with type safety
- Implemented proper error handling and user feedback patterns
- Integrated third-party APIs (OpenAI) with Next.js API routes
- Managed environment variables and secrets securely

## Architecture Highlights

**Server-First Design**
- Server Components by default for optimal performance
- Client Components only where interactivity is required
- Server Actions for type-safe mutations

**Type Safety Throughout**
- TypeScript strict mode enabled
- Zod schemas for runtime validation
- Type inference from database to frontend

**Security Best Practices**
- Row Level Security at the database level
- Environment variable management
- Input validation on client and server
- Authentication checks in all server actions

**Testing Strategy**
- Unit tests for server actions
- Component tests with React Testing Library
- Integration tests for full workflows
- Mocked external dependencies for reliable tests

**Automated Code Quality**
- GitHub Actions workflow for continuous integration
- Automated code reviews via Codex on every push
- Linting and type checking in CI pipeline

## Project Status

The application is production-ready with all core MVP features implemented and tested. The codebase demonstrates modern full-stack development practices, comprehensive testing, AI integration capabilities, and professional development workflows including automated code review and continuous integration.
