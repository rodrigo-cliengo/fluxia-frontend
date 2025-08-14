import { VisuoData } from '../models/VisuoData';
import { ProjectData } from '../models/User';

export class VisuoController {
  private static instance: VisuoController;
  private cachedData: VisuoData | null = null;

  private constructor() {
    this.loadFromCache();
  }

  public static getInstance(): VisuoController {
    if (!VisuoController.instance) {
      VisuoController.instance = new VisuoController();
    }
    return VisuoController.instance;
  }

  public async generatePrompts(
    feature: string, 
    project: ProjectData | undefined,
    selectedBrifyOptions?: any
  ): Promise<{ success: boolean; data?: VisuoData; error?: string }> {
    try {
      console.log('🚀 Making API call to:', 'https://workflow-platform.cliengo.com/webhook-test/fluxia/visuo');
      console.log('📤 Request body:', { feature, project, selectedBrifyOptions });
      
      const requestBody = {
        feature,
        project,
        ...(selectedBrifyOptions && { selectedBrifyOptions })
      };
      
      const response = await fetch(`https://workflow-platform.cliengo.com/webhook/fluxia/visuo`, {
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
      const visualData = VisuoData.fromApiResponse(apiData, feature, project?.projectId || '');
      
      this.cachedData = visualData;
      this.saveToCache();

      return { success: true, data: visualData };

    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud' 
      };
    }
  }

  public getCachedData(feature: string): VisuoData | null {
    if (this.cachedData && this.cachedData.feature === feature) {
      return this.cachedData;
    }
    return null;
  }

  public clearCache(): void {
    this.cachedData = null;
    localStorage.removeItem('fluxia_visuo_cache');
  }

  public updateCachedData(data: VisuoData): void {
    this.cachedData = data;
    this.saveToCache();
  }

  private saveToCache(): void {
    if (this.cachedData) {
      try {
        localStorage.setItem('fluxia_visuo_cache', JSON.stringify(this.cachedData.toJSON()));
        console.log('✅ Visuo cache saved successfully');
      } catch (error) {
        console.error('❌ Error saving visuo cache:', error);
      }
    }
  }

  private loadFromCache(): void {
    const cached = localStorage.getItem('fluxia_visuo_cache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        this.cachedData = new VisuoData(data.prompts, data.feature, data.projectId);
        console.log('✅ Visuo cache loaded successfully');
      } catch (error) {
        console.error('❌ Error loading visuo cache, keeping cache:', error);
        // Don't clear cache on parse error, just log it
      }
    }
  }
}