# Professional Full-Stack & Mobile Engineer Portfolio

A production-grade, full-stack portfolio platform built with Next.js, Express, PostgreSQL, Prisma, Three.js, and Tailwind CSS using the **Warm Sunset & Dark Slate** palette.

---

## 🏗️ Architecture & Stack

### Backend (/backend)
- **Runtime:** Node.js (TypeScript) + Express.js
- **ORM & Database:** Prisma ORM connected to PostgreSQL (Neon / Supabase / Local)
- **Validation:** Zod schemas for parameters, request body, and query filters
- **Authentication:** JWT with Bearer tokens & role-based ADMIN guards
- **Security:** Express rate limiters, CORS configuration, honeypot spam protection, bcrypt password hashing (12 rounds)
- **Models:** User, Project, Skill, ProjectsOnSkills, Contact

### Frontend (/frontend)
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS with custom **Warm Sunset & Dark Slate** design tokens:
  - Base Dark Slate: #111113
  - Surface Gray: #18181b
  - Vibrant Fiery Orange: #FF5500
  - Gradient Accent: #FF6B35 to #A32A17
- **3D Graphics & Animations:**
  - Interactive **Three.js** 3D Particle Constellation with responsive cursor tracking & breathing core
  - **Framer Motion** smooth reveals, card hovers, and page transitions
- **State & Data Fetching:** TanStack Query (React Query)
- **CMS Admin:** Secured dashboard (/admin) for managing Projects, Skills, and Contact Inquiries

---

## 🚀 Quickstart

### 1. Database Setup & Seeding (Backend)
`bash
cd backend

# Configure your PostgreSQL connection in .env
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_db?schema=public

# Run migrations and generate Prisma Client
npx prisma migrate dev --name init

# Seed database with starter data and admin credentials
npm run db:seed

# Start backend development server
npm run dev
# Running on http://localhost:5000
`

### 2. Frontend Development Server
cd frontend

# Verify .env.local points to your backend (default: http://localhost:5000/api)
npm run dev
# Running on http://localhost:3000
`

---

## 🔑 Default Seeded Admin Credentials

- **Email:** ******************************
- **Password:** ******************
- **Login URL:** http://localhost:3000/admin/login

---

## 📡 API Endpoints Reference

### Public Routes
- GET /api/profile - Public portfolio owner profile
- GET /api/projects - List all projects (supports ?featured=true, ?search=..., ?skill=...)
- GET /api/projects/:identifier - Get project by ID or slug
- GET /api/skills - List all skills grouped by category
- POST /api/contacts - Rate-limited contact submission (includes honeypot spam verification)

### Admin Routes (Bearer JWT Required)
- POST /api/auth/login - Admin login
- GET /api/auth/me - Authenticated session check
- PUT /api/profile - Update profile bio, avatar, and password
- POST /api/projects - Create project with skill associations
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project
- POST /api/skills - Create skill
- PUT /api/skills/:id - Update skill
- DELETE /api/skills/:id - Delete skill
- GET /api/contacts - List contact submissions
- PATCH /api/contacts/:id/status - Mark contact as READ, ARCHIVED, SPAM
- DELETE /api/contacts/:id - Delete contact entry
