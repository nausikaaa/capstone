import { ApifyClient } from 'apify-client';

const IDEALISTA_ACTOR_ID = 'lukass/idealista-scraper';

export interface ApifyScraperInput {
  url: string;
}

export class ApifyService {
  private client: ApifyClient;

  constructor(apiToken: string) {
    this.client = new ApifyClient({
      token: apiToken,
    });
  }

  

  async scrapeProperty(url: string): Promise<any> {
    console.log('Scraping property:', url);
    try {
      const input = {
        startUrl: [{ 
          url: url 
        }],
        //district: 'Barcelona',
        maxItems: 1,
        proxy: {
          useApifyProxy: true,
          apifyProxyGroups: [
            'RESIDENTIAL'
          ]
        }
      };
      // Run the Idealista scraper actor with proper input format
      const run = await this.client.actor(IDEALISTA_ACTOR_ID).call(input);

      // Fetch results from the actor's dataset
      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

      if (!items || items.length === 0) {
        throw new Error('No property data found for the provided URL');
      }

      // Return the first item (the property data)
      console.log('=== APIFY RESPONSE DEBUG ===');
      console.log('Full response:', JSON.stringify(items[0], null, 2));
      console.log('Available fields:', Object.keys(items[0]));
      console.log('===========================');
      return items[0];
    } catch (error) {
      console.error('Apify scraping error:', error);
      throw new Error(
        `Failed to scrape property: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
