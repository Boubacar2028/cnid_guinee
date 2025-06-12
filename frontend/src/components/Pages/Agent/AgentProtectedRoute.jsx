import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AgentProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('access_token');

  const handleLogoutAndRedirect = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user_type');
    return <Navigate to="/portail-agents/connexion" state={{ from: location }} replace />;
  };

  if (!token) {
    return <Navigate to="/portail-agents/connexion" state={{ from: location }} replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userType = decodedToken.type_utilisateur;
    const currentTime = Date.now() / 1000; // en secondes

    // Vérifier si le token est expiré
    if (decodedToken.exp < currentTime) {
      console.error("Token expiré, déconnexion.");
      return handleLogoutAndRedirect();
    }

    if (userType === 'agent') {
      return children;
    } else {
      console.error("Type d'utilisateur non autorisé, déconnexion.");
      return handleLogoutAndRedirect();
    }
  } catch (error) {
    console.error("Token invalide, déconnexion.", error);
    return handleLogoutAndRedirect();
  }
};

export default AgentProtectedRoute;
