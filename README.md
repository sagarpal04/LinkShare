# 🌿 LinkShare — Your Links, One Page

A full-stack Linktree clone that lets users create a personalized public profile page hosting all their important links — built with a React frontend and an Express + MySQL backend.

---

## 🚀 Features

- 🔐 **JWT-based Authentication** — Secure register & login with hashed passwords
- 🔗 **Link Management** — Add and delete links from your personal dashboard
- 🌐 **Public Profile Pages** — Share your links via `/<username>` URL
- 📦 **Persistent Storage** — Links stored as JSON in a MySQL database via Sequelize
- ☁️ **Vercel Ready** — Backend configured for serverless deployment on Vercel

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Icon library |
| **Vite** | Build tool & dev server |
| **Vanilla CSS** | Styling (glassmorphism design) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework |
| **Sequelize** | ORM for MySQL |
| **MySQL2** | MySQL database driver |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT generation & verification |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin request handling |

### Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Backend serverless deployment |

---

## 📁 Project Structure

```
LinkTree/
├── backend/
│   ├── config/
│   │   └── db.js               # Sequelize MySQL connection
│   ├── middlewares/
│   │   └── authMiddleware.js   # JWT protect middleware
│   ├── models/
│   │   └── User.js             # User Sequelize model
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth — register & login
│   │   └── userRoutes.js       # /api/user — profile & links CRUD
│   ├── .env                    # Environment variables
│   ├── server.js               # Express app entry point
│   └── vercel.json             # Vercel deployment config
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx       # Login page
    │   │   ├── Register.jsx    # Registration page
    │   │   ├── Dashboard.jsx   # Authenticated link manager
    │   │   └── Profile.jsx     # Public profile view
    │   ├── api.js              # Axios instance & API functions
    │   ├── App.jsx             # Routes & app shell
    │   ├── index.css           # Global styles
    │   └── main.jsx            # React entry point
    ├── index.html
    └── vite.config.js
```

---

## 🗄️ Database Schema

### `Users` Table (MySQL via Sequelize)

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, Auto Increment | Unique user identifier |
| `username` | STRING | NOT NULL, UNIQUE | Public username used in profile URL |
| `email` | STRING | NOT NULL, UNIQUE | User's email address |
| `password` | STRING | NOT NULL | bcrypt-hashed password |
| `links` | JSON | DEFAULT `[]` | Array of link objects |
| `createdAt` | DATE | Auto | Sequelize timestamp |
| `updatedAt` | DATE | Auto | Sequelize timestamp |

### `links` JSON Column Structure

Each item inside the `links` JSON array follows this shape:

```json
{
  "_id": "uuid-v4-string",
  "title": "My Portfolio",
  "url": "https://example.com"
}
```

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |

**Register Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Auth Response:**
```json
{
  "_id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "token": "<jwt_token>"
}
```

---

### User Routes — `/api/user`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/user/me` | 🔒 Private | Get logged-in user's profile & links |
| `POST` | `/api/user/links` | 🔒 Private | Add a new link |
| `DELETE` | `/api/user/links/:linkId` | 🔒 Private | Delete a link by ID |
| `GET` | `/api/user/:username` | Public | Get public profile by username |

> 🔒 Private routes require `Authorization: Bearer <token>` header.

**Add Link Request Body:**
```json
{
  "title": "My GitHub",
  "url": "https://github.com/johndoe"
}
```

---

## ⚙️ How It Works

```
User visits /dashboard
     │
     ├── Not logged in? → Redirect to /login
     │
     └── Logged in (JWT in localStorage)?
           │
           ├── GET /api/user/me → Fetch user's links
           ├── POST /api/user/links → Add a new link
           └── DELETE /api/user/links/:id → Remove a link

User visits /:username (public profile)
     │
     └── GET /api/user/:username → Fetch username + links
           └── Render public page (no auth required)
```

### Authentication Flow

1. User registers → password hashed with **bcrypt** → stored in MySQL
2. User logs in → password compared with hash → **JWT** generated (expires in 30 days)
3. JWT stored in **localStorage** on the frontend
4. Every API request attaches JWT via `Authorization: Bearer <token>` header
5. `authMiddleware.js` verifies the token on protected routes → attaches `req.user`

---

## 🏁 Getting Started

### Prerequisites

- Node.js >= 18
- MySQL database (local or remote)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/linktree.git
cd linktree
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5001
DB_HOST=localhost
DB_NAME=linktree
DB_USER=root
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
node server.js
```

> Sequelize will automatically create and sync the `Users` table on startup using `sequelize.sync({ alter: true })`.

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder (optional — defaults to `localhost:5001`):

```env
VITE_API_URL=http://localhost:5001/api
```

Start the dev server:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## ☁️ Deployment

### Backend → Vercel

The backend includes a `vercel.json` that routes all traffic through `server.js` as a serverless function. Set your environment variables in the Vercel project dashboard.

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

### Frontend → Vercel / Netlify

Build the frontend and deploy the `dist/` folder:

```bash
cd frontend
npm run build
```

Set `VITE_API_URL` to your deployed backend URL in your hosting provider's environment settings.

---

