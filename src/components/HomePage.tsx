import React from 'react';
import { Zap } from 'lucide-react';

interface HomePageProps {
  onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fluxia
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-12">
            AI Content Automation Platform
          </p>
          
          {/* Login Button */}
          <button
            onClick={onLoginClick}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Iniciar Sesión
          </button>
          
          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              Powered by Cliengo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;