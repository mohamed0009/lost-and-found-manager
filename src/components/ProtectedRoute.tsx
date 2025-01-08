import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Définir l'interface pour les props
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

// Définir l'interface pour le contexte d'authentification
interface AuthUser {
  role: string;
  // autres propriétés de l'utilisateur si nécessaire
}

// Composant ProtectedRoute
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Export nommé pour forcer le fichier à être un module
export { ProtectedRoute };

// Export par défaut
export default ProtectedRoute;

// Forcer le fichier à être un module si nécessaire
export {};
