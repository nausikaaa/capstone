import { Router } from 'express';
import { GeminiService } from '../services/geminiService.js';

const router = Router();

// Initialize Gemini service
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('WARNING: GEMINI_API_KEY is not set in environment variables');
}

const geminiService = geminiApiKey ? new GeminiService(geminiApiKey) : null;

/**
 * POST /api/analysis/windows
 * Analyze property windows using Gemini Vision API
 */
router.post('/windows', async (req, res) => {
  try {
    if (!geminiService) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Gemini API is not configured. Please set GEMINI_API_KEY environment variable.',
      });
    }

    const { imageUrls, location } = req.body;

    // Validation
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'imageUrls must be a non-empty array',
      });
    }

    if (imageUrls.length > 5) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Maximum 5 images allowed',
      });
    }

    // Validate URLs
    for (const url of imageUrls) {
      try {
        new URL(url);
      } catch {
        return res.status(400).json({
          error: 'Invalid input',
          message: `Invalid image URL: ${url}`,
        });
      }
    }

    console.log(`Analyzing ${imageUrls.length} images for location: ${location || 'Barcelona, Spain'}`);

    // Call Gemini service
    const analysis = await geminiService.analyzeWindows(imageUrls, location);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Window analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

export default router;
