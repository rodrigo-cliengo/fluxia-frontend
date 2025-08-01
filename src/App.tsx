import React from 'react';
import HomePage from './components/HomePage';
import LoginScreen from './components/LoginScreen';
import MainApp from './components/MainApp';

interface Project {
  projectName: string;
  projectId: string;
  projectDetails: {
    companyInformation: string;
  };
}

interface User {
  name: string;
  projects: Project[];
}

function App() {
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'login' | 'app'>('home');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  const handleLoginClick = () => {
    setCurrentScreen('login');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleLoginSuccess = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentScreen('app');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentScreen('home');
  };

  if (currentScreen === 'home') {
    return <HomePage onLoginClick={handleLoginClick} />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen 
        onBack={handleBackToHome} 
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentScreen === 'app' && isAuthenticated && user) {
    return <MainApp user={user} onLogout={handleLogout} />;
  }

  // Fallback to home if something goes wrong
  return <HomePage onLoginClick={handleLoginClick} />;
}

export default App;