import React from 'react';
import { ArrowLeft, Copy, CheckCircle, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  projectName: string;
  projectId: string;
  projectDetails: {
    companyInformation: string;
  };
}

interface AdaptiaScreenProps {
  feature: string;
  selectedProject: Project | undefined;
  onBack: () => void;
  cachedData: { feature: string; data: any } | null;
  onSaveCache: (data: any) => void;
  onClearCache: () => void;
}

interface MediaContentItem {
  option: string;
  objective: string;
  format: string;
  caption: string;
  visualSuggestion: string;
  hashtags: string;
}

interface LandingContentItem {
  option: string;
  titulo: string;
  Support_text: string;
}

interface AdaptiaResponse {
  content: {
    facebook?: MediaContentItem[];
    instagram?: MediaContentItem[];
    x?: MediaContentItem[];
    youtube?: MediaContentItem[];
    linkedin?: MediaContentItem[];
    tiktok?: MediaContentItem[];
    landingPage?: LandingContentItem[];
    blog?: MediaContentItem[];
    threads?: MediaContentItem[];
  };
}

const AdaptiaScreen: React.FC<AdaptiaScreenProps> = ({ feature, selectedProject, onBack, cachedData, onSaveCache, onClearCache }) => {
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);
  const [processedData, setProcessedData] = React.useState<AdaptiaResponse | null>(
    cachedData && cachedData.feature === feature ? cachedData.data : null
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = React.useState<string[]>([]);
  const [videoScript, setVideoScript] = React.useState(
    cachedData && cachedData.feature === feature ? cachedData.data.videoScript || '' : ''
  );
  const [currentOptionIndex, setCurrentOptionIndex] = React.useState<Record<string, number>>({});

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

  const handleCopy = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const fetchAdaptiaData = async () => {
    if (selectedMedia.length === 0) {
      setError('Por favor selecciona al menos un medio para adaptar');
      return;
    }
    
    if (!videoScript.trim()) {
      setError('Por favor ingresa un guión de video');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://workflow-platform.cliengo.com/webhook/fluxia/adaptia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          videoScript,
          project: selectedProject,
          selectedMedia
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: AdaptiaResponse = await response.json();
      console.log('Adaptia API Response:', data);
      console.log('Content structure:', data.content);
      console.log('Available keys in content:', data.content ? Object.keys(data.content) : 'content is undefined');
      setProcessedData(data);
      onSaveCache({ ...data, videoScript, selectedMedia });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
      console.error('Error fetching Adaptia data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchAdaptiaData();
  };

  const handleRefresh = () => {
    onClearCache();
    setProcessedData(null);
    setCurrentOptionIndex({});
  };

  const handleMediaChange = (mediaKey: string) => {
    setSelectedMedia(prev => 
      prev.includes(mediaKey) 
        ? prev.filter(key => key !== mediaKey)
        : [...prev, mediaKey]
    );
  };

  const handleSelectAll = () => {
    if (selectedMedia.length === mediaOptions.length) {
      setSelectedMedia([]);
    } else {
      setSelectedMedia(mediaOptions.map(option => option.key));
    }
  };

  const handleGenerate = () => {
    fetchAdaptiaData();
    // Reset option indices when generating new content
    setCurrentOptionIndex({});
  };

  const getColorForMedia = (key: string) => {
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
    return colorMap[key] || 'gray';
  };

  const getSelectedMediaResults = () => {
    if (!processedData) return [];
    
    return selectedMedia.map(mediaKey => {
      const mediaOption = mediaOptions.find(option => option.key === mediaKey);
      const apiKey = mediaOption?.apiKey || mediaKey;
      const contentArray = processedData.content?.[apiKey as keyof typeof processedData.content];
      
      return {
        key: mediaKey,
        name: mediaOption?.name || mediaKey,
        content: contentArray || [],
        color: getColorForMedia(mediaKey),
        isLanding: mediaKey === 'landingPage'
      };
    }).filter(item => item.content.length > 0);
  };

  const navigateOption = (mediaKey: string, direction: 'prev' | 'next', totalOptions: number) => {
    setCurrentOptionIndex(prev => {
      const currentIndex = prev[mediaKey] || 0;
      let newIndex;
      
      if (direction === 'prev') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalOptions - 1;
      } else {
        newIndex = currentIndex < totalOptions - 1 ? currentIndex + 1 : 0;
      }
      
      const newState = { ...prev, [mediaKey]: newIndex };
      console.log(`Navigation for ${mediaKey}: ${currentIndex} -> ${newIndex}`, newState);
      return newState;
    });
  };

  const MediaCard: React.FC<{ 
    title: string; 
    items: MediaContentItem[] | LandingContentItem[]; 
    itemKey: string; 
    color: string;
    isLanding?: boolean;
  }> = ({ title, items, itemKey, color, isLanding = false }) => {
    const currentIndex = currentOptionIndex[itemKey] || 0;
    const currentItem = items[currentIndex];
    
    console.log(`MediaCard ${title}: currentIndex=${currentIndex}, totalItems=${items.length}`, { currentOptionIndex, itemKey });
    
    if (!currentItem) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(JSON.stringify(currentItem, null, 2), `${itemKey}-${currentIndex}`)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            {copiedItem === `${itemKey}-${currentIndex}` ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigateOption(itemKey, 'prev', items.length);
            }}
            className={`flex items-center justify-center w-8 h-8 text-${color}-400 hover:text-${color}-600 hover:bg-${color}-50 rounded-full transition-colors duration-200`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex items-center space-x-2">
            {items.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => {
                  console.log(`Dot clicked for ${itemKey}: ${index}`);
                  setCurrentOptionIndex(prev => ({ ...prev, [itemKey]: index }));
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? `bg-${color}-500` : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigateOption(itemKey, 'next', items.length);
            }}
            className={`flex items-center justify-center w-8 h-8 text-${color}-400 hover:text-${color}-600 hover:bg-${color}-50 rounded-full transition-colors duration-200`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Opción {currentIndex + 1}</h4>
          </div>
          
          {isLanding ? (
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Título: </span>
                <span className="text-gray-600">{(currentItem as LandingContentItem).titulo}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Texto de soporte: </span>
                <p className="text-gray-600 mt-1">{(currentItem as LandingContentItem).Support_text}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Objetivo: </span>
                <span className="text-gray-600">{(currentItem as MediaContentItem).objective}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Formato: </span>
                <span className="text-gray-600">{(currentItem as MediaContentItem).format}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Caption: </span>
                <p className="text-gray-600 mt-1">{(currentItem as MediaContentItem).caption}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Sugerencia Visual: </span>
                <p className="text-gray-600 mt-1">{(currentItem as MediaContentItem).visualSuggestion}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Hashtags: </span>
                <span className="text-gray-600">{(currentItem as MediaContentItem).hashtags}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Adaptia - Resultados</h1>
            <p className="text-gray-600 mt-1">Contenido adaptado para múltiples redes sociales</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Video Script Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <label htmlFor="video-script" className="block text-lg font-semibold text-gray-900 mb-2">
                Guión de Video
              </label>
              <p className="text-gray-600 text-sm mb-4">
                Ingresa el guión de video que deseas adaptar para diferentes redes sociales
              </p>
            </div>
            <textarea
              id="video-script"
              name="video-script"
              value={videoScript}
              onChange={(e) => setVideoScript(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
              placeholder="Ejemplo: Bienvenidos a nuestro canal. Hoy les vamos a mostrar cómo usar nuestra nueva función de chat en tiempo real. Esta herramienta revolucionaria permite..."
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-500">{videoScript.length} / 3000</span>
            </div>
          </div>

          {/* Media Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Seleccionar Medios</h2>
                <p className="text-gray-600 text-sm mt-1">Elige los medios para los que deseas adaptar el contenido</p>
              </div>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedMedia.length === mediaOptions.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {mediaOptions.map((media) => (
                <label key={media.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(media.key)}
                    onChange={() => handleMediaChange(media.key)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-900 font-medium">{media.name}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {selectedMedia.length} medio{selectedMedia.length !== 1 ? 's' : ''} seleccionado{selectedMedia.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleGenerate}
                disabled={selectedMedia.length === 0 || !videoScript.trim() || loading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generando...</span>
                  </>
                ) : (
                  <span>Generar Contenido</span>
                )}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptando contenido...</h3>
              <p className="text-gray-600 text-center max-w-md">
                Estamos optimizando tu contenido para los medios seleccionados. Esto puede tomar unos momentos.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-red-900">Error al procesar</h3>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Success State - Show Results */}
          {processedData && !loading && !error && (
            <>
              {/* Social Media Adaptations */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Contenido Adaptado</h2>
                <div className="grid grid-cols-1 gap-6">
                  {getSelectedMediaResults().map((media) => (
                    <MediaCard
                      key={media.key}
                      title={media.name}
                      items={media.content}
                      itemKey={media.key}
                      color={media.color}
                      isLanding={media.isLanding}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-8">
                <button 
                  onClick={handleRefresh}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Generar Nuevo
                </button>
                <button 
                  onClick={onBack}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Ir al Inicio
                </button>
                <button 
                  onClick={onBack}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Ir al Inicio
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200">
                  Exportar Resultados
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdaptiaScreen;