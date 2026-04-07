# 🧠 TravelGenius — AI-Powered Smart Travel Planner

![MERN](https://img.shields.io/badge/MERN-Full_Stack-blue?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-OpenRouter-orange?style=for-the-badge)
![ML](https://img.shields.io/badge/ML-Scikit_Learn-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

> A modern MERN-based travel planning web application with **real AI** (OpenRouter — free), **ML-powered cost estimation**, group expense splitting, and intelligent travel recommendations. Every API used is **100% free**.

## ✨ Features

| Feature | Technology |
|---------|-----------|
| 🗓️ AI Itinerary Generator | OpenRouter API (free) |
| 💬 AI Travel Chatbot | OpenRouter API (free) |
| 📊 ML Cost Estimator | RandomForest + FastAPI |
| 💰 Group Expense Split | Splitwise Algorithm |
| 🌦️ Live Weather Forecast | Open-Meteo API (free) |
| 🗺️ Interactive Maps | Leaflet + OpenStreetMap |
| ✅ Smart Packing Checklist | AI-generated |
| 💡 Budget Analyzer | AI recommendations |
| ⭐ Reviews & Ratings | MongoDB |
| 🔐 JWT Authentication | Secure auth flow |

## 🏗️ Architecture

```
Client (React + Tailwind) ──► Express.js API ──► MongoDB Atlas
                                    │
                              ┌─────┼─────┐
                              ▼     ▼     ▼
                        OpenRouter Open   FastAPI
                           API   Meteo  ML Server
```

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS 3, React Router v6, Axios, Recharts, Leaflet, React Hook Form + Zod

**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, OpenAI SDK (for OpenRouter)

**ML Server:** Python, FastAPI, Scikit-learn, XGBoost, Pandas, NumPy

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas)
- OpenRouter API Key ([free from openrouter.ai/keys](https://openrouter.ai/keys))

### 1. Clone & Install

```bash
git clone https://github.com/Shubham18Raj/ai-travel-planner.git
cd ai-travel-planner

# Frontend
cd client && npm install

# Backend
cd ../server && npm install
cp .env.example .env  # Edit with your keys

# ML Server
cd ../ml-server
pip install -r requirements.txt
python train_model.py  # Train the ML model
```

### 2. Configure Environment

Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/travelplanner
JWT_SECRET=your-secret-key
OPENROUTER_API_KEY=your-openrouter-api-key
ML_SERVER_URL=http://localhost:8000
PORT=5000
```

### 3. Run

```bash
# Terminal 1: ML Server
cd ml-server && uvicorn app:app --port 8000 --reload

# Terminal 2: Backend
cd server && npm run dev

# Terminal 3: Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

## 📁 Project Structure

```
├── client/          # React Frontend (16 pages, 13 components)
├── server/          # Express.js Backend (31 API endpoints)
├── ml-server/       # FastAPI ML Server (cost prediction)
├── docs/            # Project documentation
└── README.md
```

## 📡 API Endpoints (31 total)

| Category | Count | Examples |
|----------|-------|---------|
| Auth | 4 | signup, login, profile |
| Trips | 7 | search, routes, estimate, best-time |
| Hotels | 3 | list, search, details |
| Activities | 3 | list, search, details |
| AI Features | 4 | itinerary, chatbot, checklist, budget |
| Reviews | 3 | create, list, delete |
| Cost Split | 4 | groups, expenses, settlements |
| Weather | 1 | forecast |
| Bookings | 2 | create, list |

## 💰 100% Free APIs

| Service | Purpose | Cost |
|---------|---------|------|
| OpenRouter | AI features | Free (no billing required, free models available) |
| Open-Meteo | Weather | Free (no key needed) |
| OpenStreetMap | Maps | Free (open source) |
| MongoDB Atlas | Database | Free (512MB M0 cluster) |

## 🧪 ML Model

- **Algorithm:** RandomForest + XGBoost (ensemble)
- **Training Data:** 5000 synthetic Indian travel samples
- **Features:** source, destination, distance, travel mode, season, days, hotel type, group size
- **Targets:** total cost, travel/stay/food/activity breakdown
- **Performance:** R² > 0.95, MAE < ₹1500

## 👤 Author

**Shubham Raj** — B.Tech Final Year Project

## 📄 License

MIT License — free for educational and personal use.
