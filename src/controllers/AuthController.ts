import { User } from '../models/User';

export interface LoginResponse {
  verification: 'success' | 'wrongEmail' | 'wrongPassword';
  user?: any;
}

export class AuthController {
  private static instance: AuthController;
  private user: User | null = null;
  private isAuthenticated: boolean = false;

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch('https://workflow-platform.cliengo.com/webhook/fluxia/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData: LoginResponse = await response.json();

      switch (responseData.verification) {
        case 'success':
          if (responseData.user) {
            this.user = User.fromApiResponse(responseData.user);
            this.isAuthenticated = true;
            this.saveToStorage();
            return { success: true, user: this.user };
          }
          return { success: false, error: 'Datos de usuario inválidos' };
        
        case 'wrongEmail':
          return { success: false, error: 'El email ingresado no está registrado' };
        
        case 'wrongPassword':
          return { success: false, error: 'La contraseña es incorrecta' };
        
        default:
          return { success: false, error: 'Error desconocido en el servidor' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error de conexión' 
      };
    }
  }

  public logout(): void {
    this.user = null;
    this.isAuthenticated = false;
    this.clearStorage();
  }

  public getUser(): User | null {
    return this.user;
  }

  public isUserAuthenticated(): boolean {
    return this.isAuthenticated && this.user !== null;
  }

  public checkSessionExpiry(): boolean {
    const loginTime = localStorage.getItem('fluxia_login_time');
    if (loginTime) {
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const isExpired = Date.now() - parseInt(loginTime) > twentyFourHours;
      
      if (isExpired) {
        this.logout();
        return true;
      }
    }
    return false;
  }

  private saveToStorage(): void {
    if (this.user) {
      localStorage.setItem('fluxia_authenticated', 'true');
      localStorage.setItem('fluxia_user', JSON.stringify(this.user.toJSON()));
      localStorage.setItem('fluxia_login_time', Date.now().toString());
    }
  }

  private loadFromStorage(): void {
    const savedAuth = localStorage.getItem('fluxia_authenticated');
    const savedUser = localStorage.getItem('fluxia_user');

    if (savedAuth === 'true' && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        this.user = User.fromApiResponse(userData);
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('fluxia_authenticated');
    localStorage.removeItem('fluxia_user');
    localStorage.removeItem('fluxia_login_time');
  }
}