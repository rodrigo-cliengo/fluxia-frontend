import React from 'react';
import { ArrowLeft, Copy, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface BrifyScreenProps {
  feature: string;
  onBack: () => void;
}

interface BrifyResponse {
  beneficioFuncional: string;
  beneficioEconomico: string;
  beneficioEmocional: string;
  cta: string;
  promptVeo3: string;
  promptImage4: string;
}

const BrifyScreen: React.FC<BrifyScreenProps> = ({ feature, onBack }) => {
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);
  const [processedData, setProcessedData] = React.useState<BrifyResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchBrifyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://workflow-platform.cliengo.com/webhook-test/fluxia/brify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feature }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: BrifyResponse = await response.json();
        setProcessedData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
        console.error('Error fetching Brify data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrifyData();
  }, [feature]);

  const handleCopy = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger useEffect again by updating a dependency
    const fetchBrifyData = async () => {
      try {
        const response = await fetch('https://workflow-platform.cliengo.com/webhook-test/fluxia/brify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feature }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: BrifyResponse = await response.json();
        setProcessedData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
        console.error('Error fetching Brify data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrifyData();
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
          {processedData && !loading && !error && (
            <>
              {/* Benefits Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Beneficios Identificados</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <OutputCard
                    title="Beneficio Funcional"
                    content={processedData.beneficioFuncional}
                    itemKey="funcional"
                  />
                  <OutputCard
                    title="Beneficio Económico"
                    content={processedData.beneficioEconomico}
                    itemKey="economico"
                  />
                  <OutputCard
                    title="Beneficio Emocional"
                    content={processedData.beneficioEmocional}
                    itemKey="emocional"
                  />
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Call to Action</h2>
                <OutputCard
                  title="CTA Optimizado"
                  content={processedData.cta}
                  itemKey="cta"
                />
              </div>

              {/* Visual Prompts Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Prompts Visuales</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OutputCard
                    title="Prompt de Veo3"
                    content={processedData.promptVeo3}
                    itemKey="veo3"
                  />
                  <OutputCard
                    title="Prompt de Image4"
                    content={processedData.promptImage4}
                    itemKey="image4"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-8">
                <button 
                  onClick={onBack}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Generar Nuevo Brief
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

export default BrifyScreen;