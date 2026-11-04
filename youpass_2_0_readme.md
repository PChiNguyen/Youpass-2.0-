# YouPass 2.0 🚀

YouPass 2.0 is a modern, high-performance full-stack web application designed for interactive practice testing, exam preparation, and performance tracking. Built with a clean **Monorepo** architecture, it pairs a robust Python/FastAPI backend with a lightning-fast Next.js frontend.

---

## 🛠️ Tech Stack

### Backend
* **Framework:** FastAPI (Python)
* **Database & ORM:** PostgreSQL (Neon), Alembic
* **Authentication:** JWT (JSON Web Tokens)
* **Containerization & CI/CD:** Docker, GitHub Actions

### Frontend
* **Framework:** Next.js 15+ (App Router)
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Icons:** Lucide React
* **Language:** TypeScript

---

## 📁 Project Structure

This project follows a clean **Monorepo** structure, keeping both the API and the user interface synchronized in a single repository:

```text
Youpass 2.0/
├── backend/           # FastAPI backend application
│   ├── api/           # API routers and endpoints
│   ├── core/          # Security, config, and core utilities
│   ├── db/            # Database session and connection setup
│   ├── alembic/       # Database migrations
│   └── schemas/       # Pydantic data validation schemas
│
├── frontend/          # Next.js frontend application
│   ├── app/           # App Router pages and components
│   │   ├── store/     # Zustand global state stores (e.g., useAuthStore)
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx   # Login and entry views
│   ├── public/        # Static assets
│   └── .env.local     # Frontend environment configuration
│
└── README.md          # Project documentation
```

---

## ✨ Core Features

* **Secure Authentication:** JWT-based user login and authorization managed seamlessly through global Zustand states.
* **Modern UI/UX:** Responsive, clean interface styled with Tailwind CSS and enhanced with Lucide icons.
* **Scalable API Layer:** High-performance asynchronous endpoints powered by FastAPI.
* **Developer Friendly:** Strict type safety with TypeScript and Python type hints.

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/PChinguyen/Youpass-2.0-.git
cd "Youpass 2.0"
```

### 2. Run the Frontend
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Run the Backend
Refer to the `backend/` directory documentation for setting up your virtual environment, installing Python dependencies, and launching FastAPI.
```bash
cd ../backend
# Follow backend startup instructions (e.g., uvicorn main:app --reload)
```

---

## 📄 License
This project is developed as part of the YouPass 2.0 initiative. All rights reserved.