# BlogNest – Blog Platform with Comments

> **Tagline:** “A simple space to write, read and share.”

BlogNest is a modern, full-stack blogging platform built for learning and task projects. It demonstrates how a React frontend, Node.js + Express backend, REST APIs, JWT authentication, and MongoDB database work seamlessly together.

---

## 📋 Features

### Core Blogging & User Interaction
* **User Authentication:** User registration, login, and secure password hashing using `bcryptjs` with JWT token-based session management.
* **CRUD Blog Posts:** Create, view, edit, and delete blog posts with ownership protection (users can only edit/delete their own posts).
* **Comment System:** Real-time post comments with a live 300-character counter, character remaining indicator, and immediate UI updates upon submission.
* **Topic Filtering:** Categorize and filter posts by predefined topics (`Technology`, `Education`, `Career`, `Lifestyle`, `Ideas`, `Other`).

### Unique & Student-Friendly Features
1. ⏱️ **Automatic Reading Time:** Automatically calculates estimated reading time (e.g. `3 min read`) based on word count algorithm.
2. 🔖 **Save for Later:** Bookmark and manage saved articles in a dedicated **Saved Posts** section persisted in MongoDB.
3. 📖 **Continue Reading:** Remembers recently viewed posts so users can easily pick up where they left off.
4. 👓 **Reading Mode:** A distraction-free, clean typography view with customizable spacing for comfortable reading.
5. 💬 **Friendly Empty States:** Helpful messaging for empty lists, comments, and saved posts.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), React Router v6, Tailwind CSS, Lucide Icons
* **Backend:** Node.js, Express.js, RESTful APIs, JSON Web Tokens (JWT)
* **Database:** MongoDB / Mongoose (supports local MongoDB or MongoMemoryServer zero-config fallback)
* **Authentication:** Bcryptjs password hashing + JWT middleware

---

## 📁 Project Structure

```
MyBlog/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection & fallback
│   │   ├── middleware/
│   │   │   └── authMiddleware.js# JWT verification middleware
│   │   ├── models/
│   │   │   ├── User.js          # User schema (password hash, savedPosts)
│   │   │   ├── Post.js          # Post schema (reading time calculation)
│   │   │   └── Comment.js       # Comment schema (max 300 chars)
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # Register, Login, Me endpoints
│   │   │   ├── postRoutes.js    # CRUD Post, Save toggle endpoints
│   │   │   ├── commentRoutes.js # Get & Create comments endpoints
│   │   │   └── userRoutes.js    # Saved & Recently viewed posts
│   │   ├── seed.js              # Database seed script
│   │   └── server.js            # Express app server entry point
│   ├── .env                     # Environment variables
│   ├── .env.example             # Example environment file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, PostCard, TopicFilter, CommentSection, etc.
│   │   ├── context/             # AuthContext state provider
│   │   ├── pages/               # HomePage, PostDetailPage, CreatePostPage, EditPostPage, etc.
│   │   ├── services/            # API fetch service layer
│   │   ├── App.jsx              # Routes setup & protected route guards
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .gitignore
├── package.json                 # Root script runner (concurrently)
└── README.md
```

---

## ⚙️ Prerequisites

* **Node.js** (v18 or higher)
* **npm** (v9 or higher)
* **MongoDB** (optional - if local `mongod` is running, it connects automatically; if not, an in-memory MongoDB server runs automatically for instant local setup).

---

## 🚀 Installation & Setup

### 1. Clone & Install Dependencies

From the root directory:

```bash
# Install root, backend, and frontend dependencies at once
npm run install:all
```

Or install manually:

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Variables

Create `.env` in the `backend/` directory (or copy from `.env.example`):

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/blognest
JWT_SECRET=blognest_super_secret_jwt_key_2026
```

### 3. Seed Sample Data (Optional but Recommended)

Populate sample users and blog posts:

```bash
cd backend
npm run seed
```

---

## 🏃 Running the Application

### Option A: Run Backend & Frontend Concurrently (Recommended)

From the root folder:

```bash
npm run dev
```

### Option B: Run Services Separately

**Backend:**
```bash
cd backend
npm run dev
```
*(Runs on `http://localhost:5001`)*

**Frontend:**
```bash
cd frontend
npm run dev
```
*(Runs on `http://localhost:3000`)*

Open your browser and navigate to `http://localhost:3000`.

---

## 🔌 API Endpoints Summary

### Authentication Routes (`/api/auth`)
* `POST /api/auth/register` — Register a new user (`name`, `email`, `password`)
* `POST /api/auth/login` — Login user & return JWT token (`email`, `password`)
* `GET /api/auth/me` — Get current logged-in user details (Protected)

### Blog Post Routes (`/api/posts`)
* `GET /api/posts` — Get all posts (supports `?topic=Technology` filter)
* `GET /api/posts/:id` — Get single post by ID
* `POST /api/posts` — Create a new post (Protected)
* `PUT /api/posts/:id` — Edit owned post (Protected, owner only)
* `DELETE /api/posts/:id` — Delete owned post (Protected, owner only)
* `POST /api/posts/:id/save` — Save/Bookmark or unsave post (Protected)

### Comments Routes (`/api/posts/:postId/comments`)
* `GET /api/posts/:postId/comments` — Fetch comments for a post
* `POST /api/posts/:postId/comments` — Add comment to a post (Protected, max 300 chars)

### User Routes (`/api/user`)
* `GET /api/user/saved-posts` — Fetch saved posts (Protected)
* `POST /api/user/recently-viewed/:postId` — Add post to recently viewed history (Protected)
* `GET /api/user/recently-viewed` — Get recently viewed posts (Protected)

---

## 🔐 Basic Authentication Explanation

1. **Password Security:** Passwords are never saved in plain text. Mongoose `pre('save')` hooks hash passwords using `bcryptjs` with 10 salt rounds.
2. **JWT Tokens:** Upon successful registration or login, the server issues a signed JWT token containing the user's ID.
3. **Frontend Storage:** The token is saved in browser `localStorage` and attached to outgoing API requests via the `Authorization: Bearer <token>` header.
4. **Authorization Middleware:** `authMiddleware.js` verifies the token on protected endpoints and ensures users can only edit/delete content they personally own.

---

## 🧪 Testing the Complete Application Flow

To verify all features, follow this step-by-step test flow in your browser:

1. **Register:** Click **Register** in the navbar, create an account (e.g. `Alex Johnson`, `alex@example.com`, `password123`).
2. **Login:** Verify you are automatically logged in and see **Hi, Alex** in the navigation bar.
3. **Create Blog Post:** Click **Create Post**, enter a title, choose a topic (e.g. `Technology`), write a multi-paragraph article, and click **Publish Post**.
4. **View Blog Post:** Notice that you are redirected to the post page with your author name, publication date, and topic badge.
5. **Automatic Reading Time:** Check the post card or header — reading time is automatically computed (e.g., `2 min read`).
6. **Save Post:** Click the **Bookmark** button. Navigate to **Saved Posts** from the navbar to confirm it appears under your saved collection.
7. **Add Comment:** Scroll to the comments section, type a comment while watching the character counter (`280 / 300`), and click **Post Comment**. Confirm the comment appears immediately.
8. **Use Reading Mode:** Click **Reading Mode** at the top of the article. Enjoy the distraction-free typography. Click **Exit Reading Mode** to return.
9. **Filter by Topic:** Go to Home page and click topic filters (e.g. `Technology`, `Career`) to filter articles.
10. **Edit Own Post:** Go to your post, click **Edit**, modify the title or text, and save changes.
11. **Continue Reading:** Go to Home page and observe your recently opened articles in the **Continue Reading** bar.
12. **Delete Own Post:** Open your post, click **Delete**, and confirm deletion.
13. **Logout & Relogin:** Click **Logout**, log back in, and verify your account data persists cleanly in the database!
