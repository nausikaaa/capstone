# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Property Tracker - A full-stack application for tracking and managing Idealista.com property listings during home hunting. Users can save properties, add personal notes and ratings, and organize their favorites.

**Stack**: React 19 + TypeScript + Vite (frontend) + Node.js + Express (backend) + Apify API

## Development Commands

### Frontend (React + Vite)
```bash
npm run dev          # Start Vite dev server on port 5173 with HMR
npm run build        # TypeScript type-check (tsc -b) + production build
npm run lint         # Run ESLint on all files
npm run preview      # Preview production build locally
```

### Backend (Express API)
```bash
cd server
npm run dev          # Start Express server on port 3001 with hot reload (tsx watch)
npm run build        # Compile TypeScript to JavaScript in dist/
npm start            # Run compiled JavaScript from dist/
```

### Running Both Services
1. Terminal 1: `cd server && npm run dev` (starts backend on :3001)
2. Terminal 2: `npm run dev` (starts frontend on :5173)
3. Frontend proxies `/api/*` requests to backend via Vite proxy

## Architecture

### Frontend (`src/`)
- **Components**: PropertyForm, PropertyList, PropertyCard
- **Types**: Property interfaces with flexible Apify response schema
- **Utils**: localStorage helpers for client-side persistence
- **Services**: API client for backend communication
- **Storage**: Browser localStorage stores all property data + user notes/ratings

### Backend (`server/src/`)
- **Framework**: Express with CORS enabled
- **Endpoint**: `POST /api/properties/scrape` - scrapes Idealista property data
- **Apify Integration**: Uses apify-client to call actor `Q79OUyLtoOJwlsO9v`
- **Environment**: Requires `APIFY_API_TOKEN` in `server/.env`
- **Stateless**: No database, only acts as scraping proxy

### Data Flow
1. User pastes Idealista.com URL in frontend form
2. Frontend POST to `/api/properties/scrape` with URL
3. Backend calls Apify actor to scrape property details
4. Backend returns scraped data to frontend
5. Frontend saves to localStorage with user fields (notes, rating, dates)
6. User can edit notes, rate properties, and delete entries

## Project Structure

### Frontend
- `src/App.tsx` - Main app with state management and event handlers
- `src/components/PropertyForm.tsx` - URL input form with validation
- `src/components/PropertyList.tsx` - Grid of property cards with empty state
- `src/components/PropertyCard.tsx` - Individual property with notes/rating UI
- `src/types/property.ts` - TypeScript interfaces for Property and API responses
- `src/utils/localStorage.ts` - CRUD operations for localStorage
- `src/services/api.ts` - API client for backend requests

### Backend
- `server/src/index.ts` - Express server setup with CORS and routes
- `server/src/routes/properties.ts` - Property scraping endpoint with validation
- `server/src/services/apifyService.ts` - Apify API integration using apify-client

## TypeScript Configuration

**Frontend** (`tsconfig.app.json`):
- Target: ES2022, Module: ESNext with bundler resolution
- Strict mode + unused locals/parameters checks
- JSX: react-jsx

**Backend** (`server/tsconfig.json`):
- Target: ES2022, Module: ESNext
- Output: `server/dist/`
- ESM with .js extensions in imports

## Key Features

1. **Property Scraping**: Fetches Idealista.com data via Apify actor
2. **Local Storage**: All data persists in browser localStorage (no backend DB)
3. **User Notes**: Textarea for personal notes on each property
4. **Star Ratings**: 1-5 star rating system with clear option
5. **Duplicate Detection**: Prevents adding same URL twice
6. **Responsive Design**: Mobile-friendly layout with CSS media queries
7. **Error Handling**: User-friendly notifications for success/error states

## Environment Setup

Create `server/.env` with:
```
APIFY_API_TOKEN=your_token_here
PORT=3001
```

## Build System

- **Frontend**: Vite with @vitejs/plugin-react for Fast Refresh
- **Backend**: tsx for development, tsc for production builds
- **Proxy**: Vite proxies `/api/*` to `http://localhost:3001` during dev

## Important Notes

- Property data schema is flexible - stores whatever Apify returns
- PropertyCard component attempts to extract common fields (title, price, address, image) but handles missing data gracefully
- localStorage keys: `property-tracker-properties`
- Unique IDs generated client-side via `crypto.randomUUID()`
