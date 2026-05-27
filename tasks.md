# Project Roadmap & Tasks 🗺️

Track the development progress of the Car Rental System. Use this document to keep track of tasks across frontend, backend, database, and documentation.

## 🚀 Active Checklist

- [x] Initial Project Setup
  - [x] Scaffold Vite + React frontend application
  - [x] Create project directory structure & core markdown files
  - [x] Set up Vite development server and verify localhost
- [/] Documentation & Specifications
  - [x] Define relational Database Schema (`database-schema.md`)
  - [x] Define API Specs (`api-docs.md`)
  - [x] Outline UI/UX Design tokens and palettes (`ui-design.md`)
  - [x] Define technical system architecture (`project-architecture.md`)
  - [ ] Add screenshots directory placeholders
- [ ] Database Implementation
  - [ ] Write PostgreSQL initialization scripts / MongoDB schemas
  - [ ] Set up seed data for cars, locations, and users
  - [ ] Test database connection pools and queries
- [ ] Backend API Development
  - [ ] Express server boilerplate with custom logger
  - [ ] User authentication routes (JWT, password hashing)
  - [ ] Car listings API (Filters: price, type, availability)
  - [ ] Booking system API (Date overlapping prevention logic)
  - [ ] User reviews & ratings API
- [ ] Frontend Implementation (Premium UI)
  - [ ] Setup HSL CSS variables and baseline typography in `index.css`
  - [ ] Build glassmorphic Layout Components (Navbar, Footer, Sidebar)
  - [ ] Implement Dashboard with responsive filters and sorting
  - [ ] Integrate Booking flow with animated interactive calendar
  - [ ] Create User Profile page & Booking History cards
- [ ] Integration & Testing
  - [ ] Connect React frontend with backend API using custom hooks
  - [ ] Implement state management (React Context / Zustand)
  - [ ] Run automated API validation and unit tests
- [ ] Deployment & DevOps
  - [ ] Set up CI/CD pipeline (e.g. GitHub Actions)
  - [ ] Deploy Frontend to Vercel/Netlify
  - [ ] Deploy Backend to Render/Heroku and Database to Neon/Supabase

---

## 📅 Version Release Milestones

### v0.1.0 - Core Foundation (In Progress)
Focuses on scaffolding, database design, architecture, and project structure documentation.

### v0.2.0 - Core API & Auth
Focuses on securing user endpoints, database seeding, and working authentication.

### v0.3.0 - Booking Flow
Enables car listing visualization, interactive filtering, and basic booking capabilities.

### v1.0.0 - Premium Release
Complete end-to-end integration, custom glassmorphism styles, fine-grained micro-animations, and live staging deployment.
