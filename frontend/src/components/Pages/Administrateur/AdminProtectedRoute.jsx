import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isAdminTokenValid = () => {
  console.log('--- Vérification par AdminProtectedRoute ---');
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.log('Validation échouée: pas de token trouvé.');
    return false;
  }
  console.log('Token trouvé:', token);
  try {
    const decodedToken = jwtDecode(token);
    console.log('Token décodé:', decodedToken);
    // Vérifier si le token n'est pas expiré et si l'utilisateur est un admin
    const currentTime = Date.now() / 1000;
    const isExpired = decodedToken.exp < currentTime;
    console.log(`Vérification expiration: Expiré ? ${isExpired}`);
    if (isExpired) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return false; // Token expiré
    }
    const isAdmin = decodedToken.type_utilisateur === 'admin';
    console.log(`Vérification du type: Est admin ? ${isAdmin} (type trouvé: ${decodedToken.type_utilisateur})`);
    return isAdmin;
  } catch (error) {
    console.error('Erreur de décodage du token:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return false; // Token invalide ou erreur de décodage
  }
};

const AdminProtectedRoute = () => {
  if (!isAdminTokenValid()) {
    // Rediriger vers la page de connexion admin si le token n'est pas valide ou absent
    return <Navigate to="/portail-administrateur/login" replace />;
  }
  // Si le token est valide, rendre le composant enfant (Outlet rendra la route protégée)
  return <Outlet />;
};

export default AdminProtectedRoute;
