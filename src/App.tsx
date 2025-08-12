import React from 'react';
import { HomePage } from './views/HomePage';
import { LoginScreen } from './views/LoginScreen';
import { MainApp } from './views/MainApp';
import { AppController, AppScreen } from './controllers/AppController';
import { User } from './models/User';

function App() {
  const [appController] = React.useState(() => AppController.getInstance());
  const [currentScreen, setCurrentScreen] = React.useState<AppScreen>(() => 
    appController.getInitialScreen()
  );
  const [user, setUser] = React.useState<User | null>(() => appController.getUser());

  const handleLoginClick = () => {
    setCurrentScreen('login');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setCurrentScreen('app');
  };

  const handleLogout = () => {
    appController.logout();
    setUser(null);
    setCurrentScreen('home');
  };

  // Check session expiry (24 hours)
  React.useEffect(() => {
    const checkSessionExpiry = () => {
      if (appController.checkSessionExpiry()) {
        handleLogout();
    };
    }

    // Check immediately
    checkSessionExpiry();
    
    // Check every 5 minutes
    const interval = setInterval(checkSessionExpiry, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  if (currentScreen === 'home') {
    return <HomePage onLoginClick={handleLoginClick} />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        appController={appController}
        onBack={handleBackToHome} 
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (['app', 'brify', 'adaptia', 'visuo', 'projects'].includes(currentScreen) && appController.isAuthenticated() && user) {
    return (
      <MainApp 
        appController={appController}
        onLogout={handleLogout} 
        onScreenChange={setCurrentScreen}
      />
    );
  }

  // Fallback to home if something goes wrong
  return <HomePage onLoginClick={handleLoginClick} />;
}

export default App;