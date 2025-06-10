import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPortal from './AdminPortal';
import AdminLoginPage from './AdminLoginPage';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminMobileRestriction from './AdminMobileRestriction';

const AdminRoutes = () => {
  // Logique pour la restriction mobile peut être appliquée ici ou dans un composant englobant
  // Pour l'instant, on se concentre sur les routes desktop

  // Vérification simple pour l'exemple, à affiner si besoin pour le responsive
  const isMobile = window.innerWidth < 768; 

  if (isMobile) {
    return <AdminMobileRestriction />;
  }

  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminProtectedRoute />}>
        {/* Toutes les routes admin protégées viennent ici */}
        <Route path="dashboard" element={<AdminPortal />} /> 
        {/* Exemple: <Route path="users" element={<AdminUserManagement />} /> */}
        {/* Redirection par défaut pour /admin vers /admin/dashboard si connecté */}
        <Route index element={<Navigate to="dashboard" replace />} /> 
      </Route>
      {/* Redirection par défaut pour /admin si non spécifié et non logué (sera géré par AdminProtectedRoute) */}
      {/* Ou une route par défaut si aucune autre ne correspond et non logué */}
       <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
