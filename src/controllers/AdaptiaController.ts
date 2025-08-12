import { AdaptiaData } from '../models/AdaptiaData';
import { ProjectData } from '../models/User';

export class AdaptiaController {
  private static instance: AdaptiaController;
  private cachedData: AdaptiaData | null = null;

  private constructor() {
    this.loadFromCache();
  }

  public static getInstance(): AdaptiaController {
    if (!AdaptiaController.instance) {
      AdaptiaController.instance = new AdaptiaController();
    }
    return AdaptiaController.instance;
  }

  public async generateAdaptations(
    videoScript: string,
    selectedMedia: string[],
    project: ProjectData | undefined
  ): Promise<{ success: boolean; data?: AdaptiaData; error?: string }> {
    if (selectedMedia.length === 0) {
      return { success: false, error: 'Por favor selecciona al menos un medio para adaptar' };
    }
    
    if (!videoScript.trim()) {
      return { success: false, error: 'Por favor ingresa un guión de video' };
    }

    try {
      const response = await fetch(`https://workflow-platform.cliengo.com/webhook/fluxia/adaptia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          videoScript,
          project,
          selectedMedia
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const apiData = await response.json();
      const adaptiaData = AdaptiaData.fromApiResponse(apiData, videoScript, selectedMedia, project?.projectId || '');
      
      this.cachedData = adaptiaData;
      this.saveToCache();

      return { success: true, data: adaptiaData };

    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud' 
      };
    }
  }

  public getCachedData(videoScript: string): AdaptiaData | null {
    if (this.cachedData && this.cachedData.videoScript === videoScript) {
      return this.cachedData;
    }
    return null;
  }

  public clearCache(): void {
    this.cachedData = null;
    localStorage.removeItem('fluxia_adaptia_cache');
  }

  private saveToCache(): void {
    if (this.cachedData) {
      localStorage.setItem('fluxia_adaptia_cache', JSON.stringify(this.cachedData.toJSON()));
    }
  }

  private loadFromCache(): void {
    const cached = localStorage.getItem('fluxia_adaptia_cache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        this.cachedData = new AdaptiaData(data.content, data.videoScript, data.selectedMedia, data.projectId);
      } catch (error) {
        console.error('Error loading adaptia cache:', error);
        localStorage.removeItem('fluxia_adaptia_cache');
      }
    }
  }
}