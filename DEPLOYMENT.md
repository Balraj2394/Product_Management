# 🚀 Deployment Guide

Deploy the Product Management System for **free** using Neon (database), Render (backend), and Vercel (frontend).

## Prerequisites

- A GitHub account (to push your code)
- Free accounts on [Neon](https://neon.tech), [Render](https://render.com), and [Vercel](https://vercel.com)

---

## Step 1: Push Code to GitHub

```bash
cd Project
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/product-management.git
git push -u origin main
```

---

## Step 2: Set Up Neon (PostgreSQL Database)

1. Go to [neon.tech](https://neon.tech) and sign up / log in
2. Click **"New Project"** → give it a name (e.g., `product-management`)
3. Copy the **connection string** — it looks like:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. Save this — you'll need it for Render

---

## Step 3: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up / log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure the service:
   | Setting | Value |
   |---------|-------|
   | **Name** | `product-management-api` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |
   | **Plan** | `Free` |
5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | *(paste your Neon connection string)* |
   | `FRONTEND_URL` | *(add after Vercel deploy, e.g., `https://your-app.vercel.app`)* |
   | `NODE_ENV` | `production` |
6. Click **"Create Web Service"**
7. Wait for the build to complete — note the URL (e.g., `https://product-management-api-xxxx.onrender.com`)

---

## Step 4: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / log in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repo
4. Configure the project:
   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `frontend` |
   | **Framework Preset** | `Vite` |
5. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-render-url.onrender.com/api` |
6. Click **"Deploy"**
7. Note the deployed URL (e.g., `https://your-app.vercel.app`)

---

## Step 5: Update CORS on Render

1. Go back to your Render dashboard
2. Open your backend service → **Environment**
3. Set `FRONTEND_URL` to your Vercel URL (e.g., `https://your-app.vercel.app`)
4. Click **Save** — Render will auto-redeploy

---

## ✅ Done!

Your app is now live at your Vercel URL. Test it by creating, editing, and deleting products.

### Useful Links
| Service | Dashboard |
|---------|-----------|
| Database | [neon.tech/console](https://console.neon.tech) |
| Backend | [dashboard.render.com](https://dashboard.render.com) |
| Frontend | [vercel.com/dashboard](https://vercel.com/dashboard) |

> **Note:** Render free tier spins down after 15 minutes of inactivity. The first request after idle may take ~30 seconds.
