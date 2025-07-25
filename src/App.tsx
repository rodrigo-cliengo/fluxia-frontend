import React from 'react';
import { FileText, RefreshCw, Eye, Menu, User, Settings, BarChart3 } from 'lucide-react';
import BrifyScreen from './components/BrifyScreen';
import AdaptiaScreen from './components/AdaptiaScreen';
import VisuoScreen from './components/VisuoScreen';

function App() {
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'brify' | 'adaptia' | 'visuo'>('home');
  const [featureText, setFeatureText] = React.useState('');

  const handleBrifyStart = () => {
    if (featureText.trim()) {
      setCurrentScreen('brify');
    } else {
      alert('Por favor, ingresa una descripción del feature antes de continuar.');
    }
  };

  const handleAdaptiaStart = () => {
    if (featureText.trim()) {
      setCurrentScreen('adaptia');
    } else {
      alert('Por favor, ingresa una descripción del feature antes de continuar.');
    }
  };

  const handleVisuoStart = () => {
    if (featureText.trim()) {
      setCurrentScreen('visuo');
    } else {
      alert('Por favor, ingresa una descripción del feature antes de continuar.');
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  if (currentScreen === 'brify') {
    return <BrifyScreen feature={featureText} onBack={handleBackToHome} />;
  }

  if (currentScreen === 'adaptia') {
    return <AdaptiaScreen feature={featureText} onBack={handleBackToHome} />;
  }

  if (currentScreen === 'visuo') {
    return <VisuoScreen feature={featureText} onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Fluxia</h1>
          </div>
        </div>
        
        <nav className="px-6 space-y-2">
          <a href="#" className="flex items-center space-x-3 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg font-medium">
            <Menu className="w-5 h-5" />
            <span>Inicio</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
            <BarChart3 className="w-5 h-5" />
            <span>Proyectos</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
            <Settings className="w-5 h-5" />
            <span>Configuración</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Generador de Contenido IA</h2>
              <p className="text-gray-600 mt-1">Automatiza la creación de contenido para múltiples redes sociales</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Feature Input Section */}
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <label htmlFor="feature" className="block text-lg font-semibold text-gray-900 mb-2">
                  Feature
                </label>
                <p className="text-gray-600 text-sm mb-4">
                  Describe la característica o funcionalidad base que deseas desarrollar para generar contenido
                </p>
              </div>
              <textarea
                id="feature"
                name="feature"
                value={featureText}
                onChange={(e) => setFeatureText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                placeholder="Ejemplo: Nueva función de chat en tiempo real que permite a los usuarios comunicarse instantáneamente con soporte técnico a través de mensajes de texto, con respuestas automáticas inteligentes y escalamiento a agentes humanos cuando sea necesario..."
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-500">{featureText.length} / 2000</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Módulos Principales</h3>
              <p className="text-gray-600">Selecciona el módulo que deseas utilizar para generar contenido</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Brify Module */}
              <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-200">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Brify</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Desarrolla briefs creativos completos, define beneficios clave y genera assets creativos desde una feature base.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                    Generación de briefs
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                    Generación de briefs
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                    Definición de beneficios
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                    Assets creativos
                  </div>
                </div>
                <button 
                  onClick={handleBrifyStart}
                  className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Iniciar Brify
                </button>
              </div>

              {/* Adaptia Module */}
              <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-200">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Adaptia</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Adapta contenido existente para diferentes redes sociales, optimizando formatos y mensajes específicos.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                    Adaptación multicanal
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                    Adaptación multicanal
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                    Optimización de formatos
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                    Mensajes específicos
                  </div>
                </div>
                <button 
                  onClick={handleAdaptiaStart}
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Iniciar Adaptia
                </button>
              </div>

              {/* Visuo Module */}
              <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Visuo</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Genera prompts visuales optimizados a partir de contenido base para crear imágenes impactantes con IA.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
                    Prompts visuales
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
                    Prompts visuales
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
                    Optimización IA
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
                    Imágenes impactantes
                  </div>
                </div>
                <button 
                  onClick={handleVisuoStart}
                  className="w-full bg-emerald-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
                >
                  Iniciar Visuo
                </button>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Potencia tu contenido con IA
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Nuestros módulos trabajan de forma independiente para brindarte máxima flexibilidad. 
                  Cada proceso está optimizado para generar el mejor contenido adaptado a tus necesidades específicas.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;