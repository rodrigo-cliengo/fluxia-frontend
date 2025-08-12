import React from 'react';
import { ArrowLeft, Copy, CheckCircle, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { AppController } from '../controllers/AppController';
import { BrifyData } from '../models/BrifyData';

interface BrifyScreenProps {
  appController: AppController;
  feature: string;
  onBack: () => void;
}

export const BrifyScreen: React.FC<BrifyScreenProps> = ({ appController, feature, onBack }) => {
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);
  const [brifyData, setBrifyData] = React.useState<BrifyData | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Check for cached data first
    const cachedData = appController.getBrifyCachedData(feature);
    if (cachedData) {
      setBrifyData(cachedData);
      setLoading(false);
      return;
    }

    // If no cached data, fetch from API
    const fetchBrifyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await appController.generateBrief(feature);
        if (result.success && result.data) {
          setBrifyData(result.data);
        } else {
          setError(result.error || 'Error desconocido');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
        console.error('Error fetching Brify data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrifyData();
  }, [feature, appController]);

  const handleRetry = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await appController.generateBrief(feature);
      if (result.success && result.data) {
        setBrifyData(result.data);
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
      console.error('Error fetching Brify data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    appController.clearBrifyCache();
    setBrifyData(null);
    handleRetry();
  };

  const handleCopy = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const OutputCard: React.FC<{ title: string; content: string; itemKey: string }> = ({ title, content, itemKey }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={() => handleCopy(content, itemKey)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
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
            <h1 className="text-2xl font-bold text-gray-900">Brify - Resultados</h1>
            <p className="text-gray-600 mt-1">Brief creativo completo generado con IA</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Feature Input Display */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <h2 className="text-lg font-semibold text-purple-900 mb-3">Feature Base</h2>
            <p className="text-purple-800 leading-relaxed">{feature}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Procesando con IA...</h3>
              <p className="text-gray-600 text-center max-w-md">
                Estamos analizando tu feature y generando el brief creativo completo. Esto puede tomar unos momentos.
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
          {brifyData && !loading && !error && (
            <>
              {/* Option Selection Dropdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <label htmlFor="option-select" className="block text-lg font-semibold text-gray-900 mb-2">
                    Seleccionar Opción
                  </label>
                  <p className="text-gray-600 text-sm mb-4">
                    Elige la opción que mejor se adapte a tus necesidades
                  </p>
                </div>
                <div className="relative">
                  <select
                    id="option-select"
                    value={selectedOptionIndex}
                    onChange={(e) => setSelectedOptionIndex(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-gray-900"
                  >
                    {brifyData.options.map((option, index) => (
                      <option key={index} value={index}>
                        Opción {index + 1}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {brifyData.getOption(selectedOptionIndex) && (
                <>
                  {/* Benefits Section */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Beneficios Identificados</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <OutputCard
                        title="Beneficio Funcional"
                        content={brifyData.getOption(selectedOptionIndex)!.funcional}
                        itemKey="funcional"
                      />
                      <OutputCard
                        title="Beneficio Económico"
                        content={brifyData.getOption(selectedOptionIndex)!.económico}
                        itemKey="economico"
                      />
                      <OutputCard
                        title="Beneficio Emocional"
                        content={brifyData.getOption(selectedOptionIndex)!.emocional}
                        itemKey="emocional"
                      />
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Call to Action</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <OutputCard
                        title="Mensaje Comercial"
                        content={brifyData.getOption(selectedOptionIndex)!.mensaje_comercial}
                        itemKey="mensaje"
                      />
                      <OutputCard
                        title="Call to Action"
                        content={brifyData.getOption(selectedOptionIndex)!.CTA}
                        itemKey="cta"
                      />
                    </div>
                  </div>

                  {/* Visual Prompts Section */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Prompt Visual</h2>
                    <div className="grid grid-cols-1 gap-6">
                      <OutputCard
                        title="Prompt Visual"
                        content={brifyData.getOption(selectedOptionIndex)!.visual}
                        itemKey="visual"
                      />
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
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                    >
                      Ir al Inicio
                    </button>
                    <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200">
                      Exportar Resultados
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};