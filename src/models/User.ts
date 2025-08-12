export interface ProjectData {
  projectName: string;
  projectId: string;
  projectDetails: {
    companyInformation: string;
  };
}

export class User {
  public name: string;
  public projects: ProjectData[];

  constructor(name: string, projects: ProjectData[]) {
    this.name = name;
    this.projects = projects;
  }

  getProject(projectId: string): ProjectData | undefined {
    return this.projects.find(project => project.projectId === projectId);
  }

  getFirstProject(): ProjectData | undefined {
    return this.projects.length > 0 ? this.projects[0] : undefined;
  }

  updateProjectCompanyInfo(projectId: string, companyInformation: string): void {
    const project = this.getProject(projectId);
    if (project) {
      project.projectDetails.companyInformation = companyInformation;
    }
  }

  static fromApiResponse(data: any): User {
    return new User(data.name, data.projects);
  }

  toJSON(): any {
    return {
      name: this.name,
      projects: this.projects
    };
  }
}