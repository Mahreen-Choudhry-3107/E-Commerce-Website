<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react" alt="React 18">
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite" alt="Vite 5">
  <img src="https://img.shields.io/badge/Express-4.18-000000?logo=express" alt="Express 4">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs" alt="Node 18+">
</p>

<h1 align="center">🛒 EasyCart</h1>

<p align="center">
  A modern, full-stack e-commerce web application with a rich product catalog, session-based cart management, and smooth scroll-triggered page animations — all powered by React and Express.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#license">License</a>
</p>

---

## ✨ Features

| Area | Highlights |
|------|------------|
| **Home Page** | Hero slideshow with auto-rotate, stats counter bar, category cards, featured & trending products, testimonials carousel, brand strip, newsletter CTA |
| **Shop** | Full product grid with live search and category filtering (Electronics, Clothing, Accessories, Home) |
| **Cart** | Session-persistent cart with quantity controls, live totals, and server sync |
| **Checkout** | Shipping form with order summary; places orders with unique IDs |
| **Animations** | IntersectionObserver-triggered fade/slide/scale animations on all sections |
| **Responsive** | Fully responsive design using CSS Grid, Flexbox, and custom properties |
| **Backend** | RESTful API with product, cart, and order endpoints; in-memory persistence |

---

## 🧰 Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **React Router 6** for client-side routing
- **Vite 5** for fast development and optimized builds
- **CSS3** with custom properties, Grid, Flexbox, and keyframe animations

### Backend
- **Node.js** runtime
- **Express 4** REST API
- **CORS** for cross-origin requests
- **UUID** for order ID generation
- **JSON file** as product data store

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Mahreen-Choudhry-3107/E-Commerce-Website.git
cd E-Commerce-Website

# Install all dependencies (root, server, and client)
npm run install:all

# Install root-level dev dependencies (concurrently)
npm install
```

### Running Locally

Start both the API server and the React dev server with a single command:

```bash
npm run dev
```

This runs:
- **Server** on `http://localhost:5000` (Express API)
- **Client** on `http://localhost:3000` (Vite dev server, proxies `/api` to the server)

Or run them individually:

```bash
npm run dev:server   # Server only
npm run dev:client   # Client only
```

### Building for Production

```bash
npm run build
```

Output is written to `client/dist/`.

---

## 📁 Project Structure

```
easycart/
├── client/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Sticky nav, search bar, cart badge
│   │   │   ├── Footer.jsx       # Site footer with links
│   │   │   └── ProductCard.jsx  # Product card with hover overlay
│   │   ├── context/
│   │   │   └── CartContext.jsx   # Cart state (useReducer + API sync)
│   │   ├── pages/
│   │   │   ├── Home.jsx         # 10-section landing page
│   │   │   ├── Shop.jsx         # Product catalog + filters
│   │   │   ├── Cart.jsx         # Shopping cart
│   │   │   └── Checkout.jsx     # Order checkout form
│   │   ├── App.jsx              # Route definitions
│   │   ├── App.css              # Global styles & animations
│   │   └── main.jsx             # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                      # Express backend
│   ├── data/
│   │   └── products.json        # 20 products across 4 categories
│   ├── routes/
│   │   ├── products.js          # GET /api/products, GET /api/products/:id
│   │   ├── cart.js              # CRUD /api/cart/:sessionId
│   │   └── orders.js            # POST/GET /api/orders
│   ├── index.js                 # Express entry point
│   └── package.json
├── package.json                 # Root scripts (dev, build, install:all)
└── .gitignore
```

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Products

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| `GET` | `/products` | List all products | `?category=Electronics`, `?search=headphones` |
| `GET` | `/products/:id` | Get single product | — |

### Cart

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `GET` | `/cart/:sessionId` | Get cart items | — |
| `POST` | `/cart/:sessionId` | Add item to cart | `{ "productId": "p1", "quantity": 2 }` |
| `PUT` | `/cart/:sessionId/:productId` | Update quantity | `{ "quantity": 3 }` |
| `DELETE` | `/cart/:sessionId/:productId` | Remove item | — |

### Orders

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/orders` | Place an order | `{ "items": [...], "customer": {...} }` |
| `GET` | `/orders` | List all orders | — |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |

---

## 🎨 Page Animations

All major sections use **IntersectionObserver** (threshold 0.12, rootMargin -40px) to trigger CSS keyframe animations on scroll:

- `fadeInUp` / `fadeInDown` — fade and slide
- `slideInLeft` / `slideInRight` — horizontal entry
- `scaleIn` — zoom-in effect
- `countUp` — numeric counter animation (stats bar)
- `heroZoom` — background zoom on hero slides
- `float` / `pulse` — subtle hover/attention effects

Each section receives a staggered `animation-delay` via inline style for a cascading reveal.

---

## 🗂️ Product Data

The catalog contains **20 products** across 4 categories:

| Category | Count |
|----------|-------|
| Electronics | 5 |
| Clothing | 5 |
| Accessories | 5 |
| Home | 5 |

Products are stored in `server/data/products.json` and include fields for `id`, `name`, `description`, `price`, `image` (Unsplash), `category`, `rating`, and `stock`.

---

## 🚢 Deployment

The client build output (`client/dist/`) is a static site that can be served by any hosting provider (Vercel, Netlify, Render). The Express server should be deployed separately to a Node.js platform (Render, Railway, Fly.io).

**Important:** Update the Vite proxy config or set the API base URL to your deployed server's URL before building for production.

---

## 📄 License

© 2026 Mahreen Choudhry. All Rights Reserved.
