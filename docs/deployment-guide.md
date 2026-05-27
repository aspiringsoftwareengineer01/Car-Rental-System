# Production Deployment Guide 🚀

This document provides step-by-step instructions for preparing, building, and deploying the Car Rental System to production environments.

---

## 🎨 Front-End Deployment (Vercel / Netlify)

Vite React applications are static sites, making them ideal for serverless edge deployments.

### 1. Build Verification
Before deploying, always execute local builds to check for TypeScript errors or misaligned bundler hooks:
```bash
cd frontend
npm run build
```
This generates optimized assets inside `frontend/dist`.

### 2. Configuration for Single-Page Apps (SPA)
Because React Router controls URL locations in the browser, configure route redirects to avoid `404 Not Found` errors when reloading.

- **Vercel**: Add `vercel.json` in the frontend root:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

- **Netlify**: Create a `_redirects` file in the `public` directory:
  ```text
  /*    /index.html   200
  ```

---

## ⚙️ Back-End API Deployment (Render / Heroku)

Deploy the Node.js Express server to a hosting provider that handles continuous processes.

### 1. Environment Variables Configuration
Ensure variables are loaded from safe vault profiles:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://db_user:password@hostname:5432/dbname
JWT_SECRET=your_long_production_cryptographic_key_here
STRIPE_SECRET_KEY=sk_live_...
```

### 2. Procfile Setup (for Heroku)
Create a `Procfile` at the root of the backend folder:
```text
web: node src/server.js
```

---

## 💾 Database Hosting (Supabase / Neon / MongoDB Atlas)

### 1. Relational Database (PostgreSQL via Neon / Supabase)
- Set up a managed PostgreSQL cluster on **Supabase** or **Neon**.
- Enable SSL parameters in connection strings (`?sslmode=require`).
- Run initial database migration scripts:
  ```bash
  psql -d $DATABASE_URL -f database/schema.sql
  ```

### 2. Document Database (MongoDB Atlas)
- Create a cluster on **MongoDB Atlas**.
- Whitelist the backend hosting IP range (or allow `0.0.0.0/0` with high-complexity database passwords).
- Ensure indexes (`email_1`, `booking_car_dates`) are created on boot.

---

## 🔒 Production Security Checklist

- [ ] Ensure all domain API requests are processed exclusively over HTTPS.
- [ ] Configure `helmet` Express middleware to set secure HTTP headers.
- [ ] Enable CORS rules restricting incoming origins exclusively to your verified client domain.
- [ ] Implement JWT expiry (e.g. 1 hour) with secure Refresh Token cookies.
- [ ] Set database read-write credentials with minimum necessary privilege levels.
