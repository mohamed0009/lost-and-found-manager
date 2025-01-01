import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Données de test pour simuler une base de données
const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin EMSI",
    email: "admin@emsi.ma",
    password: "Admin123!",
    role: "Admin",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "User EMSI",
    email: "user@emsi.ma",
    password: "User123!",
    role: "User",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          // En cas d'erreur, nettoyer le stockage
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simuler une requête API
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("Identifiants invalides");
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Simuler un token JWT
    const token = btoa(JSON.stringify(userWithoutPassword));
    
    // Sauvegarder les informations
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
  };

  const register = async (name: string, email: string, password: string) => {
    if (mockUsers.some(u => u.email === email)) {
      throw new Error("Cet email est déjà utilisé");
    }

    const newUser: User = {
      id: mockUsers.length + 1,
      name,
      email,
      password,
      role: "User",
      status: "active",
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    
    // Connecter automatiquement après l'inscription
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email: string) => {
    // Implémentez la logique de réinitialisation du mot de passe ici
    // Par exemple, avec Firebase ou votre backend
  };

  const loginWithGoogle = async () => {
    try {
      // Simulation d'une connexion Google
      const mockGoogleUser = {
        id: mockUsers.length + 1,
        name: "Google User",
        email: "google.user@gmail.com",
        role: "User" as "Admin" | "User",
        status: "active",
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        password: ''
      } as User;
      
      setUser(mockGoogleUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(mockGoogleUser));
      localStorage.setItem("token", "google-mock-token");
    } catch (error) {
      throw new Error("Erreur lors de la connexion avec Google");
    }
  };

  const loginWithGithub = async () => {
    try {
      // Simulation d'une connexion GitHub
      const mockGithubUser = {
        id: mockUsers.length + 1,
        name: "GitHub User",
        email: "github.user@github.com",
        role: "User" as "Admin" | "User",
        status: "active",
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        password: ''
      } as User;
      
      setUser(mockGithubUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(mockGithubUser));
      localStorage.setItem("token", "github-mock-token");
    } catch (error) {
      throw new Error("Erreur lors de la connexion avec GitHub");
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        register, 
        logout,
        isLoading,
        resetPassword,
        loginWithGoogle,
        loginWithGithub
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 