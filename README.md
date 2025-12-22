# Property Tracker

A full-stack web application for tracking and managing Idealista.com property listings during home hunting. Save properties, add personal notes, rate them, schedule visits, and organize your property search with AI-powered bioclimatic analysis.

## Features

### Core Property Management
- 📋 **Property Scraping**: Automatically fetch property details from Idealista.com URLs using Apify
- 🔐 **User Authentication**: Secure email/password authentication with Supabase
- 💾 **Cloud Database**: All data stored in Supabase with Row Level Security (RLS)
- 📝 **Personal Notes**: Add notes and thoughts for each property
- ⭐ **Star Ratings**: Rate properties from 1-5 stars
- 💚 **Enthusiasm Score**: Track your excitement level (1-10) for each property
- 🔄 **Duplicate Prevention**: Won't add the same property twice

### Workflow & Organization
- 📊 **Kanban Board**: Visual workflow with 4 stages (New → Scheduled → Visited → Archived)
- 📅 **Visit Scheduling**: Schedule property visits with date picker
- ✅ **Visit Tracking**: Mark properties as visited with date
- 🔄 **Reschedule/Cancel**: Easily reschedule or cancel visits
- 📦 **Archive Management**: Archive properties and restore when needed

### AI-Powered Analysis
- 🤖 **Window Analysis**: AI-powered window and bioclimatic analysis using Gemini Vision API
- 🏠 **Bioclimatic Scoring**: Automated scoring based on window quality, orientation, and energy features
- 💡 **Smart Recommendations**: Get AI-generated recommendations for energy improvements
- 📸 **Image Analysis**: Upload property photos for detailed window and energy analysis

### User Experience
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Data Migration**: Seamlessly migrate from localStorage to cloud database
- ⚡ **Real-time Updates**: Optimistic UI updates with React Query
- 🎨 **Modern UI**: Clean, intuitive interface with drag-and-drop ready architecture

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- React Query (@tanstack/react-query) - data fetching & caching
- Supabase Client (@supabase/supabase-js) - authentication & database
- CSS (custom styling with modern layouts)

**Backend:**
- Node.js + Express
- TypeScript
- Apify API (Idealista.com scraper)
- Google Gemini Vision API - AI image analysis
- Supabase - PostgreSQL database with RLS policies

**Database:**
- Supabase (PostgreSQL)
- Row Level Security (RLS) policies
- Automated triggers for timestamps and analysis storage

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Apify API token ([get one here](https://apify.com/))
- Supabase project ([create one here](https://supabase.com/))
- Google Gemini API key ([get one here](https://ai.google.dev/))

## Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com/)
2. Run the database migrations in the Supabase SQL Editor:
   - Execute `supabase/migrations/001_initial_schema.sql`
   - Execute `supabase/migrations/002_rls_policies.sql`
   - Execute `supabase/migrations/003_triggers.sql`
3. Get your Supabase URL and anon key from Project Settings > API

### 3. Configure Environment

**Frontend `.env`:**
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend `server/.env`:**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
APIFY_API_TOKEN=your_apify_token_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend will run on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend will run on http://localhost:5173

### 5. Use the App

1. Open http://localhost:5173 in your browser
2. Sign up for a new account or log in
3. If you have existing localStorage data, you'll be prompted to migrate it
4. Paste an Idealista.com property URL into the form
5. Click "Add Property" and wait for the data to load
6. Properties appear in the "New" column of the Kanban board
7. Add notes, ratings, and enthusiasm scores to your properties
8. Schedule visits by clicking "Schedule Visit" and selecting a date
9. Mark properties as visited or archive them
10. Upload property photos for AI-powered window analysis (optional)

## Project Structure

```
capstone/
├── src/                          # Frontend React app
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   │   ├── AuthPage.tsx       # Auth page wrapper
│   │   │   ├── LoginForm.tsx      # Login form
│   │   │   └── SignUpForm.tsx     # Sign up form
│   │   ├── KanbanBoard.tsx       # Main Kanban board
│   │   ├── KanbanColumn.tsx      # Individual Kanban column
│   │   ├── PropertyTile.tsx      # Property card in Kanban
│   │   ├── PropertyCard.tsx      # Detailed property view (legacy)
│   │   ├── PropertyForm.tsx      # URL input form
│   │   └── MigrationPrompt.tsx   # localStorage migration UI
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   └── useProperties.ts      # Property data & mutations
│   ├── lib/                    # Library configuration
│   │   ├── supabase.ts           # Supabase client
│   │   └── queryClient.ts        # React Query client
│   ├── types/                  # TypeScript interfaces
│   ├── utils/                  # Utility functions
│   │   ├── localStorage.ts       # localStorage helpers
│   │   └── migration.ts          # Data migration utilities
│   ├── services/               # API client
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── server/                      # Backend Express API
│   └── src/
│       ├── routes/             # API endpoints
│       │   ├── properties.ts     # Property scraping
│       │   └── analysis.ts       # Window analysis
│       ├── services/           # External services
│       │   ├── apifyService.ts   # Apify integration
│       │   └── geminiService.ts  # Gemini Vision API
│       └── index.ts            # Server entry point
├── supabase/                    # Database configuration
│   └── migrations/             # SQL migrations
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       └── 003_triggers.sql
├── CLAUDE.md                    # Documentation for Claude Code
└── TODO.md                      # Project roadmap
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Run production server

## How It Works

### Property Scraping Flow
1. User authenticates with Supabase
2. User pastes Idealista.com property URL
3. Frontend sends URL to backend API
4. Backend calls Apify actor to scrape property data
5. Scraped data is returned to frontend
6. Frontend saves property to Supabase database with user metadata
7. Property appears in "New" column of Kanban board

### Window Analysis Flow
1. User uploads property photos
2. Frontend sends image to backend `/api/analysis/window` endpoint
3. Backend processes image with Gemini Vision API
4. AI analyzes windows, glazing, orientation, and energy features
5. Bioclimatic score and recommendations generated
6. Results stored in database and displayed to user

### Data Security
- Row Level Security (RLS) ensures users only see their own properties
- Supabase handles authentication and session management
- All database operations are protected by RLS policies

## API Endpoints

### `POST /api/properties/scrape`
Scrape property data from Idealista.com URL

**Request:**
```json
{
  "url": "https://www.idealista.com/..."
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* property data */ }
}
```

### `POST /api/analysis/window`
Analyze property photos for window quality and bioclimatic features using Gemini Vision API

**Request:**
```json
{
  "imageUrl": "https://example.com/property-photo.jpg",
  "propertyId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "windows": {
      "frame_material": "aluminum",
      "glazing_type": "double",
      "window_to_wall_ratio": 0.25,
      "size": "medium",
      "condition": "good",
      "confidence": 0.85
    },
    "energy_features": {
      "shutters": true,
      "external_shading": false,
      "modern_features": ["tilt-and-turn"]
    },
    "orientation": {
      "estimated": "south",
      "confidence": 0.7,
      "reasoning": "Based on light patterns..."
    },
    "bioclimatic_score": {
      "score": 7.5,
      "strengths": ["Good natural light", "Double glazing"],
      "weaknesses": ["No external shading"]
    },
    "recommendations": [
      {
        "action": "Install external blinds",
        "priority": "medium",
        "estimated_cost": "€500-800",
        "annual_savings": "€150-200/year"
      }
    ]
  }
}
```

### `GET /health`
Health check endpoint

## Development Notes

- Frontend proxies `/api/*` requests to backend during development (configured in `vite.config.ts`)
- Property data schema is flexible - stores whatever Apify returns
- Each property gets a UUID from Supabase
- React Query manages data fetching, caching, and mutations
- Optimistic updates provide instant UI feedback
- RLS policies in Supabase ensure data isolation between users
- Window analysis uses Gemini 2.5 Flash model for multimodal (vision + text) analysis
- All timestamps are managed by Supabase triggers

## Troubleshooting

**Backend won't start:**
- Check that `server/.env` exists and has valid `APIFY_API_TOKEN` and `GEMINI_API_KEY`
- Ensure port 3001 is not already in use
- Verify all dependencies are installed: `cd server && npm install`

**Frontend won't start:**
- Check that `.env` exists and has valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Verify all dependencies are installed: `npm install`

**Authentication issues:**
- Verify Supabase project is active and URL/key are correct
- Check Supabase dashboard for authentication settings
- Ensure RLS policies are properly set up (run migrations)

**Property scraping fails:**
- Verify Apify token is valid and has sufficient credits
- Check that URL is from Idealista.com
- Look at browser console and server logs for errors

**Window analysis not working:**
- Verify `GEMINI_API_KEY` is valid in `server/.env`
- Check that Gemini API is enabled in your Google Cloud project
- Ensure image URLs are accessible
- Check server logs for Gemini API errors

**Data not persisting:**
- Verify Supabase connection is working
- Check browser network tab for failed API calls
- Ensure RLS policies allow your user to insert/update data
- Check Supabase dashboard logs for errors

**Migration from localStorage:**
- Migration prompt should appear automatically if localStorage data exists
- Data is copied (not moved) - original localStorage data remains
- Check browser console for migration errors

## License

MIT
