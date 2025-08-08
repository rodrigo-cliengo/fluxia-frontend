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
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    const savedAuth = localStorage.getItem('fluxia_authenticated');
    return savedAuth === 'true';
  });
  const [user, setUser] = React.useState<User | null>(() => {
    const savedUser = localStorage.getItem('fluxia_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Set initial screen based on authentication state
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentScreen('app');
    }
  }, [isAuthenticated, user]);

  const handleLoginClick = () => {
    setCurrentScreen('login');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleLoginSuccess = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    
    // Persist session data
    localStorage.setItem('fluxia_authenticated', 'true');
    localStorage.setItem('fluxia_user', JSON.stringify(userData));
    localStorage.setItem('fluxia_login_time', Date.now().toString());
    
    setCurrentScreen('app');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear session data
    localStorage.removeItem('fluxia_authenticated');
    localStorage.removeItem('fluxia_user');
    localStorage.removeItem('fluxia_login_time');
    
    setCurrentScreen('home');
  };

  // Check session expiry (24 hours)
  React.useEffect(() => {
    const checkSessionExpiry = () => {
      const loginTime = localStorage.getItem('fluxia_login_time');
      if (loginTime) {
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const isExpired = Date.now() - parseInt(loginTime) > twentyFourHours;
        
        if (isExpired) {
          console.log('Session expired, logging out user');
          handleLogout();
        }
      }
    };

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