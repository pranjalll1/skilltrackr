# SavvyAI — AI-Powered Skill Assessment Platform

SavvyAI is a full-stack web application that helps users evaluate and improve their skills through AI-generated assessments, personalized recommendations, and an educational chatbot.

---

## Features

- AI-generated MCQ assessments on any topic and difficulty
- Instant scoring with answer review after submission
- Personalized recommendations based on performance
- SavvyBot — an educational AI chatbot (tutor role)
- Analytics dashboard with performance charts
- Assessment history and progress tracking
- User authentication with JWT
- Admin dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Recharts, Axios, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| AI API | Groq Cloud (LLaMA 3.3 70B) |
| Auth | JWT (JSON Web Tokens) |

---

## Project Structure

```
savvy-ai/
├── backend/
│   ├── controllers/
│   │   ├── assessmentController.js
│   │   ├── chatController.js
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Assessment.js
│   │   ├── Chat.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── taskRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── config/
│   │   └── db.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   │   ├── Overview.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── NewAssessment.jsx
│   │   │   │   ├── TakeAssessment.jsx
│   │   │   │   ├── AssessmentResult.jsx
│   │   │   │   ├── History.jsx
│   │   │   │   ├── Chatbot.jsx
│   │   │   │   ├── StudyPlanner.jsx
│   │   │   │   └── ProfileSettings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── routing/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/pranjalll1/skill-tracker.git
cd skill-tracker
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/savvyai
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=gsk_your_groq_key_here
```

Start the backend server:

```bash
node server.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`


## AI Model Details

| Property | Value |
|---|---|
| Provider | Groq Cloud |
| Model | llama-3.3-70b-versatile |
| Temperature | 0.7 |
| Max Tokens | 1000 (chat), 3000 (assessment) |
| Role | Educational Tutor |

---

## How It Works

1. User registers/logs in → JWT token issued
2. User selects topic + difficulty → backend calls Groq API → AI generates 10 MCQs
3. User takes the test → answers submitted → score calculated with safe comparison
4. Results shown with answer review → AI generates personalized recommendations
5. All results saved to MongoDB → visible in dashboard and analytics
6. SavvyBot available at all times for topic-based tutoring

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get token |

### Assessments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/assessments/generate` | Generate new assessment |
| GET | `/api/assessments/:id` | Get assessment by ID |
| POST | `/api/assessments/:id/submit` | Submit answers |
| GET | `/api/assessments/stats` | Get dashboard stats |
| GET | `/api/assessments` | Get all assessments |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat` | Get chat history |
| POST | `/api/chat` | Send message to SavvyBot |

---

## Screenshots

> Add screenshots of your app here

---

## Author

**Pranjal Soni**
Roll No: 63 | CSE Semester 4
Project: SavvyAI (INT428)
Guide: Avijit Tewary

---

## License

This project is for academic purposes only.
