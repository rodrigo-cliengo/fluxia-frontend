export interface VisuoPrompts {
  image4: string[];
  VEO3: string[];
}

export class VisuoData {
  public prompts: VisuoPrompts;
  public feature: string;
  public projectId: string;
  public timestamp: number;

  constructor(prompts: VisuoPrompts, feature: string, projectId: string) {
    this.prompts = prompts;
    this.feature = feature;
    this.projectId = projectId;
    this.timestamp = Date.now();
  }

  getPromptTypes(): Array<{ key: string; name: string; description: string; color: string }> {
    return [
      { key: 'image4', name: 'Image4', description: 'Prompt optimizado para Image4', color: 'blue' },
      { key: 'VEO3', name: 'VEO3', description: 'Prompt optimizado para VEO3', color: 'purple' },
    ];
  }

  getPrompt(key: keyof VisuoPrompts): string[] {
    return this.prompts[key];
  }

  getPromptOption(key: keyof VisuoPrompts, index: number): string {
    return this.prompts[key][index] || '';
  }

  updatePromptOption(key: keyof VisuoPrompts, index: number, newValue: string): void {
    if (this.prompts[key] && this.prompts[key][index] !== undefined) {
      this.prompts[key][index] = newValue;
    }
  }

  static fromApiResponse(data: any, feature: string, projectId: string): VisuoData {
    return new VisuoData(data, feature, projectId);
  }

  toJSON(): any {
    return {
      prompts: this.prompts,
      feature: this.feature,
      projectId: this.projectId,
      timestamp: this.timestamp
    };
  }
}