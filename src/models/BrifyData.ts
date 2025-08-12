export interface BrifyOptionData {
  option: string;
  funcional: string;
  económico: string;
  emocional: string;
  mensaje_comercial: string;
  CTA: string;
  visual: string;
}

export class BrifyData {
  public options: BrifyOptionData[];
  public feature: string;
  public projectId: string;
  public timestamp: number;

  constructor(options: BrifyOptionData[], feature: string, projectId: string) {
    this.options = options;
    this.feature = feature;
    this.projectId = projectId;
    this.timestamp = Date.now();
  }

  getOption(index: number): BrifyOptionData | undefined {
    return this.options[index];
  }

  getTotalOptions(): number {
    return this.options.length;
  }

  static fromApiResponse(data: any, feature: string, projectId: string): BrifyData {
    return new BrifyData(data.options, feature, projectId);
  }

  toJSON(): any {
    return {
      options: this.options,
      feature: this.feature,
      projectId: this.projectId,
      timestamp: this.timestamp
    };
  }
}