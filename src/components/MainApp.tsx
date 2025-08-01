import React from 'react';
import { FileText, RefreshCw, Eye, Menu, User, Settings, BarChart3, LogOut, ChevronDown, Save, Loader2 } from 'lucide-react';
import BrifyScreen from './BrifyScreen';
import AdaptiaScreen from './AdaptiaScreen';
import VisuoScreen from './VisuoScreen';

interface Project {
  projectName: string;
  projectId: string;
  projectDetails: {
    companyInformation: string;
  };
}

interface UserData {
  name: string;
  projects: Project[];
}

interface MainAppProps {
  user: UserData;
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, onLogout }) => {
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'brify' | 'adaptia' | 'visuo' | 'projects'>('home');
  const [featureText, setFeatureText] = React.useState('');
  const [selectedProjectId, setSelectedProjectId] = React.useState(user.projects[0]?.projectId || '');
  const [editedCompanyInfo, setEditedCompanyInfo] = React.useState('');
  const [isEditingCompanyInfo, setIsEditingCompanyInfo] = React.useState(false);
  const [isSavingCompanyInfo, setIsSavingCompanyInfo] = React.useState(false);

  const selectedProject = user.projects.find(p => p.projectId === selectedProjectId);

  React.useEffect(() => {
    if (selectedProject) {
      setEditedCompanyInfo(selectedProject.projectDetails.companyInformation);
    }
  }, [selectedProject]);

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

  const handleProjectsClick = () => {
    setCurrentScreen('projects');
  };

  const handleSaveCompanyInfo = async () => {
    if (!selectedProject) return;

    try {
      setIsSavingCompanyInfo(true);
      
      const requestData = {
        projectId: selectedProjectId,
        companyInformation: editedCompanyInfo,
      };
      
      console.log('Sending update request:', requestData);
      console.log('API URL:', `${import.meta.env.VITE_API_BASE_URL}/change-company-info`);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/change-company-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Success response:', responseData);
      
      // Update local state
      selectedProject.projectDetails.companyInformation = editedCompanyInfo;
      setIsEditingCompanyInfo(false);
      alert('Información de la empresa actualizada correctamente');
    } catch (err) {
      console.error('Update company info error:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        type: typeof err,
        stack: err instanceof Error ? err.stack : 'No stack trace'
      });
      alert('Error al actualizar la información: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setIsSavingCompanyInfo(false);
    }
  };

  if (currentScreen === 'brify') {
    return <BrifyScreen feature={featureText} onBack={handleBackToHome} selectedProject={selectedProject} />;
  }

  if (currentScreen === 'adaptia') {
    return <AdaptiaScreen feature={featureText} onBack={handleBackToHome} selectedProject={selectedProject} />;
  }

  if (currentScreen === 'visuo') {
    return <VisuoScreen feature={featureText} onBack={handleBackToHome} selectedProject={selectedProject} />;
  }

  if (currentScreen === 'projects') {
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
            <button
              onClick={handleBackToHome}
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg w-full text-left"
            >
              <Menu className="w-5 h-5" />
              <span>Inicio</span>
            </button>
            <button
              onClick={handleProjectsClick}
              className="flex items-center space-x-3 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg font-medium w-full text-left"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Proyectos</span>
            </button>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </a>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200 shadow-lg bg-white border border-gray-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Administrar Proyectos</h2>
                <p className="text-gray-600 mt-1">Gestiona la configuración de tus proyectos</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Bienvenido,</span>
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Project Selection */}
              <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <label htmlFor="project-select" className="block text-lg font-semibold text-gray-900 mb-2">
                    Seleccionar Proyecto
                  </label>
                  <p className="text-gray-600 text-sm mb-4">
                    Elige el proyecto que deseas administrar
                  </p>
                </div>
                <div className="relative">
                  <select
                    id="project-select"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-gray-900"
                  >
                    {user.projects.map((project) => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Company Information */}
              {selectedProject && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Información de la Empresa</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Proyecto: {selectedProject.projectName}
                      </p>
                    </div>
                    {!isEditingCompanyInfo && (
                      <button
                        onClick={() => setIsEditingCompanyInfo(true)}
                        className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg font-medium transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                    )}
                  </div>

                  {!isEditingCompanyInfo ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedProject.projectDetails.companyInformation || 'No hay información de la empresa disponible.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        value={editedCompanyInfo}
                        onChange={(e) => setEditedCompanyInfo(e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900"
                        placeholder="Ingresa la información de la empresa..."
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{editedCompanyInfo.length} caracteres</span>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setIsEditingCompanyInfo(false);
                              setEditedCompanyInfo(selectedProject.projectDetails.companyInformation);
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSaveCompanyInfo}
                            disabled={isSavingCompanyInfo}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {isSavingCompanyInfo ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Guardando...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                <span>Guardar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
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
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-3 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg font-medium w-full text-left"
          >
            <Menu className="w-5 h-5" />
            <span>Inicio</span>
          </button>
          <button
            onClick={handleProjectsClick}
            className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg w-full text-left"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Proyectos</span>
          </button>
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Proyecto:</span>
                <div className="relative">
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-sm font-medium"
                  >
                    {user.projects.map((project) => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Bienvenido,</span>
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
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

      {/* Single Logout Button - Bottom Left Corner */}
      <button
        onClick={onLogout}
        className="fixed bottom-6 left-6 flex items-center space-x-3 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200 shadow-lg bg-white border border-gray-200 z-50"
      >
        <LogOut className="w-5 h-5" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default MainApp;