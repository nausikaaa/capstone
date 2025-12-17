# Property Tracker Backend

Express API server that integrates with Apify to scrape Idealista.com property listings.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Add your Apify API token to `.env`:
   ```
   APIFY_API_TOKEN=your_apify_token_here
   PORT=3001
   ```

## Development

Start the development server with hot reload:
```bash
npm run dev
```

Server will run on http://localhost:3001

## API Endpoints

### POST /api/properties/scrape

Scrapes property data from an Idealista.com URL.

**Request Body:**
```json
{
  "url": "https://www.idealista.com/..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    // Scraped property data from Apify
  }
}
```

**Error Response (400/500):**
```json
{
  "error": "Error type",
  "message": "Error description"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Property Tracker API is running"
}
```

## Building for Production

Compile TypeScript to JavaScript:
```bash
npm run build
```

Run compiled code:
```bash
npm start
```

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Scraping**: Apify Client (actor ID: Q79OUyLtoOJwlsO9v)
- **Dev Tools**: tsx for hot reload
