import React from 'react';
import { Zap, LogOut, User, Settings, Briefcase, Wand2, Shuffle, Play, ArrowLeft, Loader2, AlertCircle, Edit, Save, X, ChevronLeft, ChevronRight, CheckCircle, Copy, Download, XCircle } from 'lucide-react';
import { AppController, AppScreen } from '../controllers/AppController';
import { BrifyData } from '../models/BrifyData';
import { VisuoData } from '../models/VisuoData';
import { AdaptiaData } from '../models/AdaptiaData';

interface MainAppProps {
  appController: AppController;
  onLogout: () => void;
  onScreenChange: (screen: AppScreen) => void;
}

export const MainApp: React.FC<MainAppProps> = ({ appController, onLogout, onScreenChange }) => {
  const [currentScreen, setCurrentScreen] = React.useState<AppScreen>('app');
  const [featureText, setFeatureText] = React.useState('');
  const [brifyData, setBrifyData] = React.useState<BrifyData | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0);
  const [brifyLoading, setBrifyLoading] = React.useState(false);
  const [brifyError, setBrifyError] = React.useState<string | null>(null);
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);
  const [brifyOptionIndices, setBrifyOptionIndices] = React.useState<Record<string, number>>({
    funcional: 0,
    economico: 0,
    emocional: 0,
    mensaje: 0,
    cta: 0,
    visual: 0
  });
  const [visuoData, setVisuoData] = React.useState<VisuoData | null>(null);
  const [visuoLoading, setVisuoLoading] = React.useState(false);
  const [visuoError, setVisuoError] = React.useState<string | null>(null);
  const [adaptiaFormOpen, setAdaptiaFormOpen] = React.useState(false);
  const [exportLoading, setExportLoading] = React.useState(false);
  const [exportMessage, setExportMessage] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [adaptiaVideoScript, setAdaptiaVideoScript] = React.useState('');
  const [adaptiaSelectedMedia, setAdaptiaSelectedMedia] = React.useState<string[]>([]);
  const [adaptiaData, setAdaptiaData] = React.useState<any>(null);
  const [adaptiaLoading, setAdaptiaLoading] = React.useState(false);
  const [adaptiaError, setAdaptiaError] = React.useState<string | null>(null);
  const [adaptiaOptionIndices, setAdaptiaOptionIndices] = React.useState<Record<string, number>>({});
  const [visuoOptionIndices, setVisuoOptionIndices] = React.useState<Record<string, number>>({});
  const [editingStates, setEditingStates] = React.useState<Record<string, boolean>>({});
  const [editingValues, setEditingValues] = React.useState<Record<string, string>>({});
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedProjectId, setSelectedProjectId] = React.useState(() => 
    appController.getSelectedProjectId()
  );

  // Clear all caches on component mount for testing
  React.useEffect(() => {
    // Clear all Fluxia caches for fresh API calls
    localStorage.removeItem('fluxia_brify_cache');
    localStorage.removeItem('fluxia_adaptia_cache');
    localStorage.removeItem('fluxia_visuo_cache');
  }, []);

  // Check session expiry (24 hours)
  React.useEffect(() => {
    const checkSessionExpiry = () => {
      if (appController.checkSessionExpiry()) {
        console.log('⏰ Session expired, logging out...');
        onLogout();
      }
    };

    // Check immediately
    checkSessionExpiry();
    
    // Check every 30 minutes instead of 5 minutes
    const interval = setInterval(checkSessionExpiry, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const user = appController.getUser()!;
  const selectedProject = user.getProject(selectedProjectId);

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
    appController.selectProject(selectedProjectId);
  }, [selectedProjectId, appController]);

  const handleStartBrify = async () => {
    if (!featureText.trim()) {
      alert('Por favor, ingresa una descripción del feature antes de continuar.');
      return;
    }

    // Set loading state first, then scroll
    setBrifyLoading(true);
    setBrifyError(null);
    setBrifyData(null);
    
    // Scroll to Brify section after state update
    setTimeout(() => {
      const brifyElement = document.getElementById('brify-section');
      if (brifyElement) {
        brifyElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);

    // Check for cached data first
    const cachedData = appController.getBrifyCachedData(featureText);
    if (cachedData) {
      setBrifyData(cachedData);
      setBrifyLoading(false);
      setSelectedOptionIndex(0);
      return;
    }

    try {
      const result = await appController.generateBrief(featureText);
      if (result.success && result.data) {
        setBrifyData(result.data);
        setBrifyOptionIndices({
          funcional: 0,
          economico: 0,
          emocional: 0,
          mensaje: 0,
          cta: 0,
          visual: 0
        });
      } else {
        setBrifyError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setBrifyError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
      console.error('Error fetching Brify data:', err);
    } finally {
      setBrifyLoading(false);
    }
  };

  const handleStartVisuo = async () => {
    if (!featureText.trim()) {
      alert('Por favor, ingresa una descripción del feature antes de continuar.');
      return;
    }

    // Set loading state first, then scroll
    setVisuoLoading(true);
    setVisuoError(null);
    setVisuoData(null);
    
    // Scroll to Visuo section after state update
    setTimeout(() => {
      const visuoElement = document.getElementById('visuo-section');
      if (visuoElement) {
        visuoElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);

    // Gather currently selected Brify options if available
    const selectedBrifyOptions = brifyData ? {
      funcional: editingValues[`brify-funcional-${brifyOptionIndices.funcional}`] || brifyData.options[brifyOptionIndices.funcional]?.funcional,
      economico: editingValues[`brify-economico-${brifyOptionIndices.economico}`] || brifyData.options[brifyOptionIndices.economico]?.económico,
      emocional: editingValues[`brify-emocional-${brifyOptionIndices.emocional}`] || brifyData.options[brifyOptionIndices.emocional]?.emocional,
      mensaje_comercial: editingValues[`brify-mensaje-${brifyOptionIndices.mensaje}`] || brifyData.options[brifyOptionIndices.mensaje]?.mensaje_comercial,
      CTA: editingValues[`brify-cta-${brifyOptionIndices.cta}`] || brifyData.options[brifyOptionIndices.cta]?.CTA,
      visual: editingValues[`brify-visual-${brifyOptionIndices.visual}`] || brifyData.options[brifyOptionIndices.visual]?.visual
    } : null;

    // Check for cached data first
    const cachedData = selectedBrifyOptions ? null : appController.getVisuoCachedData(featureText);
    if (cachedData) {
      setVisuoData(cachedData);
      setVisuoLoading(false);
      return;
    }

    try {
      const result = await appController.generatePrompts(featureText, selectedBrifyOptions);
      if (result.success && result.data) {
        setVisuoData(result.data);
      } else {
        setVisuoError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setVisuoError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
      console.error('Error fetching Visuo data:', err);
    } finally {
      setVisuoLoading(false);
    }
  };

  const handleStartAdaptia = () => {
    // Set form open state first
    setAdaptiaFormOpen(true);
    
    // Scroll to Adaptia section
    setTimeout(() => {
      const adaptiaElement = document.getElementById('adaptia-section');
      if (adaptiaElement) {
        adaptiaElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);

    // Determine the source prompt with editing support
    let sourcePrompt = '';
    
    if (visuoData) {
      const visuoIndex = visuoOptionIndices.image4 || 0;
      const editingKey = `visuo-image4-${visuoIndex}`;
      sourcePrompt = editingValues[editingKey] || visuoData.getPromptOption('image4', visuoIndex);
    } else if (brifyData) {
      const brifyIndex = brifyOptionIndices.visual || 0;
      const editingKey = `brify-visual-${brifyIndex}`;
      sourcePrompt = editingValues[editingKey] || brifyData.options[brifyIndex]?.visual || '';
    }
    
    setAdaptiaVideoScript(sourcePrompt);
    setAdaptiaSelectedMedia([]);
    setAdaptiaData(null);
    setAdaptiaError(null);
  };

  const handleAdaptiaMediaChange = (mediaKey: string) => {
    setAdaptiaSelectedMedia(prev => 
      prev.includes(mediaKey) 
        ? prev.filter(key => key !== mediaKey)
        : [...prev, mediaKey]
    );
  };

  const handleSelectAllMedia = () => {
    if (adaptiaSelectedMedia.length === mediaOptions.length) {
      setAdaptiaSelectedMedia([]);
    } else {
      setAdaptiaSelectedMedia(mediaOptions.map(option => option.key));
    }
  };

  const handleRunAdaptia = async () => {
    try {
      setAdaptiaLoading(true);
      setAdaptiaError(null);
      setAdaptiaData(null);
      
      // Prepare data with selected and edited content
      const selectedBrifyData = brifyData ? {
        funcional: editingValues[`brify-funcional-${brifyOptionIndices.funcional}`] || brifyData.options[brifyOptionIndices.funcional]?.funcional,
        economico: editingValues[`brify-economico-${brifyOptionIndices.economico}`] || brifyData.options[brifyOptionIndices.economico]?.económico,
        emocional: editingValues[`brify-emocional-${brifyOptionIndices.emocional}`] || brifyData.options[brifyOptionIndices.emocional]?.emocional,
        mensaje_comercial: editingValues[`brify-mensaje-${brifyOptionIndices.mensaje}`] || brifyData.options[brifyOptionIndices.mensaje]?.mensaje_comercial,
        CTA: editingValues[`brify-cta-${brifyOptionIndices.cta}`] || brifyData.options[brifyOptionIndices.cta]?.CTA,
        visual: editingValues[`brify-visual-${brifyOptionIndices.visual}`] || brifyData.options[brifyOptionIndices.visual]?.visual
      } : null;

      const selectedVisuoData = visuoData ? {
        image4: editingValues[`visuo-image4-${visuoOptionIndices.image4 || 0}`] || visuoData.getPromptOption('image4', visuoOptionIndices.image4 || 0),
        VEO3: editingValues[`visuo-VEO3-${visuoOptionIndices.VEO3 || 0}`] || visuoData.getPromptOption('VEO3', visuoOptionIndices.VEO3 || 0)
      } : null;
      
      const result = await appController.generateAdaptations(adaptiaVideoScript, adaptiaSelectedMedia, selectedBrifyData, selectedVisuoData);
      if (result.success && result.data) {
        setAdaptiaData(result.data);
        // Scroll to results
        setTimeout(() => {
          const resultsElement = document.getElementById('adaptia-results');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        setAdaptiaError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setAdaptiaError(err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud');
      console.error('Error generating Adaptia data:', err);
    } finally {
      setAdaptiaLoading(false);
    }
  };

  const handleGenerateAdaptia = handleRunAdaptia;

  const handleRefreshAdaptia = () => {
    appController.clearAdaptiaCache();
    setAdaptiaData(null);
    setAdaptiaOptionIndices({});
    handleRunAdaptia();
  };

  // Add this new handler function inside your MainApp component
 const handleSaveData = async () => {
  setSaveLoading(true);
  setSaveMessage(null);

  // --- 1. Gather all data from state ---

  const user = appController.getUser();
  const project = appController.getSelectedProject();
  if (!user || !project) {
    setSaveMessage({ type: 'error', message: 'Usuario o proyecto no encontrado.' });
    setSaveLoading(false);
    return;
  }

  // --- 2. Build BRIFY module payload ---
  let brifyModulePayload = null;
  if (brifyData) {
    const selectedOption = {
      option: (selectedOptionIndex + 1).toString(),
      funcional: editingValues[`brify-funcional-${brifyOptionIndices.funcional}`] || brifyData.options[brifyOptionIndices.funcional]?.funcional,
      económico: editingValues[`brify-economico-${brifyOptionIndices.economico}`] || brifyData.options[brifyOptionIndices.economico]?.económico,
      emocional: editingValues[`brify-emocional-${brifyOptionIndices.emocional}`] || brifyData.options[brifyOptionIndices.emocional]?.emocional,
      mensaje_comercial: editingValues[`brify-mensaje-${brifyOptionIndices.mensaje}`] || brifyData.options[brifyOptionIndices.mensaje]?.mensaje_comercial,
      CTA: editingValues[`brify-cta-${brifyOptionIndices.cta}`] || brifyData.options[brifyOptionIndices.cta]?.CTA,
      visual: editingValues[`brify-visual-${brifyOptionIndices.visual}`] || brifyData.options[brifyOptionIndices.visual]?.visual,
    };
    brifyModulePayload = { ...selectedOption };
  }

  // --- 3. Build VISUO module payload ---
  let visuoModulePayload = null;
  if (visuoData) {
    const selectedPrompts: Record<string, string | null> = {};
    for (const key of Object.keys(visuoData.prompts)) {
      const index = visuoOptionIndices[key] || 0;
      const editingKey = `visuo-${key}-${index}`;
      const originalValue = visuoData.getPromptOption(key as keyof typeof visuoData.prompts, index);
      selectedPrompts[key] = editingValues[editingKey] || originalValue;
    }
    visuoModulePayload = {
      prompts: selectedPrompts
    };
  }

  // --- 4. Build ADAPTIA module payload ---
  let adaptiaModulePayload = null;
  if (adaptiaData) {
    const finalAdaptiaContent: Record<string, any> = {};

    Object.keys(adaptiaData.content).forEach(platformKey => {
      const platformContentArray = adaptiaData.content[platformKey];
      if (platformContentArray && platformContentArray.length > 0) {
        const selectedIndex = adaptiaOptionIndices[platformKey] || 0;
        const originalSelectedItem = platformContentArray[selectedIndex];
        
        // Create a copy and overwrite with any edited values
        const finalSelectedItem = { ...originalSelectedItem };
        const editingKeyPrefix = `adaptia-${platformKey}-${selectedIndex}`;

        // Handle specific fields based on whether it's landing or social
        const fieldsToUpdate = platformKey === 'landing' 
            ? ['titulo', 'Support_text'] 
            : ['objective', 'format', 'caption', 'visualSuggestion', 'hashtags'];
        
        fieldsToUpdate.forEach(field => {
            const fieldEditingKey = `${editingKeyPrefix}-${field}`;
            if (editingValues[fieldEditingKey] !== undefined) {
                finalSelectedItem[field] = editingValues[fieldEditingKey];
            }
        });

        finalAdaptiaContent[platformKey] = finalSelectedItem; // Assign single object, not array
      } else {
        finalAdaptiaContent[platformKey] = null;
      }
    });

    adaptiaModulePayload = {
      videoScript: adaptiaData.videoScript,
      selectedMedia: adaptiaData.selectedMedia,
      content: finalAdaptiaContent
    };
  }

  // --- 5. Assemble the final payload ---
  const exportPayload = {
    userEmail: user.name, // Assuming user.name is the email
    project: {
        projectId: project.projectId,
        projectName: project.projectName,
        projectDetails: project.projectDetails,
    },
    exportTimestamp: new Date().toISOString(),
    feature: featureText, // Add the root level feature
    modules: {
      brify: brifyModulePayload,
      visuo: visuoModulePayload,
      adaptia: adaptiaModulePayload,
    },
  };

  // --- 6. Call the updated AppController method ---
  const result = await appController.exportData(exportPayload);

  if (result.success) {
    setSaveMessage({ type: 'success', message: '¡Resultados guardados exitosamente en tu proyecto!' });
  } else {
    setSaveMessage({ type: 'error', message: result.error || 'Ocurrió un error al guardar los resultados.' });
  }

  setSaveLoading(false);
  setTimeout(() => setSaveMessage(null), 5000);
};

  
  const handleModuleStart = (module: 'brify' | 'adaptia' | 'visuo') => {
    if (featureText.trim()) {
      setCurrentScreen(module);
      onScreenChange(module);
    } else {
      alert('Por favor, ingresa una descripción del feature antes de continuar.');
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('app');
    onScreenChange('app');
  };

  const handleCopy = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const navigateOption = (direction: 'prev' | 'next') => {
    if (!brifyData) return;
    
    const totalOptions = brifyData.getTotalOptions();
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = selectedOptionIndex > 0 ? selectedOptionIndex - 1 : totalOptions - 1;
    } else {
      newIndex = selectedOptionIndex < totalOptions - 1 ? selectedOptionIndex + 1 : 0;
    }
    
    setSelectedOptionIndex(newIndex);
  };

  const handleRefreshBrify = () => {
    appController.clearBrifyCache();
    setBrifyData(null);
    setBrifyOptionIndices({
      funcional: 0,
      economico: 0,
      emocional: 0,
      mensaje: 0,
      cta: 0,
      visual: 0
    });
    handleStartBrify();
  };

  const handleRefreshVisuo = () => {
    appController.clearVisuoCache();
    setVisuoData(null);
    handleStartVisuo();
  };

  const handleEdit = (itemKey: string, currentValue: string) => {
    setEditingStates(prev => ({ ...prev, [itemKey]: true }));
    setEditingValues(prev => ({ ...prev, [itemKey]: currentValue }));
  };

  const handleSaveEdit = (itemKey: string) => {
    setEditingStates(prev => ({ ...prev, [itemKey]: false }));
  };

  const handleCancelEdit = (itemKey: string, originalValue: string) => {
    setEditingStates(prev => ({ ...prev, [itemKey]: false }));
    setEditingValues(prev => ({ ...prev, [itemKey]: originalValue }));
  };

  // Add new NavigableOutputCard component
  const NavigableOutputCard: React.FC<{ 
    title: string; 
    description?: string; 
    options: string[]; 
    cardKey: string; 
    icon?: React.ReactNode;
  }> = ({ title, description, options, cardKey, icon }) => {
    const currentIndex = brifyOptionIndices[cardKey] || 0;
    const editingKey = `brify-${cardKey}-${currentIndex}`;
    const isEditing = editingStates[editingKey];
    const currentContent = editingValues[editingKey] || options[currentIndex] || '';
    const originalContent = options[currentIndex] || '';
    
    const setCurrentIndex = (newIndex: number) => {
      setBrifyOptionIndices(prev => ({
        ...prev,
        [cardKey]: newIndex
      }));
    };
    
    const navigateCard = (direction: 'prev' | 'next') => {
      const totalOptions = options.length;
      let newIndex;
      
      if (direction === 'prev') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalOptions - 1;
      } else {
        newIndex = currentIndex < totalOptions - 1 ? currentIndex + 1 : 0;
      }
      
      setCurrentIndex(newIndex);
    };
    
    return (
      <div className="bg-purple-50 rounded-xl shadow-sm border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <h3 className="text-lg font-semibold text-purple-900">{title}</h3>
              {description && <p className="text-sm text-purple-600">{description}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSaveEdit(editingKey)}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Guardar
                </button>
                <button
                  onClick={() => handleCancelEdit(editingKey, originalContent)}
                  className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(editingKey, currentContent)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                >
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleCopy(currentContent, `${cardKey}-${currentIndex}`)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                >
                  {copiedItem === `${cardKey}-${currentIndex}` ? (
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
              </>
            )}
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateCard('prev')}
            className="flex items-center justify-center w-8 h-8 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            {options.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-purple-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={() => navigateCard('next')}
            className="flex items-center justify-center w-8 h-8 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="border border-purple-200 rounded-lg p-4 bg-white">
          {isEditing ? (
            <textarea
              value={currentContent}
              onChange={(e) => setEditingValues(prev => ({ ...prev, [editingKey]: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
          ) : (
            <p className="text-purple-800 leading-relaxed">{currentContent}</p>
          )}
        </div>
      </div>
    );
  };
  
 // NavigableVisuoCard component for Visuo results
 const NavigableVisuoCard: React.FC<{ 
   title: string; 
   description: string; 
   options: string[]; 
   cardKey: string; 
   color: string;
 }> = ({ title, description, options, cardKey, color }) => {
   const currentIndex = visuoOptionIndices[cardKey] || 0;
   const editingKey = `visuo-${cardKey}-${currentIndex}`;
   const isEditing = editingStates[editingKey];
   const currentContent = editingValues[editingKey] || options[currentIndex] || '';
   const originalContent = options[currentIndex] || '';
   
   const setCurrentIndex = (newIndex: number) => {
     setVisuoOptionIndices(prev => ({ ...prev, [cardKey]: newIndex }));
   };
   
   const navigateCard = (direction: 'prev' | 'next') => {
     const totalOptions = options.length;
     let newIndex;
     
     if (direction === 'prev') {
       newIndex = currentIndex > 0 ? currentIndex - 1 : totalOptions - 1;
     } else {
       newIndex = currentIndex < totalOptions - 1 ? currentIndex + 1 : 0;
     }
     
     setCurrentIndex(newIndex);
   };
   
   return (
     <div className="bg-emerald-50 rounded-xl shadow-sm border border-emerald-200 p-6">
       <div className="flex items-center justify-between mb-4">
         <div className="flex items-center space-x-3">
           <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
           <div>
             <h3 className="text-lg font-semibold text-emerald-900">{title}</h3>
             <p className="text-sm text-emerald-600">{description}</p>
           </div>
         </div>
         <div className="flex items-center space-x-2">
           {isEditing ? (
             <>
               <button
                 onClick={() => handleSaveEdit(editingKey)}
                 className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200"
               >
                 Guardar
               </button>
               <button
                 onClick={() => handleCancelEdit(editingKey, originalContent)}
                 className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200"
               >
                 Cancelar
               </button>
             </>
           ) : (
             <>
               <button
                 onClick={() => handleEdit(editingKey, currentContent)}
                 className="flex items-center space-x-2 px-3 py-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
               >
                 <span>Editar</span>
               </button>
               <button
                 onClick={() => handleCopy(currentContent, `visuo-${cardKey}-${currentIndex}`)}
                 className="flex items-center space-x-2 px-3 py-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
               >
                 {copiedItem === `visuo-${cardKey}-${currentIndex}` ? (
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
             </>
           )}
         </div>
       </div>
       
       {/* Navigation Controls */}
       {options.length > 1 && (
         <div className="flex items-center justify-between mb-4">
           <button
             onClick={() => navigateCard('prev')}
             className="flex items-center justify-center w-8 h-8 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors duration-200"
           >
             <ChevronLeft className="w-5 h-5" />
           </button>
           
           <div className="flex items-center space-x-2">
             {options.map((_, index) => (
               <button
                 key={index}
                 onClick={() => setCurrentIndex(index)}
                 className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                   index === currentIndex ? 'bg-emerald-500' : 'bg-gray-300 hover:bg-gray-400'
                 }`}
               />
             ))}
           </div>
           
           <button
             onClick={() => navigateCard('next')}
             className="flex items-center justify-center w-8 h-8 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors duration-200"
           >
             <ChevronRight className="w-5 h-5" />
           </button>
         </div>
       )}
       
       <div className="border border-emerald-200 rounded-lg p-4 bg-white">
         {isEditing ? (
           <textarea
             value={currentContent}
             onChange={(e) => setEditingValues(prev => ({ ...prev, [editingKey]: e.target.value }))}
             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
             rows={4}
           />
         ) : (
           <p className="text-emerald-800 leading-relaxed">{currentContent}</p>
         )}
       </div>
     </div>
   );
 };
 
 // NavigableAdaptiaCard component for Adaptia results
 const NavigableAdaptiaCard: React.FC<{ 
   title: string; 
   items: any[]; 
   platformKey: string; 
   color?: string;
   isLanding?: boolean;
 }> = ({ title, items, platformKey, color = 'blue', isLanding = false }) => {
   const currentIndex = adaptiaOptionIndices[platformKey] || 0;
   const currentItem = items[currentIndex] || items[0];
   const editingKey = `adaptia-${platformKey}-${currentIndex}`;
   const isEditing = editingStates[editingKey];
   const editingFields = isLanding ? ['titulo', 'Support_text'] : ['objective', 'format', 'caption', 'visualSuggestion', 'hashtags'];
   
   const setCurrentIndex = (newIndex: number) => {
     setAdaptiaOptionIndices(prev => ({
       ...prev,
       [platformKey]: newIndex
     }));
   };
   
   const navigateCard = (direction: 'prev' | 'next') => {
     const totalOptions = items.length;
     let newIndex;
     
     if (direction === 'prev') {
       newIndex = currentIndex > 0 ? currentIndex - 1 : totalOptions - 1;
     } else {
       newIndex = currentIndex < totalOptions - 1 ? currentIndex + 1 : 0;
     }
     
     setCurrentIndex(newIndex);
   };
   
   const handleEditAdaptia = () => {
     setEditingStates(prev => ({ ...prev, [editingKey]: true }));
     editingFields.forEach(field => {
       const fieldKey = `${editingKey}-${field}`;
       if (!editingValues[fieldKey]) {
         setEditingValues(prev => ({ 
           ...prev, 
           [fieldKey]: currentItem[field] || '' 
         }));
       }
     });
   };

   const handleSaveAdaptia = () => {
     setEditingStates(prev => ({ ...prev, [editingKey]: false }));
   };

   const handleCancelAdaptia = () => {
     setEditingStates(prev => ({ ...prev, [editingKey]: false }));
     editingFields.forEach(field => {
       const fieldKey = `${editingKey}-${field}`;
       setEditingValues(prev => ({ 
         ...prev, 
         [fieldKey]: currentItem[field] || '' 
       }));
     });
   };
   
   if (!currentItem) return null;
   
   return (
     <div className={`bg-${color}-50 rounded-xl shadow-sm border border-${color}-200 p-6`}>
       <div className="flex items-center justify-between mb-4">
         <div className="flex items-center space-x-3">
           <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
           <div>
             <h3 className={`text-lg font-semibold text-${color}-900`}>{title}</h3>
             <p className={`text-sm text-${color}-600`}>Contenido adaptado para {title.toLowerCase()}</p>
           </div>
         </div>
         <div className="flex items-center space-x-2">
           {isEditing ? (
             <>
               <button
                 onClick={handleSaveAdaptia}
                 className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200"
               >
                 Guardar
               </button>
               <button
                 onClick={handleCancelAdaptia}
                 className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200"
               >
                 Cancelar
               </button>
             </>
           ) : (
             <>
               <button
                 onClick={handleEditAdaptia}
                 className={`flex items-center space-x-2 px-3 py-1.5 text-sm text-${color}-600 hover:text-${color}-700 hover:bg-${color}-100 rounded-lg transition-colors duration-200`}
               >
                 <span>Editar</span>
               </button>
               <button
                 onClick={() => {
                   const textToCopy = isLanding 
                     ? `${currentItem.titulo}\n\n${currentItem.Support_text}`
                     : `${currentItem.objective}\n\n${currentItem.caption}\n\n${currentItem.hashtags}`;
                   handleCopy(textToCopy, `${platformKey}-${currentIndex}`);
                 }}
                 className={`flex items-center space-x-2 px-3 py-1.5 text-sm text-${color}-600 hover:text-${color}-700 hover:bg-${color}-100 rounded-lg transition-colors duration-200`}
               >
                 {copiedItem === `${platformKey}-${currentIndex}` ? (
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
             </>
           )}
         </div>
       </div>
       
       {/* Navigation Controls */}
       {items.length > 1 && (
         <div className="flex items-center justify-between mb-4">
           <button
             onClick={() => navigateCard('prev')}
             className={`flex items-center justify-center w-8 h-8 text-${color}-400 hover:text-${color}-600 hover:bg-${color}-50 rounded-full transition-colors duration-200`}
           >
             <ChevronLeft className="w-5 h-5" />
           </button>
           
           <div className="flex items-center space-x-2">
             {items.map((_, index) => (
               <button
                 key={index}
                 onClick={() => setCurrentIndex(index)}
                 className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                   index === currentIndex ? `bg-${color}-500` : 'bg-gray-300 hover:bg-gray-400'
                 }`}
               />
             ))}
           </div>
           
           <button
             onClick={() => navigateCard('next')}
             className={`flex items-center justify-center w-8 h-8 text-${color}-400 hover:text-${color}-600 hover:bg-${color}-50 rounded-full transition-colors duration-200`}
           >
             <ChevronRight className="w-5 h-5" />
           </button>
         </div>
       )}
       
       <div className={`border border-${color}-200 rounded-lg p-4 bg-white`}>
         <div className="flex items-center justify-between mb-3">
         </div>
         
         {isLanding ? (
           <div className="space-y-3">
             <div>
               <h5 className={`font-medium text-${color}-800 mb-1`}>Título:</h5>
               {isEditing ? (
                 <input
                   type="text"
                   value={editingValues[`${editingKey}-titulo`] || currentItem.titulo}
                   onChange={(e) => setEditingValues(prev => ({ ...prev, [`${editingKey}-titulo`]: e.target.value }))}
                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className={`text-${color}-700`}>{editingValues[`${editingKey}-titulo`] || currentItem.titulo}</p>
               )}
             </div>
             <div>
               <h5 className={`font-medium text-${color}-800 mb-1`}>Texto de soporte:</h5>
               {isEditing ? (
                 <textarea
                   value={editingValues[`${editingKey}-Support_text`] || currentItem.Support_text}
                   onChange={(e) => setEditingValues(prev => ({ ...prev, [`${editingKey}-Support_text`]: e.target.value }))}
                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                   rows={3}
                 />
               ) : (
                 <p className={`text-${color}-700 leading-relaxed`}>{editingValues[`${editingKey}-Support_text`] || currentItem.Support_text}</p>
               )}
             </div>
           </div>
         ) : (
           <div className="space-y-3">
             <div>
               <h5 className={`font-medium text-${color}-800 mb-1`}>Objetivo:</h5>
               {isEditing ? (
                 <input
                   type="text"
                   value={editingValues[`${editingKey}-objective`] || currentItem.objective}
                   onChange={(e) => setEditingValues(prev => ({ ...prev, [`${editingKey}-objective`]: e.target.value }))}
                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className={`text-${color}-700`}>{editingValues[`${editingKey}-objective`] || currentItem.objective}</p>
               )}
             </div>
             <div>
               <h5 className={`font-medium text-${color}-800 mb-1`}>Formato:</h5>
               {isEditing ? (
                 <input
                   type="text"
                   value={editingValues[`${editingKey}-format`] || currentItem.format}
                   onChange={(e) => setEditingValues(prev => ({ ...prev, [`${editingKey}-format`]: e.target.value }))}
                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className={`text-${color}-700`}>{editingValues[`${editingKey}-format`] || currentItem.format}</p>
               )}
             </div>
             <div>
               <h5 className={`font-medium text-${color}-800 mb-1`}>Caption:</h5>
               {isEditing ? (
                 <textarea
                   value={editingValues[`${editingKey}-caption`] || currentItem.caption}
                   onChange={(e) => setEditingValues(prev => ({ ...prev, [`${editingKey}-caption`]: e.target.value }))}
                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                   rows={3}
                 />
               ) : (
                 <p className={`text-${color}-700 leading-relaxed`}>{editingValues[`${editingKey}-caption`] || currentItem.caption}</p>
               )}
             </div>
             <div>
               <h5 className={`font-medium text-${color}-800 mb-1`}>Sugerencia Visual:</h5>
               {isEditing ? (
                 <input
                   type="text"
                   value={editingValues[`${editingKey}-visualSuggestion`] || currentItem.visualSuggestion}
                   onChange={(e) => setEditingValues(prev => ({ ...prev, [`${editingKey}-visualSuggestion`]: e.target.value }))}
                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className={`text-${color}-700`}>{editingValues[`${editingKey}-visualSuggestion`] || currentItem.visualSuggestion}</p>
               )}
             </div>
             <div>
               <h5 className={`font-medium text-${color}-800 mb-1`}>Hashtags:</h5>
               {isEditing ? (
                 <input
                   type="text"
                   value={editingValues[`${editingKey}-hashtags`] || currentItem.hashtags}
                   onChange={(e) => setEditingValues(prev => ({ ...prev, [`${editingKey}-hashtags`]: e.target.value }))}
                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className={`text-${color}-700`}>{editingValues[`${editingKey}-hashtags`] || currentItem.hashtags}</p>
               )}
             </div>
           </div>
         )}
       </div>
     </div>
   );
 };
 
  const OutputCard: React.FC<{ title: string; content: string; itemKey: string; icon?: React.ReactNode; description?: string }> = ({ title, content, itemKey, icon, description }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
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
  
  const handleProjectsClick = () => {
    setCurrentScreen('projects');
    onScreenChange('projects');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Bienvenido,</span>
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Feature Input Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Describe tu Feature</h2>
              <p className="text-gray-600">Ingresa una descripción detallada del feature que deseas desarrollar</p>
            </div>
            
            <textarea
              value={featureText}
              onChange={(e) => setFeatureText(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Ejemplo: Nueva función de chat en tiempo real que permite a los usuarios comunicarse instantáneamente con soporte técnico..."
            />
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">{featureText.length} / 2000</span>
              <button
                onClick={handleStartBrify}
                disabled={!featureText.trim()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Play className="w-4 h-4 inline mr-2" />
                Comenzar
              </button>
            </div>
          </div>

          {/* BRIFY SECTION */}
          {/* Brify Loading State */}
          {brifyLoading && (
            <div id="brify-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Procesando con IA...</h3>
                <p className="text-gray-600 text-center max-w-md">
                  Estamos analizando tu feature y generando el brief creativo completo. Esto puede tomar unos momentos.
                </p>
              </div>
            </div>
          )}

          {/* Brify Error State */}
          {brifyError && (
            <div id="brify-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-red-900">Error al procesar</h3>
                </div>
                <p className="text-red-700 mb-4">{brifyError}</p>
                <button
                  onClick={handleStartBrify}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {brifyData && !brifyLoading && !brifyError && (
            <div id="brify-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Brify - Brief Creativo
                </h2>
                <p className="text-gray-600">Brief completo con beneficios y prompts visuales</p>
              </div>

              {/* Benefits Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-purple-900">Beneficios Identificados</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <NavigableOutputCard
                    title="Beneficio Funcional"
                    description="Funcionalidad práctica del feature"
                    options={brifyData.options.map(opt => opt.funcional)}
                    cardKey="funcional"
                    icon={<div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                  />
                  <NavigableOutputCard
                    title="Beneficio Económico"
                    description="Valor económico del feature"
                    options={brifyData.options.map(opt => opt.económico)}
                    cardKey="economico"
                    icon={<div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                  />
                  <NavigableOutputCard
                    title="Beneficio Emocional"
                    description="Impacto emocional del feature"
                    options={brifyData.options.map(opt => opt.emocional)}
                    cardKey="emocional"
                    icon={<div className="w-3 h-3 bg-pink-500 rounded-full"></div>}
                  />
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-purple-900">Call to Action</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <NavigableOutputCard
                    title="Mensaje Comercial"
                    description="Mensaje principal de venta"
                    options={brifyData.options.map(opt => opt.mensaje_comercial)}
                    cardKey="mensaje"
                    icon={<div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
                  />
                  <NavigableOutputCard
                    title="Call to Action"
                    description="Llamada a la acción optimizada"
                    options={brifyData.options.map(opt => opt.CTA)}
                    cardKey="cta"
                    icon={<div className="w-3 h-3 bg-red-500 rounded-full"></div>}
                  />
                </div>
              </div>

              {/* Visual Prompts Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-purple-900">Prompt Visual</h3>
                <div className="grid grid-cols-1 gap-6">
                  <NavigableOutputCard
                    title="Prompt Visual"
                    description="Descripción visual para generar imágenes"
                    options={brifyData.options.map(opt => opt.visual)}
                    cardKey="visual"
                    icon={<div className="w-3 h-3 bg-purple-500 rounded-full"></div>}
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-8">
                {/* Save Message */}
                {saveMessage && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    saveMessage.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    <div className="flex items-center">
                      {saveMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 mr-3" />
                      ) : (
                        <XCircle className="w-5 h-5 mr-3" />
                      )}
                      <p>{saveMessage.message}</p>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleRefreshBrify}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Generar Nuevo
                </button>
                <button 
                  onClick={handleStartVisuo}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
                >
                  <Wand2 className="w-4 h-4 inline mr-2" />
                  Continuar con Visuo
                </button>
                <button 
                  onClick={handleStartAdaptia}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Continuar con Adaptia
                </button>
              </div>
            </div>
          )}

          {/* VISUO SECTION */}
          {/* Visuo Loading State */}
          {visuoLoading && (
            <div id="visuo-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generando prompts visuales...</h3>
                <p className="text-gray-600 text-center max-w-md">
                  Estamos creando prompts optimizados para diferentes estilos visuales. Esto puede tomar unos momentos.
                </p>
              </div>
            </div>
          )}

          {/* Visuo Error State */}
          {visuoError && (
            <div id="visuo-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-red-900">Error al procesar</h3>
                </div>
                <p className="text-red-700 mb-4">{visuoError}</p>
                <button
                  onClick={handleStartVisuo}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {visuoData && !visuoLoading && !visuoError && (
            <div id="visuo-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  <Wand2 className="w-6 h-6 inline mr-2 text-emerald-600" />
                  Visuo - Prompts Visuales
                </h2>
                <p className="text-gray-600">Prompts optimizados para diferentes modelos de IA</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-emerald-900">Prompts Visuales por Modelo</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {visuoData.getPromptTypes().map((promptType) => (
                    <NavigableVisuoCard
                      key={promptType.key}
                      title={promptType.name}
                      description={promptType.description}
                      options={visuoData.getPrompt(promptType.key as keyof typeof visuoData.prompts)}
                      cardKey={promptType.key}
                      color={promptType.color}
                    />
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-8">
                <button 
                  onClick={handleRefreshVisuo}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Generar Nuevo
                </button>
                <button 
                  onClick={handleStartAdaptia}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Continuar con Adaptia
                </button>
              </div>
            </div>
          )}

          {/* 🎯 ADAPTIA SECTION SHOULD BE HERE */}
          {adaptiaFormOpen && (
            <div id="adaptia-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Adaptia - Contenido Adaptado
                </h2>
                <p className="text-gray-600">Adapta tu contenido para múltiples redes sociales</p>
              </div>

              {/* Video Script Input */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  Guión de Video
                </label>
                <p className="text-gray-600 text-sm mb-4">
                  Contenido base para adaptar a diferentes plataformas
                </p>
                <textarea
                  value={adaptiaVideoScript}
                  onChange={(e) => setAdaptiaVideoScript(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Ingresa el guión de video..."
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">{adaptiaVideoScript.length} / 3000</span>
                </div>
              </div>

              {/* Media Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Seleccionar Plataformas</h3>
                    <p className="text-gray-600 text-sm mt-1">Elige las plataformas para adaptar el contenido</p>
                  </div>
                  <button
                    onClick={handleSelectAllMedia}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {adaptiaSelectedMedia.length === mediaOptions.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {mediaOptions.map((media) => (
                    <label key={media.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adaptiaSelectedMedia.includes(media.key)}
                        onChange={() => handleAdaptiaMediaChange(media.key)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-900 font-medium">{media.name}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {adaptiaSelectedMedia.length} plataforma{adaptiaSelectedMedia.length !== 1 ? 's' : ''} seleccionada{adaptiaSelectedMedia.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={handleGenerateAdaptia}
                    disabled={adaptiaSelectedMedia.length === 0 || !adaptiaVideoScript.trim() || adaptiaLoading}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {adaptiaLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generando...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Generar Contenido</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Adaptia Loading State */}
              {adaptiaLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptando contenido...</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Estamos optimizando tu contenido para los medios seleccionados. Esto puede tomar unos momentos.
                  </p>
                </div>
              )}

              {/* Results Display */}
              {adaptiaData && !adaptiaLoading && !adaptiaError && (
                <div className="mt-8" id="adaptia-results">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-blue-900">Contenido Adaptado por Plataforma</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {adaptiaData.getSelectedMediaResults().map((media: any) => (
                        <NavigableAdaptiaCard
                          key={media.key}
                          title={media.name}
                          items={media.content}
                          platformKey={media.key}
                          color={media.color}
                          isLanding={media.isLanding}
                        />
                      ))}
                    </div>
                  </div>
                  {saveMessage && (
                    <div className={`mt-6 p-4 rounded-lg text-center ${
                      saveMessage.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center justify-center">
                        {saveMessage.type === 'success' ? (
                          <CheckCircle className="w-5 h-5 mr-3" />
                        ) : (
                          <XCircle className="w-5 h-5 mr-3" />
                        )}
                        <p className="font-medium">{saveMessage.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {/*
                  <div className="flex justify-center space-x-4 pt-8">
                    <button 
                      onClick={handleRefreshAdaptia}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                    >
                      Generar Nuevo
                    </button>
                    <button 
                      onClick={handleSaveData}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200">
                      Guardar Resultados
                    </button>
                  </div>*/}
                  <div className="flex justify-center space-x-4 pt-8">
                    <button 
                      onClick={handleRefreshAdaptia}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                    >
                      Generar Nuevo
                    </button>
                    <button 
                      onClick={handleSaveData}
                      disabled={saveLoading}
                      className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {saveLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          <span>Guardar Resultados</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {adaptiaError && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                    <h4 className="text-lg font-semibold text-red-900">Error al procesar</h4>
                  </div>
                  <p className="text-red-700 mb-4">{adaptiaError}</p>
                  <button
                    onClick={handleGenerateAdaptia}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Reintentar
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="fixed bottom-6 right-6 flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 shadow-lg"
      >
        <LogOut className="w-4 h-4" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};