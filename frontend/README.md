# TravelSphere - Social Travel Assistant App

A comprehensive mobile application built with React Native and Expo that combines social media features with AI-powered travel assistance.

## Features

### Authentication Flow
- Login with email/password
- Sign up for new users
- Forgot password functionality
- Form validation

### Main Features

#### 1. Home (Explore India)
- Browse all Indian states
- View detailed information about each state including:
  - Tourist attractions
  - Culture and festivals
  - Budget estimates
  - Best time to visit
  - Popular restaurants

#### 2. Posts (Social Feed)
- Instagram-like feed
- Like and comment on posts
- Create new posts with:
  - Image upload
  - Caption
  - Location tagging
- Share posts with others

#### 3. AI ChatBot
- Interactive travel assistant
- Get personalized travel recommendations
- Budget planning
- Restaurant suggestions
- Itinerary creation
- Suggested prompts for easy interaction

#### 4. Map
- Interactive map with markers for:
  - Tourist spots
  - Restaurants
- Detailed information modals
- Legend for easy navigation
- Get directions feature

#### 5. Profile
- Instagram-style profile layout
- View stats (posts, followers, following)
- Photo grid of user posts
- Saved travel plans
- Edit profile functionality
- Logout option

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router with tabs and stack navigation
- **HTTP Client**: Axios
- **Maps**: react-native-maps
- **Icons**: Lucide React Native
- **Language**: TypeScript

## Project Structure

```
project/
├── app/                          # App routes (Expo Router)
│   ├── (tabs)/                  # Tab navigation routes
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # Home tab
│   │   ├── posts.tsx            # Posts tab
│   │   ├── chatbot.tsx          # ChatBot tab
│   │   ├── map.tsx              # Map tab
│   │   └── profile.tsx          # Profile tab
│   ├── auth/                    # Authentication routes
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── state/[id].tsx           # Dynamic state details route
│   ├── create-post.tsx          # Create post screen
│   ├── edit-profile.tsx         # Edit profile screen
│   ├── index.tsx                # Root redirect
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── CustomButton.tsx
│   ├── StateCard.tsx
│   ├── PostCard.tsx
│   └── ChatBubble.tsx
├── screens/                      # Screen components
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   └── ForgotPasswordScreen.tsx
│   ├── tabs/
│   │   ├── HomeScreen.tsx
│   │   ├── PostsScreen.tsx
│   │   ├── ChatBotScreen.tsx
│   │   ├── MapScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── StateDetailsScreen.tsx
│   ├── CreatePostScreen.tsx
│   └── EditProfileScreen.tsx
├── services/                     # API services
│   └── api.ts                   # Axios configuration and API calls
├── contexts/                     # React contexts
│   └── ThemeContext.tsx         # Theme provider (dark/light mode)
├── constants/                    # Constants and dummy data
│   ├── Colors.ts
│   └── DummyData.ts
└── hooks/
    └── useFrameworkReady.ts
```

## API Integration

The app is structured to integrate with a FastAPI backend. All API calls are centralized in `services/api.ts` with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Password reset

### States
- `GET /api/states` - Get all states
- `GET /api/states/:id` - Get state details

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Comment on a post

### ChatBot
- `POST /api/chatbot/message` - Send message to chatbot
- `POST /api/chatbot/travel-plan` - Get travel plan

### Map
- `GET /api/map/tourist-spots` - Get tourist spots
- `GET /api/map/restaurants` - Get restaurants

### Profile
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile/:id` - Update profile
- `GET /api/profile/:id/saved-plans` - Get saved plans

## Configuration

Update the API base URL in `services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Features Implementation

### Theme Support
- Automatic dark/light mode based on system preferences
- Manual theme toggle available
- All colors defined in `constants/Colors.ts`

### Navigation
- Tab-based navigation for main features
- Stack navigation for detailed views
- Deep linking support

### Dummy Data
All screens use dummy data located in `constants/DummyData.ts` including:
- Indian states with details
- Social media posts
- User profile
- Tourist spots
- Restaurants
- Chat suggestions

## Development Notes

1. **API Integration**: Replace dummy data with actual API calls once backend is ready
2. **Image Picker**: Implement actual image picker for profile photo and post creation
3. **Authentication**: Add token storage and management
4. **Maps**: Add actual user location tracking
5. **Push Notifications**: Add for post interactions
6. **Real-time Chat**: Integrate WebSocket for live chat with AI

## Design Philosophy

The app follows Instagram-like design patterns with:
- Clean, modern UI
- Consistent spacing (8px system)
- Clear visual hierarchy
- Smooth animations
- Responsive layouts
- Accessible color contrasts

## License

MIT


## Frontend File Structure

TGuide
└── frontend
    ├── app
    │   ├── (tabs)
    │   │   ├── _layout.tsx
    │   │   ├── chatbot.tsx
    │   │   ├── index.tsx
    │   │   ├── map.tsx
    │   │   ├── posts.tsx
    │   │   └── profile.tsx
    │   │
    │   ├── auth
    │   │   ├── forgot-password.tsx
    │   │   ├── login.tsx
    │   │   └── signup.tsx
    │   │
    │   └── state
    │       ├── _layout.tsx
    │       ├── +not-found.tsx
    │       ├── create-post.tsx
    │       ├── edit-profile.tsx
    │       ├── index.tsx
    │       └── [id].tsx
    │
    ├── assets
    │   └── images
    │       ├── favicon.png
    │       └── icon.png
    │
    ├── components
    │   ├── ChatBubble.tsx
    │   ├── CustomButton.tsx
    │   ├── PostCard.tsx
    │   └── StateCard.tsx
    │
    ├── constants
    │   ├── Colors.ts
    │   └── DummyData.ts
    │
    ├── contexts
    │   └── ThemeContext.tsx
    │
    ├── hooks
    │   └── useFrameworkReady.ts
    │
    ├── screens
    │   ├── CreatePostScreen.tsx
    │   ├── EditProfileScreen.tsx
    │   ├── StateDetailsScreen.tsx
    │   ├── auth
    │   │   ├── ForgotPasswordScreen.tsx
    │   │   ├── LoginScreen.tsx
    │   │   └── SignupScreen.tsx
    │   └── tabs
    │       ├── ChatBotScreen.tsx
    │       ├── HomeScreen.tsx
    │       ├── MapScreen.tsx
    │       ├── PostsScreen.tsx
    │       └── ProfileScreen.tsx
    │
    ├── services
    │   └── api.ts
    │
    ├── .env
    ├── .gitignore
    ├── .prettierrc
    ├── app.json
    ├── expo-env.d.ts
    ├── package.json
    ├── package-lock.json
    ├── README.md
    └── tsconfig.json