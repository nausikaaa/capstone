import { Router, Request, Response } from 'express';
import { ApifyService } from '../services/apifyService.js';

const router = Router();

// Validate URL format
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// POST /api/properties/scrape - Scrape property data from URL
router.post('/scrape', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    // Validation
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'URL is required',
        message: 'Please provide a valid property URL',
      });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        error: 'Invalid URL format',
        message: 'Please provide a valid HTTP/HTTPS URL',
      });
    }

    // Get Apify service instance
    const apiToken = process.env.APIFY_API_TOKEN;
    if (!apiToken) {
      console.error('APIFY_API_TOKEN not configured');
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Server is not properly configured',
      });
    }

    const apifyService = new ApifyService(apiToken);

    // Scrape the property
    const propertyData = await apifyService.scrapeProperty(url);

    // Return the scraped data
    return res.status(200).json({
      success: true,
      data: propertyData,
    });
  } catch (error) {
    console.error('Error in /scrape endpoint:', error);
    return res.status(500).json({
      error: 'Scraping failed',
      message: error instanceof Error ? error.message : 'Failed to scrape property data',
    });
  }
});

export default router;
