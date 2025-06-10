import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');

  // L'utilisateur doit avoir un token et être un admin pour accéder à ces routes
  if (!token || userType !== 'admin') {
    // Rediriger vers la page de connexion si non autorisé
    return <Navigate to="/connexion-admin" replace />;
  }

  // Si autorisé, afficher le contenu de la route (par exemple, AdminPortal)
  return <Outlet />;
};

export default ProtectedRoute;
