import React from 'react';
import { ArrowLeft, Copy, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { AppController } from '../controllers/AppController';
import { VisuoData } from '../models/VisuoData';

interface VisuoScreenProps {
  appController: AppController;
  feature: string;
  onBack: () => void;
}

export const VisuoScreen: React.FC<VisuoScreenProps> = ({ appController, feature, onBack }) => {
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);
  const [visuoData, setVisuoData] = React.useState<VisuoData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Check for cached data first
    const cachedData = appController.getVisuoCachedData(feature);
    if (cachedData) {
      setVisuoData(cachedData);
      setLoading(false);
      return;
    }

    // If no cached data, fetch from API
    const fetchVisuoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await appController.generatePrompts(feature);
        if (result.success && result.data) {
          setVisuoData(result.data);
        } else {
          setError(result.error || 'Error desconocido');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
        console.error('Error fetching Visuo data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisuoData();
  }, [feature, appController]);

  const handleCopy = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleRetry = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await appController.generatePrompts(feature);
      if (result.success && result.data) {
        setVisuoData(result.data);
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
      console.error('Error fetching Visuo data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    appController.clearVisuoCache();
    setVisuoData(null);
    handleRetry();
  };

  const OutputCard: React.FC<{ title: string; description: string; content: string; itemKey: string; color: string }> = ({ title, description, content, itemKey, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <button
          onClick={() => handleCopy(content, itemKey)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
        >
          {copiedItem === itemKey ? (
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
      <p className="text-gray-700 leading-relaxed">{content}</p>
    </div>
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Visuo - Resultados</h1>
            <p className="text-gray-600 mt-1">Prompts visuales optimizados para IA</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Feature Input Display */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
            <h2 className="text-lg font-semibold text-emerald-900 mb-3">Feature Base</h2>
            <p className="text-emerald-800 leading-relaxed">{feature}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generando prompts visuales...</h3>
              <p className="text-gray-600 text-center max-w-md">
                Estamos creando prompts optimizados para diferentes estilos visuales. Esto puede tomar unos momentos.
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
          {visuoData && !loading && !error && (
            <>
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Prompts Visuales por Modelo</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {visuoData.getPromptTypes().map((promptType) => (
                    <OutputCard
                      key={promptType.key}
                      title={promptType.name}
                      description={promptType.description}
                      content={visuoData.getPrompt(promptType.key as keyof typeof visuoData.prompts)}
                      itemKey={promptType.key}
                      color={promptType.color}
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
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
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