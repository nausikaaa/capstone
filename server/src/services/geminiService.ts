import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';

export interface WindowAnalysisResult {
  windows: {
    frame_material: string;
    glazing_type: string;
    window_to_wall_ratio: number;
    size: string;
    condition: string;
    confidence: number;
  };
  energy_features: {
    shutters: boolean;
    external_shading: boolean;
    modern_features: string[];
  };
  orientation: {
    estimated: string;
    confidence: number;
    reasoning: string;
  };
  bioclimatic_score: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: Array<{
    action: string;
    priority: string;
    estimated_cost: string;
    annual_savings: string;
  }>;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use Gemini 2.5 Flash - supports multimodal (text + vision)
    this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
  }

  private async listModels() {
    try {
      console.log('Fetching available Gemini models...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${this.genAI['apiKey']}`
      );
      const data = await response.json();
      console.log('Available models:', data.models?.map((m: any) => m.name) || 'None');
    } catch (error) {
      console.error('Error listing models:', error);
    }
  }

  async analyzeWindows(
    imageUrls: string[],
    location: string = 'Barcelona, Spain'
  ): Promise<WindowAnalysisResult> {
    try {
      // Read the prompt template
      const promptTemplate = await this.loadPromptTemplate();

      // Replace location placeholder
      const prompt = promptTemplate.replace('{location}', location);

      // Download images and convert to base64
      const imageParts = await Promise.all(
        imageUrls.map(async (url) => {
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');

          // Detect MIME type from URL or default to jpeg
          let mimeType = 'image/jpeg';
          if (url.toLowerCase().endsWith('.png')) mimeType = 'image/png';
          else if (url.toLowerCase().endsWith('.webp')) mimeType = 'image/webp';

          return {
            inlineData: {
              data: base64,
              mimeType,
            },
          };
        })
      );

      // Combine prompt and images - using simpler SDK format
      const parts = [
        { text: prompt },
        ...imageParts,
      ];

      const result = await this.model.generateContent(parts);

      const response = await result.response;
      const text = response.text();

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from Gemini response');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const analysis: WindowAnalysisResult = JSON.parse(jsonStr);

      return analysis;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(
        `Failed to analyze windows: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async loadPromptTemplate(): Promise<string> {
    // Load the window analysis prompt
    const promptPath = '/Users/soniafabre/Documents/Projects/capstone/prompts/property_analysis/window_analysis.md';
    const content = await fs.readFile(promptPath, 'utf-8');

    // Extract just the prompt parts we need, removing metadata
    // For now, return the full content - we can refine this later
    return content;
  }
}
