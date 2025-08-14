import { AuthController } from './AuthController';
import { ProjectController } from './ProjectController';
import { BrifyController } from './BrifyController';
import { AdaptiaController } from './AdaptiaController';
import { VisuoController } from './VisuoController';
import { User } from '../models/User';

export type AppScreen = 'home' | 'login' | 'app' | 'brify' | 'adaptia' | 'visuo' | 'projects';

export class AppController {
  private static instance: AppController;
  private authController: AuthController;
  private projectController: ProjectController;
  private brifyController: BrifyController;
  private adaptiaController: AdaptiaController;
  private visuoController: VisuoController;

  private constructor() {
    this.authController = AuthController.getInstance();
    this.projectController = ProjectController.getInstance();
    this.brifyController = BrifyController.getInstance();
    this.adaptiaController = AdaptiaController.getInstance();
    this.visuoController = VisuoController.getInstance();
  }

  public static getInstance(): AppController {
    if (!AppController.instance) {
      AppController.instance = new AppController();
    }
    return AppController.instance;
  }

  // Auth methods
  public async login(email: string, password: string) {
    const result = await this.authController.login(email, password);
    if (result.success && result.user) {
      this.projectController.initializeWithUser(result.user);
    }
    return result;
  }

  public logout(): void {
    this.authController.logout();
  }

  public getUser(): User | null {
    return this.authController.getUser();
  }

  public isAuthenticated(): boolean {
    return this.authController.isUserAuthenticated();
  }

  public checkSessionExpiry(): boolean {
    return this.authController.checkSessionExpiry();
  }

  // Project methods
  public selectProject(projectId: string): void {
    this.projectController.selectProject(projectId);
  }

  public getSelectedProject(): any {
    const user = this.getUser();
    return user ? this.projectController.getSelectedProject(user) : null;
  }

  public getSelectedProjectId(): string {
    return this.projectController.getSelectedProjectId();
  }

  public async updateCompanyInfo(projectId: string, companyInformation: string) {
    const user = this.getUser();
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    return await this.projectController.updateCompanyInfo(user, projectId, companyInformation);
  }

  // Module methods
  public async generateBrief(feature: string) {
    const project = this.getSelectedProject();
    return await this.brifyController.generateBrief(feature, project);
  }

  public getBrifyCachedData(feature: string) {
    return this.brifyController.getCachedData(feature);
  }

  public clearBrifyCache(): void {
    this.brifyController.clearCache();
  }

  public async generateAdaptations(videoScript: string, selectedMedia: string[], selectedBrifyData?: any, selectedVisuoData?: any) {
    const project = this.getSelectedProject();
    return await this.adaptiaController.generateAdaptations(videoScript, selectedMedia, project, selectedBrifyData, selectedVisuoData);
  }

  public getAdaptiaCachedData(videoScript: string) {
    return this.adaptiaController.getCachedData(videoScript);
  }

  public clearAdaptiaCache(): void {
    this.adaptiaController.clearCache();
  }

  public async generatePrompts(feature: string, selectedBrifyOptions?: any) {
    const project = this.getSelectedProject();
    return await this.visuoController.generatePrompts(feature, project, selectedBrifyOptions);
  }

  public getVisuoCachedData(feature: string) {
    return this.visuoController.getCachedData(feature);
  }

  public clearVisuoCache(): void {
    this.visuoController.clearCache();
  }

  // Cache update methods for preserving edits
  public updateBrifyCache(data: any): void {
    this.brifyController.updateCachedData(data);
  }

  public updateVisuoCache(data: any): void {
    this.visuoController.updateCachedData(data);
  }

  public updateAdaptiaCache(data: any): void {
    this.adaptiaController.updateCachedData(data);
  }

  // Export data method
  public async exportData(payload: any): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🚀 Guardando datos en:', 'https://workflow-platform.cliengo.com/webhook/fluxia/save-data');
      console.log('📤 Payload de guardado:', payload);

      const response = await fetch('https://workflow-platform.cliengo.com/webhook/fluxia/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Response not OK:', response.status, response.statusText, errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Datos guardados exitosamente:', result);
      
      return { success: true };

    } catch (err) {
      console.error('❌ Error guardando datos:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error desconocido al guardar datos' 
      };
    }
  }

  // Utility methods
  public getInitialScreen(): AppScreen {
    if (this.isAuthenticated() && this.getUser()) {
      return 'app';
    }
    return 'home';
  }
}