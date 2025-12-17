# Property Tracker

A full-stack web application for tracking and managing Idealista.com property listings during home hunting. Save properties, add personal notes, rate them, and keep everything organized in one place.

## Features

- 📋 **Property Scraping**: Automatically fetch property details from Idealista.com URLs using Apify
- 💾 **Local Storage**: All data stored in browser localStorage - no database needed
- 📝 **Personal Notes**: Add notes and thoughts for each property
- ⭐ **Star Ratings**: Rate properties from 1-5 stars
- 🗑️ **Easy Management**: Delete properties you're no longer interested in
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Duplicate Prevention**: Won't add the same property twice

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- CSS (custom styling)

**Backend:**
- Node.js + Express
- TypeScript
- Apify API (Idealista.com scraper)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Apify API token ([get one here](https://apify.com/))

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

### 2. Configure Environment

Create `server/.env` file:
```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your Apify API token:
```
APIFY_API_TOKEN=your_apify_token_here
PORT=3001
```

### 3. Start Development Servers

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

### 4. Use the App

1. Open http://localhost:5173 in your browser
2. Paste an Idealista.com property URL into the form
3. Click "Add Property" and wait for the data to load
4. Add notes and ratings to your saved properties
5. Properties are automatically saved in your browser

## Project Structure

```
capstone/
├── src/                      # Frontend React app
│   ├── components/          # React components
│   │   ├── PropertyForm.tsx    # URL input form
│   │   ├── PropertyList.tsx    # Property grid
│   │   └── PropertyCard.tsx    # Individual property card
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # localStorage helpers
│   ├── services/            # API client
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── server/                   # Backend Express API
│   └── src/
│       ├── routes/          # API endpoints
│       ├── services/        # Apify integration
│       └── index.ts         # Server entry point
└── CLAUDE.md                # Documentation for Claude Code
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

1. User pastes Idealista.com property URL
2. Frontend sends URL to backend API
3. Backend calls Apify actor to scrape property data
4. Scraped data is returned to frontend
5. Frontend saves data + user metadata to localStorage
6. User can add notes, ratings, and manage properties locally

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

### `GET /health`
Health check endpoint

## Development Notes

- Frontend proxies `/api/*` requests to backend during development (configured in `vite.config.ts`)
- Property data schema is flexible - stores whatever Apify returns
- Each property gets a unique client-side UUID
- localStorage key: `property-tracker-properties`

## Troubleshooting

**Backend won't start:**
- Check that `server/.env` exists and has valid `APIFY_API_TOKEN`
- Ensure port 3001 is not already in use

**Property scraping fails:**
- Verify Apify token is valid
- Check that URL is from Idealista.com
- Look at browser console and server logs for errors

**Data not persisting:**
- Check browser's localStorage isn't full
- Ensure localStorage isn't disabled in browser settings

## License

MIT
