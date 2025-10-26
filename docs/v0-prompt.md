# V0 Prompt for UnitHub

This is the prompt to use with V0 (Vercel's AI-powered UI generation tool) to create the UnitHub application.

---

**Create a property management app called "UnitHub" for small-to-medium property managers (10-50 units). Build with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.**

**Core Features:**

1. **Tenant Management Dashboard**
   - List view of all tenants with search/filter
   - Tenant detail pages showing: lease terms, contact info, rent payment history, maintenance requests, communication log
   - Add/edit tenant forms with validation (Zod + React Hook Form)

2. **Rent Tracking**
   - Monthly rent payment tracker with status indicators (paid, pending, overdue)
   - Payment reminders system with automated notifications
   - Simple accounting view: income vs expenses, owner statements

3. **Maintenance Request System**
   - Tenant submission form (description, photos, priority)
   - Request list with filters (status, priority, category)
   - Request detail view with status updates, cost tracking, assigned vendor
   - AI-powered features: auto-categorization, priority detection (urgent/high/medium/low), cost estimation, vendor matching suggestions

4. **Document Storage**
   - Upload and organize leases, inspection reports, photos
   - Document viewer with download capability
   - Smart lease extraction: upload PDF lease and auto-extract tenant names, dates, rent amount, deposit, pet policy, etc. with confidence scores and one-click import

5. **Communication Log**
   - Timeline of all tenant interactions
   - Quick message interface
   - Searchable history

**Design Requirements:**
- Clean, professional dashboard layout
- Mobile-responsive design
- Data tables with sorting, filtering, pagination
- Forms with proper validation and error handling
- File upload components with drag-and-drop
- Status badges and priority indicators with color coding
- Sidebar navigation with icons

**Technical Requirements:**
- Use shadcn/ui components throughout
- Implement proper TypeScript types
- Use Zod schemas for form validation
- React Hook Form for all forms
- Include placeholder for Supabase integration (auth, database, file storage)
- Include placeholder for OpenAI API integration for AI features
- Include placeholder for Stripe subscription management

**Start with the main dashboard showing tenant overview, recent maintenance requests, and upcoming rent payments.**

---

## Usage Instructions

1. Go to [v0.dev](https://v0.dev)
2. Copy the prompt above (from "Create a property management app..." to "...upcoming rent payments.")
3. Paste it into V0's chat interface
4. Iterate on the generated components as needed
5. Export the code and integrate into your Next.js project
