# TaskMaster

🚀 **TaskMaster** is a sleek, modern task‑management app built with **React** & **TypeScript**. Plan, track, and conquer your tasks with style! 🌟  

> “Organize your chaos, one task at a time.” — *TaskMaster Philosophy*

---

## ✨ Features

- **🗓 Interactive Dashboard**  
  Visualize your workload with a calendar and dynamic charts.
  
- **✅ Full CRUD Tasks**  
  Create, edit, delete, and filter tasks (All • Completed • Pending).
  
- **🔒 Secure Authentication**  
  Email/password registration & login with rigorous validation.
  
- **🎨 Theme Switcher**  
  Toggle light 🌞 / dark 🌙 modes (preference stored in `localStorage`).
  
- **📱 Responsive Design**  
  Fluid experience on mobile & desktop with a collapsible sidebar.
  
- **🔔 Toast Notifications**  
  Instant feedback on actions (task creation, profile updates, etc.).
  
- **🌐 MockAPI Backend**  
  Persistent storage for tasks and user data.

---

## 🛠 Tech Stack

| Category   | Tools |
| ---------: | :---- |
| **Frontend** | ⚛️ React 19 · 📘 TypeScript 5.8 · 🔄 Redux Toolkit 2.8 · 🛤 React Router 7.6 |
| **Styling** | 🎨 Tailwind CSS 4.1 (`dark:` mode) |
| **Forms** | 📝 React Hook Form 7.57 · ✅ Zod 3.25 |
| **Data** | 🌍 Axios 1.9 · 🗄 MockAPI |
| **Visuals** | 📊 Recharts 2.15 · 🗓 React Calendar 6.0 · 🖼 Heroicons 2.2 |
| **Build** | ⚡ Vite 6.3 · 🧶 Yarn |
| **Code Quality** | 🔍 ESLint 9.25 · 🎀 Prettier 3.5 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18  
- **Yarn** ≥ 1.22  
- **MockAPI** account (free)

### Installation

# 1. Clone the repository
```bash
git clone https://github.com/thrillu4/task-manager.git
cd task-manager
```

# 2. Install dependencies
```bash
  yarn install
```
# 3. Configure MockAPI:
  - Create a project on MockAPI.
  - Set up two resources:
    ```bash
      users: { id: string, email: string, password: string }
      tasks: { id: string, title: string, description: string, completed: boolean, dueDate: string, userId: string, createdAt: string }
    ```
  - Update API_URL in .env file:
   ```bash
       VITE_BASE_URL = 'https://your-mockapi-id.mockapi.io';
  ```
  - Start the app:
   ```bash
      yarn dev
   ```
  Open http://localhost:5173 in your browser. 🎉

  - Build for production:
   ```bash
    yarn build
    yarn preview
  ```

---

## 📖 Usage Guide
Route	What you can do
/dashboard	View upcoming tasks, charts & calendar
/login, /register	Sign in or create an account
/tasks	Add • complete • delete • filter tasks
/settings	Update profile & toggle theme

Pro Tip: Switch to dark mode in Settings for a cozy night‑time vibe. 🌙

---

## 📬 Feedback
Have ideas or issues?
Open an issue or start a discussion — let’s make TaskMaster unstoppable! 💪

---

Built by [thrillu4](https://github.com/thrillu4) • [Live Demo](https://taskmaster-manager.netlify.app) 
