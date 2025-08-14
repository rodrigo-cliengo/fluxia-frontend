export interface MediaContentItem {
  option: string;
  objective: string;
  format: string;
  caption: string;
  visualSuggestion: string;
  hashtags: string;
}

export interface LandingContentItem {
  option: string;
  titulo: string;
  Support_text: string;
}

export interface AdaptiaContent {
  facebook?: MediaContentItem[];
  instagram?: MediaContentItem[];
  x?: MediaContentItem[];
  youtube?: MediaContentItem[];
  linkedin?: MediaContentItem[];
  tiktok?: MediaContentItem[];
  landingPage?: LandingContentItem[];
  blog?: MediaContentItem[];
  threads?: MediaContentItem[];
}

export class AdaptiaData {
  public content: AdaptiaContent;
  public videoScript: string;
  public selectedMedia: string[];
  public projectId: string;
  public timestamp: number;

  constructor(content: AdaptiaContent, videoScript: string, selectedMedia: string[], projectId: string) {
    this.content = content;
    this.videoScript = videoScript;
    this.selectedMedia = selectedMedia;
    this.projectId = projectId;
    this.timestamp = Date.now();
  }

  getContentForMedia(mediaKey: string): MediaContentItem[] | LandingContentItem[] {
    return this.content[mediaKey as keyof AdaptiaContent] || [];
  }

  getSelectedMediaResults(): Array<{
    key: string;
    name: string;
    content: MediaContentItem[] | LandingContentItem[];
    color: string;
    isLanding: boolean;
  }> {
    const mediaOptions = [
      { key: 'facebook', name: 'Facebook', apiKey: 'facebook' },
      { key: 'instagram', name: 'Instagram', apiKey: 'instagram' },
      { key: 'x', name: 'X', apiKey: 'x' },
      { key: 'youtube', name: 'Youtube', apiKey: 'youtube' },
      { key: 'linkedin', name: 'LinkedIn', apiKey: 'linkedin' },
      { key: 'tiktok', name: 'TikTok', apiKey: 'tiktok' },
      { key: 'landingPage', name: 'Landing Page', apiKey: 'landing' },
      { key: 'blog', name: 'Blog', apiKey: 'blog' },
      { key: 'threads', name: 'Threads', apiKey: 'threads' },
    ];

    const colorMap: Record<string, string> = {
      facebook: 'blue',
      instagram: 'pink',
      x: 'gray',
      youtube: 'red',
      linkedin: 'indigo',
      tiktok: 'gray',
      landingPage: 'green', 
      blog: 'purple',
      threads: 'gray'
    };

    return this.selectedMedia.map(mediaKey => {
      const mediaOption = mediaOptions.find(option => option.key === mediaKey);
      const apiKey = mediaOption?.apiKey || mediaKey;
      const contentArray = this.content[apiKey as keyof typeof this.content];
      
      return {
        key: mediaKey,
        name: mediaOption?.name || mediaKey,
        content: contentArray || [],
        color: colorMap[mediaKey] || 'gray',
        isLanding: mediaKey === 'landingPage'
      };
    }).filter(item => item.content.length > 0);
  }

  updateContentOption(mediaKey: string, optionIndex: number, field: string, newValue: string): void {
    const content = this.content[mediaKey as keyof AdaptiaContent];
    if (content && content[optionIndex] && (content[optionIndex] as any)[field] !== undefined) {
      (content[optionIndex] as any)[field] = newValue;
    }
  }

  static fromApiResponse(data: any, videoScript: string, selectedMedia: string[], projectId: string): AdaptiaData {
    return new AdaptiaData(data.content, videoScript, selectedMedia, projectId);
  }

  toJSON(): any {
    return {
      content: this.content,
      videoScript: this.videoScript,
      selectedMedia: this.selectedMedia,
      projectId: this.projectId,
      timestamp: this.timestamp
    };
  }
}