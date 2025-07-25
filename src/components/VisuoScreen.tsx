import React from 'react';
import { ArrowLeft, Copy, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface VisuoScreenProps {
  feature: string;
  onBack: () => void;
}

interface VisuoResponse {
  promptGeneral: string;
  promptMinimalista: string;
  promptCorporativo: string;
  promptCreativo: string;
  promptEmocional: string;
  promptTecnico: string;
}

const VisuoScreen: React.FC<VisuoScreenProps> = ({ feature, onBack }) => {
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);
  const [processedData, setProcessedData] = React.useState<VisuoResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchVisuoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://workflow-platform.cliengo.com/webhook/fluxia/visuo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feature }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: VisuoResponse = await response.json();
        setProcessedData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
        console.error('Error fetching Visuo data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisuoData();
  }, [feature]);

  const handleCopy = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    const fetchVisuoData = async () => {
      try {
        const response = await fetch('https://workflow-platform.cliengo.com/webhook-test/fluxia/visuo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feature }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: VisuoResponse = await response.json();
        setProcessedData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
        console.error('Error fetching Visuo data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisuoData();
  };

  const promptTypes = [
    { key: 'promptGeneral', name: 'Prompt General', description: 'Versión base y versátil', color: 'gray' },
    { key: 'promptMinimalista', name: 'Prompt Minimalista', description: 'Estilo limpio y simple', color: 'slate' },
    { key: 'promptCorporativo', name: 'Prompt Corporativo', description: 'Profesional y empresarial', color: 'blue' },
    { key: 'promptCreativo', name: 'Prompt Creativo', description: 'Artístico e innovador', color: 'purple' },
    { key: 'promptEmocional', name: 'Prompt Emocional', description: 'Conecta con sentimientos', color: 'pink' },
    { key: 'promptTecnico', name: 'Prompt Técnico', description: 'Detallado y específico', color: 'emerald' },
  ];

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
          {processedData && !loading && !error && (
            <>
              {/* Visual Prompts */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Prompts Visuales por Estilo</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {promptTypes.map((promptType) => (
                    <OutputCard
                      key={promptType.key}
                      title={promptType.name}
                      description={promptType.description}
                      content={processedData[promptType.key as keyof VisuoResponse]}
                      itemKey={promptType.key}
                      color={promptType.color}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-8">
                <button 
                  onClick={onBack}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
                >
                  Generar Nuevos Prompts
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

export default VisuoScreen;