# 🏕️ WildPath — AI-Powered Outdoor Adventure Planner

A full-stack outdoor adventure planning application with AI-generated itineraries, weather integration, interactive maps, and user authentication.

---

## 🚀 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18 + Vite + Tailwind CSS      |
| Backend     | Node.js + Express.js                |
| Database    | MongoDB + Mongoose                  |
| AI          | Claude AI (Anthropic SDK)           |
| Maps        | Leaflet + OpenStreetMap (free)      |
| Weather     | OpenWeather API                     |
| Auth        | JWT (jsonwebtoken + bcryptjs)       |

---

## 📁 Project Structure

```
outdoor-adventure-planner/
├── backend/
│   ├── controllers/
│   │   ├── adventureController.js   # AI plan generation, CRUD
│   │   ├── weatherController.js     # Weather API integration
│   │   └── authController.js        # JWT auth (register/login)
│   ├── middleware/
│   │   └── auth.js                  # JWT protect middleware
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Trip.js                  # Saved trips schema
│   ├── routes/
│   │   ├── adventure.js
│   │   ├── weather.js
│   │   └── auth.js
│   ├── utils/
│   │   └── claudeHelper.js          # Anthropic Claude API calls
│   ├── server.js                    # Express app entry point
│   └── .env.example                 # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation with auth
│   │   │   ├── AuthModal.jsx        # Login/Register modal
│   │   │   ├── AdventureCard.jsx    # Destination cards
│   │   │   ├── WeatherWidget.jsx    # Weather display
│   │   │   └── ChatBot.jsx          # AI chatbot widget
│   │   ├── hooks/
│   │   │   └── useAuth.jsx          # Auth context provider
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Hero + search form
│   │   │   ├── ResultsPage.jsx      # Adventure listings
│   │   │   ├── ItineraryPage.jsx    # AI plan generator
│   │   │   ├── MapPage.jsx          # Interactive Leaflet map
│   │   │   └── MyTripsPage.jsx      # Saved user trips
│   │   ├── utils/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.jsx                  # Router + layout
│   │   ├── main.jsx
│   │   └── index.css                # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Anthropic API Key (get at https://console.anthropic.com)
- OpenWeather API Key (optional, free at https://openweathermap.org/api)

---

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# In /backend, copy the example env file
cp .env.example .env
```

Edit `/backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/outdoor-adventure
JWT_SECRET=your_super_secret_jwt_key_change_this
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxx          # Required for AI itinerary
OPENWEATHER_API_KEY=your_openweather_key_here    # Optional (mock data used if absent)
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev      # Uses nodemon for hot reload
# OR
npm start        # Production
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser 🎉

---

## 🔑 API Keys

### Anthropic Claude API (Required for AI features)
1. Visit https://console.anthropic.com
2. Create an account and go to API Keys
3. Generate a new key and paste into `.env`

### OpenWeather API (Optional)
1. Visit https://openweathermap.org/api
2. Sign up for free (Free tier: 60 calls/min)
3. Copy API key and paste into `.env`
4. If not provided, the app uses realistic mock weather data

---

## 🌐 API Endpoints

### Adventures
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/adventures` | Get all destinations | Public |
| POST | `/api/adventures/generate-plan` | AI itinerary generation | Optional |
| POST | `/api/adventures/save-trip` | Save a trip | Required |
| GET | `/api/adventures/my-trips` | Get user's trips | Required |
| PUT | `/api/adventures/trips/:id/review` | Rate a trip | Required |
| POST | `/api/adventures/chat` | AI chatbot | Public |

### Weather
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/weather?location=Manali` | Get weather data |

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |

---

## ✨ Features

- 🤖 **AI Itinerary Generator** — Claude AI creates detailed day-by-day plans
- 🌦️ **Live Weather** — Real-time weather with adventure-specific warnings
- 🗺️ **Interactive Map** — Leaflet map with 8+ Indian adventure destinations
- 🔐 **Auth System** — JWT-based register/login/save trips
- 💬 **AI Chatbot** — Ask questions about adventures, gear, safety
- 📱 **Responsive Design** — Mobile-first Tailwind CSS UI
- 🌿 **Nature-themed Design** — Forest green palette, Playfair Display typography
- 💾 **Save & Review** — Bookmark trips, rate adventures
- 🔍 **Filter & Search** — Filter by difficulty, activity, location

---

## 🎨 Design System

- **Primary**: Forest Green (#15803d)
- **Accent**: Earth Amber (#d97706)
- **Display Font**: Playfair Display (serif)
- **Body Font**: DM Sans (sans-serif)
- **Aesthetic**: Natural / Organic / Adventure

---

## 📦 Production Deployment

### Backend (e.g., Railway, Render)
```bash
cd backend
npm start
```

### Frontend (e.g., Vercel, Netlify)
```bash
cd frontend
npm run build
# Deploy /dist folder
```

Update `FRONTEND_URL` in backend `.env` and Vite proxy in `vite.config.js` for production URLs.

---

## 🛠️ Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB is running locally: `mongod`
- Or use MongoDB Atlas and update `MONGODB_URI`
- App works without DB (some features disabled)

**AI not generating?**
- Verify `ANTHROPIC_API_KEY` is set correctly in `.env`
- Check Anthropic account has credits

**Map not loading?**
- Leaflet uses OpenStreetMap (free, no API key needed)
- Check browser console for errors

---

## 📝 License

MIT License — Free to use and modify.
