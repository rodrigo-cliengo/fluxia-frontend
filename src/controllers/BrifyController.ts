import { BrifyData } from '../models/BrifyData';
import { ProjectData } from '../models/User';

export class BrifyController {
  private static instance: BrifyController;
  private cachedData: BrifyData | null = null;

  private constructor() {
    this.loadFromCache();
  }

  public static getInstance(): BrifyController {
    if (!BrifyController.instance) {
      BrifyController.instance = new BrifyController();
    }
    return BrifyController.instance;
  }

  public async generateBrief(
    feature: string, 
    project: ProjectData | undefined
  ): Promise<{ success: boolean; data?: BrifyData; error?: string }> {
    try {
      console.log('🚀 Making API call to:', 'https://workflow-platform.cliengo.com/webhook/fluxia/brify');
      console.log('📤 Request body:', { feature, project });
      
      const requestBody = {
        feature,
        project
      };
      
      const response = await fetch(`https://workflow-platform.cliengo.com/webhook/fluxia/brify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error('❌ API Response not OK:', response.status, response.statusText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const apiData = await response.json();
      console.log('✅ API Response data:', apiData);
      const brifyData = BrifyData.fromApiResponse(apiData, feature, project?.projectId || '');
      
      this.cachedData = brifyData;
      this.saveToCache();

      return { success: true, data: brifyData };

    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud' 
      };
    }
  }

  public getCachedData(feature: string): BrifyData | null {
    if (this.cachedData && this.cachedData.feature === feature) {
      return this.cachedData;
    }
    return null;
  }

  public clearCache(): void {
    this.cachedData = null;
    localStorage.removeItem('fluxia_brify_cache');
  }

  public updateCachedData(data: BrifyData): void {
    this.cachedData = data;
    this.saveToCache();
  }

  private saveToCache(): void {
    if (this.cachedData) {
      try {
        localStorage.setItem('fluxia_brify_cache', JSON.stringify(this.cachedData.toJSON()));
        console.log('✅ Brify cache saved successfully');
      } catch (error) {
        console.error('❌ Error saving brify cache:', error);
      }
    }
  }

  private loadFromCache(): void {
    const cached = localStorage.getItem('fluxia_brify_cache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        this.cachedData = new BrifyData(data.options, data.feature, data.projectId);
        console.log('✅ Brify cache loaded successfully');
      } catch (error) {
        console.error('❌ Error loading brify cache, keeping cache:', error);
        // Don't clear cache on parse error, just log it
      }
    }
  }
}