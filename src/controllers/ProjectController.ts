import { User, ProjectData } from '../models/User';

export class ProjectController {
  private static instance: ProjectController;
  private selectedProjectId: string = '';

  private constructor() {}

  public static getInstance(): ProjectController {
    if (!ProjectController.instance) {
      ProjectController.instance = new ProjectController();
    }
    return ProjectController.instance;
  }

  public selectProject(projectId: string): void {
    this.selectedProjectId = projectId;
  }

  public getSelectedProject(user: User): ProjectData | undefined {
    if (!this.selectedProjectId && user.projects.length > 0) {
      this.selectedProjectId = user.projects[0].projectId;
    }
    return user.getProject(this.selectedProjectId);
  }

  public getSelectedProjectId(): string {
    return this.selectedProjectId;
  }

  public initializeWithUser(user: User): void {
    if (!this.selectedProjectId && user.projects.length > 0) {
      this.selectedProjectId = user.projects[0].projectId;
    }
  }

  public async updateCompanyInfo(
    user: User, 
    projectId: string, 
    companyInformation: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const requestData = {
        projectId,
        companyInformation,
      };
      
      const response = await fetch(`https://workflow-platform.cliengo.com/webhook/fluxia/change-compay-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        // Success: Update local state
        user.updateProjectCompanyInfo(projectId, companyInformation);
        return { success: true };
      } else if (response.status === 503) {
        // Service unavailable
        return { 
          success: false, 
          error: 'El servicio no está disponible en este momento. Por favor, intenta más tarde.' 
        };
      } else {
        // Other errors
        return { 
          success: false, 
          error: `Error ${response.status}: ${response.statusText}` 
        };
      }

    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error desconocido' 
      };
    }
  }
}