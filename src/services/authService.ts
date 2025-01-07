import api from "./api";
import TokenService from "./tokenService";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    status: string;
  };
}

class AuthService {
  private static readonly USER_KEY = "user_data";

  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      TokenService.setToken(response.data.token);
      this.saveUserData(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);
      TokenService.setToken(response.data.token);
      this.saveUserData(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  static saveUserData(user: AuthResponse["user"]): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUserData(): AuthResponse["user"] | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  static logout(): void {
    TokenService.removeToken();
    localStorage.removeItem(this.USER_KEY);
  }
}

export default AuthService;
