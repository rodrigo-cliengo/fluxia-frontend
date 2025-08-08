interface Project {
  projectName: string;
  projectId: string;
  projectDetails: {
    companyInformation: string;
  };
}

interface BrifyOptionData {
  option: string;
  funcional: string;
  económico: string;
  emocional: string;
  mensaje_comercial: string;
  CTA: string;
  visual: string;
}

export interface BrifyApiResponse {
  options: BrifyOptionData[];
}

export type { BrifyOptionData };

export const brifyService = {
  async generateBrief(feature: string, selectedProject: Project | undefined): Promise<BrifyApiResponse> {
    const requestBody = {
      feature,
      project: selectedProject
    };
    
    const response = await fetch(`https://workflow-platform.cliengo.com/webhook/fluxia/brify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
};