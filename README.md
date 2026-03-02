# 🇮🇳 TGuide — India Travel Guide App

A full-stack mobile application that combines **social travel features** with an **AI-powered travel assistant** to help users explore India. Built with a **React Native (Expo)** frontend and a **Flask** backend.

---

## ✨ Features

### 🔐 Authentication
- Email / password login & registration
- JWT-based session management
- Forgot-password flow
- Input validation on both client and server

### 🏠 Home — Explore India
- Browse Indian states with rich detail cards
- Per-state information: tourist attractions, culture & festivals, budget estimates, best time to visit, popular restaurants

### 📸 Posts — Social Feed
- Instagram-style feed with like & comment support
- Create posts with image upload, caption, and location tagging
- Relative timestamps ("2 hours ago")

### 🤖 AI ChatBot
- Keyword-matched travel assistant powered by **Wikipedia API** summaries
- Covers destinations, budget tips, restaurants, hill stations, beaches
- Travel plan generation with itinerary suggestions
- Suggested prompts for easy interaction

### 🗺️ Interactive Map
- Tourist spots & restaurant markers (seeded data + **OpenTripMap API**)
- Live weather overlay via **OpenWeatherMap API**
- Legend, info modals, and get-directions feature

### 👤 Profile
- Instagram-style profile layout (posts grid, followers/following stats)
- Saved travel plans
- Edit profile (name, username, bio, photo)
- Logout

### 📖 Swagger API Docs
- Interactive API documentation at **`/api/docs`** (Flasgger / Swagger UI)
- Every endpoint documented with request/response schemas and example values
- Try-it-out capability for all routes

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Mobile Frontend** | React Native · Expo SDK 54 · TypeScript |
| **Navigation** | Expo Router (tabs + stack) |
| **HTTP Client** | Axios |
| **Maps** | react-native-maps |
| **Icons** | Lucide React Native |
| **Backend** | Flask 3.1 (Python) |
| **Database** | SQLite (via Flask-SQLAlchemy) |
| **Auth** | Flask-JWT-Extended · Flask-Bcrypt |
| **API Docs** | Flasgger (Swagger UI) |
| **External APIs** | Wikipedia · OpenTripMap · OpenWeatherMap |

---

## 📂 Project Structure

```
TGuide/
├── backend/                        # Flask REST API
│   ├── app.py                      # App factory, Swagger config, health check
│   ├── config.py                   # Environment-based configuration
│   ├── models.py                   # SQLAlchemy models (8 tables)
│   ├── seed_data.py                # Database seeder (states, posts, users, …)
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Environment variables (API keys, secrets)
│   └── routes/
│       ├── auth.py                 # /api/auth/*      — login, signup, forgot-password
│       ├── states.py               # /api/states/*    — list & detail for Indian states
│       ├── posts.py                # /api/posts/*     — CRUD, like, comment
│       ├── chatbot.py              # /api/chatbot/*   — AI assistant & travel plans
│       ├── map.py                  # /api/map/*       — spots, restaurants, weather
│       └── profile.py              # /api/profile/*   — user profile & saved plans
│
└── frontend/                       # React Native (Expo) mobile app
    ├── app/                        # Expo Router file-based routes
    │   ├── (tabs)/                 # Bottom-tab screens
    │   │   ├── index.tsx           # Home (Explore India)
    │   │   ├── posts.tsx           # Social Feed
    │   │   ├── chatbot.tsx         # AI ChatBot
    │   │   ├── map.tsx             # Interactive Map
    │   │   └── profile.tsx         # User Profile
    │   ├── auth/                   # Auth screens
    │   │   ├── login.tsx
    │   │   ├── signup.tsx
    │   │   └── forgot-password.tsx
    │   └── state/[id].tsx          # Dynamic state details
    ├── screens/                    # Screen components
    ├── components/                 # Reusable UI components
    │   ├── ChatBubble.tsx
    │   ├── CustomButton.tsx
    │   ├── PostCard.tsx
    │   └── StateCard.tsx
    ├── services/api.ts             # Axios config & API calls
    ├── contexts/ThemeContext.tsx    # Dark / light mode provider
    ├── constants/
    │   ├── Colors.ts               # Theme colour tokens
    │   └── DummyData.ts            # Fallback / offline data
    ├── package.json
    └── tsconfig.json
```

---

## 🗄️ Database Models

| Model | Table | Purpose |
|---|---|---|
| `User` | `users` | Accounts, credentials, profile info |
| `State` | `states` | Indian states with culture, budget, coordinates |
| `TouristAttraction` | `tourist_attractions` | Attractions linked to a state |
| `StateRestaurant` | `state_restaurants` | Restaurants linked to a state |
| `Post` | `posts` | User travel posts with images, captions, likes |
| `Comment` | `comments` | Comments on posts |
| `SavedPlan` | `saved_plans` | User-saved travel plans |
| `TouristSpot` | `tourist_spots` | Map-level tourist spot markers |
| `MapRestaurant` | `map_restaurants` | Map-level restaurant markers |

---

## 🔗 API Endpoints

> **Base URL:** `http://localhost:8000/api`
> **Interactive Docs:** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

### Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login (returns JWT + user) |
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/forgot-password` | Request password reset |

### States
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/states` | List all states (summary) |
| `GET` | `/api/states/:id` | Full state details + attractions & restaurants |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts` | List all posts (newest first) |
| `POST` | `/api/posts` | Create a new post |
| `POST` | `/api/posts/:id/like` | Toggle like on a post |
| `POST` | `/api/posts/:id/comment` | Add a comment to a post |

### Chatbot
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chatbot/message` | Send message to AI travel assistant |
| `POST` | `/api/chatbot/travel-plan` | Generate a travel plan |

### Map
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/map/tourist-spots` | Tourist spots (optional lat/lng for live API) |
| `GET` | `/api/map/restaurants` | Restaurants (optional lat/lng for live API) |
| `GET` | `/api/map/weather` | Current weather for given lat/lng |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile/:id` | Get user profile with posts & saved plans |
| `PUT` | `/api/profile/:id` | Update profile (name, username, bio, photo) |
| `GET` | `/api/profile/:id/saved-plans` | Get user's saved travel plans |

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **Expo CLI** (`npm install -g expo-cli`)

### 1. Clone the Repository
```bash
git clone https://github.com/juhitharamya/TGuide.git
cd TGuide
```

### 2. Backend Setup
```bash
cd backend

# Create & activate virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (edit .env as needed)
# See "Environment Variables" section below

# Run the server
python app.py
```
The API will be available at **http://localhost:8000** and Swagger docs at **http://localhost:8000/api/docs**.

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Update API base URL in services/api.ts if needed
# Default: http://localhost:8000/api

# Start the Expo dev server
npx expo start
```

---

## 🔑 Environment Variables

Create a `backend/.env` file (one is already provided with defaults):

```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

DATABASE_URL=sqlite:///tguide.db

# Optional — free-tier API keys for live data
OPENWEATHER_API_KEY=your_openweather_api_key    # https://openweathermap.org/api
OPENTRIPMAP_API_KEY=your_opentripmap_api_key    # https://opentripmap.io/
UNSPLASH_ACCESS_KEY=your_unsplash_access_key    # https://unsplash.com/developers
```

> **Note:** The app works without external API keys — it falls back to seeded database data and mock weather responses.

---

## 🎨 Design Philosophy

- Clean, modern **Instagram-inspired** UI
- Consistent **8 px spacing** system
- **Dark / light mode** with system-preference detection
- Smooth animations and responsive layouts
- Accessible colour contrasts

---

## 📝 License

MIT
