read the docs
> ⚠️ **IMPORTANT**: Always read relevant documentation before starting any task.

# UnitHub Project Key Points

## Overview

- **Project Name:** UnitHub
- **Purpose:** A comprehensive property management application designed for small-to-medium landlords managing 10-50 units.
- **Goal:** To provide a solution that is more powerful than free tools but simpler and more affordable than enterprise software, with a key differentiator in AI-powered automation.

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Forms:** React Hook Form with Zod for validation
- **Charts:** Recharts

### Backend & Database
- **Database:** PostgreSQL (designed for Supabase integration)
- **Backend Logic:** Server-side logic is handled by Next.js (App Router).

### AI & Integrations
- **AI Provider:** OpenAI API (GPT-4)
- **AI SDK:** Vercel AI SDK
- **Payments:** Stripe integration is planned for subscription management.

## Core Features

- **Tenant Management:** Full CRUD operations for tenant profiles, including lease terms, contact info, and payment history.
- **Rent Tracking:** Dashboard to monitor payment statuses (paid, pending, overdue), view income charts, and record payments.
- **Maintenance Requests:** System for tenants to submit requests and for landlords to track status, assign vendors, and manage costs.
- **Document Management:** Upload, store, and organize documents like leases and inspection reports.
- **Communication Log:** A timeline view of all interactions with tenants.
- **AI-Powered Features:**
    - **Lease Extraction:** Automatically pulls key data from uploaded lease PDFs.
    - **Maintenance Intelligence:** Auto-categorizes maintenance requests, detects priority, and estimates costs.
    - **Payment Reminders:** Generates professional communication for overdue rent.
