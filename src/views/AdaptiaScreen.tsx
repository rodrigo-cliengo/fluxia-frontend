import React from 'react';
import { ArrowLeft, Copy, CheckCircle, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppController } from '../controllers/AppController';
import { AdaptiaData } from '../models/AdaptiaData';

interface AdaptiaScreenProps {
  appController: AppController;
  feature: string;
  onBack: () => void;
}

export const AdaptiaScreen: React.FC<AdaptiaScreenProps> = ({ appController, feature, onBack }) => {
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);
  const [adaptiaData, setAdaptiaData] = React.useState<AdaptiaData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = React.useState<string[]>([]);
  const [videoScript, setVideoScript] = React.useState('');
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

  React.useEffect(() => {
    // Check for cached data
    const cachedData = appController.getAdaptiaCachedData(videoScript);
    if (cachedData) {
      setAdaptiaData(cachedData);
      setSelectedMedia(cachedData.selectedMedia);
    }
  }, [videoScript, appController]);

  const handleCopy = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await appController.generateAdaptations(videoScript, selectedMedia);
      if (result.success && result.data) {
        setAdaptiaData(result.data);
        setCurrentOptionIndex({});
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
      console.error('Error generating Adaptia data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    handleGenerate();
  };

  const handleRefresh = () => {
    appController.clearAdaptiaCache();
    setAdaptiaData(null);
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

  const navigateOption = (mediaKey: string, direction: 'prev' | 'next', totalOptions: number) => {
    setCurrentOptionIndex(prev => {
      const currentIndex = prev[mediaKey] || 0;
      let newIndex;
      
      if (direction === 'prev') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalOptions - 1;
      } else {
        newIndex = currentIndex < totalOptions - 1 ? currentIndex + 1 : 0;
      }
      
      return { ...prev, [mediaKey]: newIndex };
    });
  };

  const MediaCard: React.FC<{ 
    title: string; 
    items: any[]; 
    itemKey: string; 
    color: string;
    isLanding?: boolean;
  }> = ({ title, items, itemKey, color, isLanding = false }) => {
    const currentIndex = currentOptionIndex[itemKey] || 0;
    const currentItem = items[currentIndex];
    
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
            onClick={() => navigateOption(itemKey, 'prev', items.length)}
            className={`flex items-center justify-center w-8 h-8 text-${color}-400 hover:text-${color}-600 hover:bg-${color}-50 rounded-full transition-colors duration-200`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            {items.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setCurrentOptionIndex(prev => ({ ...prev, [itemKey]: index }))}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? `bg-${color}-500` : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => navigateOption(itemKey, 'next', items.length)}
            className={`flex items-center justify-center w-8 h-8 text-${color}-400 hover:text-${color}-600 hover:bg-${color}-50 rounded-full transition-colors duration-200`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Opción {currentIndex + 1}</h4>
          </div>
          
          {isLanding ? (
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Título: </span>
                <span className="text-gray-600">{currentItem.titulo}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Texto de soporte: </span>
                <p className="text-gray-600 mt-1">{currentItem.Support_text}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Objetivo: </span>
                <span className="text-gray-600">{currentItem.objective}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Formato: </span>
                <span className="text-gray-600">{currentItem.format}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Caption: </span>
                <p className="text-gray-600 mt-1">{currentItem.caption}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Sugerencia Visual: </span>
                <p className="text-gray-600 mt-1">{currentItem.visualSuggestion}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Hashtags: </span>
                <span className="text-gray-600">{currentItem.hashtags}</span>
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
                Idea original
              </label>
              <p className="text-gray-600 text-sm mb-4">
                Ingresa la idea original que deseas adaptar para diferentes redes sociales
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
          {adaptiaData && !loading && !error && (
            <>
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Contenido Adaptado</h2>
                <div className="grid grid-cols-1 gap-6">
                  {adaptiaData.getSelectedMediaResults().map((media) => (
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