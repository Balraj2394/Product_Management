# Product Management System

A full-stack CRUD application for managing products, built with **React + TypeScript** (frontend), **Node.js + Express + TypeScript** (backend), and **PostgreSQL** (database).

## Features

- **Product List** — Sortable table with search, pagination, and stock badges
- **Add / Edit Products** — Form validation, loading states, error handling
- **Delete Confirmation** — Modal dialog before destructive actions
- **Debounced Search** — 300ms debounce for responsive filtering
- **Optimistic UI** — Instant feedback on delete with rollback on failure
- **Dark Theme** — Premium glassmorphism design with smooth animations

---

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 (running)
- **npm** ≥ 9

## Setup

### 1. Database

Create a PostgreSQL database:

```sql
CREATE DATABASE product_management;
```

The `products` table will be created automatically when the backend starts.

### 2. Backend

```bash
cd backend
npm install
```

Edit `.env` with your PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=product_management
PORT=5000
```

Start the dev server:

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/api/products`    | List (paginated, search) |
| GET    | `/api/products/:id`| Get single product       |
| POST   | `/api/products`    | Create product           |
| PUT    | `/api/products/:id`| Update product           |
| DELETE | `/api/products/:id`| Delete product           |

**Query Parameters** (GET `/api/products`):
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10, max: 100)
- `search` — Search by name (ILIKE)
- `sortBy` — Column to sort by: `name`, `price`, `stock`, `created_at`
- `sortOrder` — `ASC` or `DESC`

---

## Project Structure

```
Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   └── productController.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   └── validate.ts
│   │   ├── routes/
│   │   │   └── productRoutes.ts
│   │   └── index.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.tsx / .css
│   │   │   ├── ProductForm.tsx / .css
│   │   │   ├── ProductList.tsx / .css
│   │   │   └── Toast.tsx / .css
│   │   ├── hooks/
│   │   │   └── useDebounce.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── product.ts
│   │   ├── App.tsx / .css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```
