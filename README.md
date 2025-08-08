# Synchrony – Unified Developer Productivity Platform

Synchrony Platform is a developer productivity dashboard that integrates multiple tools into one unified interface.  
It provides features like project management, calendar syncing, developer analytics, real-time chat,  
and AI-powered code review.

---

## 🚀 Features

- **📅 Calendar Integration** – Sync faculty and student schedules with Google Calendar and Outlook APIs.
- **📊 Developer Analytics Dashboard** – Track commits, pull requests, lines of code, and deployments from GitHub GraphQL API.
- **💬 Real-Time Chat System** – Built with Socket.IO for team communication and collaboration.
- **🤖 Code Review Engine** – Automated analysis of pull requests with AI-based suggestions.
- **🧠 AI-Powered Project Insights** – Upload project ZIPs and get an AI-generated summary.
- **⚡ CI/CD Pipeline Builder** – Drag-and-drop GitHub Actions or Jenkins pipeline creation.

---


---

## 🛠 Tech Stack

**Frontend**
- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- Tailwind CSS for styling
- Axios for API calls

**Backend**
- Flask (Python)
- OpenAI API for AI code summaries
- Werkzeug for file handling

**Database & APIs**
- Supabase for checklist storage
- Google Calendar API, Outlook API
- GitHub GraphQL API

---

## Project Structure
```
Synchrony_/
├── backend/ # Flask backend
│ ├── app.py # Main Flask entry point
│ ├── routes/ # API route definitions
│ │ └── convert_code.py
│ ├── model/ # AI and ML models
│ └── requirements.txt # Python dependencies
│
├── frontend/ # Vite + React frontend
│ ├── public/ # Static assets (images, icons)
│ ├── src/
│ │ ├── pages/ # Page components
│ │ ├── components/ # Reusable UI components
│ │ └── App.tsx
│ └── package.json # Frontend dependencies
│
└── README.md

```

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/MASTERxD-2/Synchrony_.git
cd Synchrony_
cd backend
python -m venv venv
source venv/bin/activate   # (Mac/Linux)
venv\Scripts\activate      # (Windows)
pip install -r requirements.txt
python app.py
```
---

### Setup frontend
``` bash
cd frontend
npm install
npm run dev
```

---
Project Dashboard
<img width="1512" height="824" alt="image" src="https://github.com/user-attachments/assets/ca399423-e2b5-423f-a606-fab9083a3ced" />


## Features in Detail


### Progress Tracking
- Real-time progress calculation
- Visual progress bar
- Task completion persistence
- Congratulations message on completion

## Deployment

You can deploy this project using any static hosting service:
- **Vercel**: `npm run build` then deploy the `dist` folder
- **Netlify**: Connect your GitHub repository for automatic deployments
- **GitHub Pages**: Build and deploy to `gh-pages` branch

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

