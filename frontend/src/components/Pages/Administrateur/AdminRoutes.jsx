import React from 'react';
import AdminPortal from './AdminPortal';
import AdminMobileRestriction from './AdminMobileRestriction';

// Composant qui gère la restriction d'accès mobile et redirige vers le portail administrateur sur desktop
const AdminRoutes = () => {
  return (
    <div className="h-screen">
      <div className="block md:hidden">
        <AdminMobileRestriction />
      </div>
      <div className="hidden md:block h-full">
        <AdminPortal />
      </div>
    </div>
  );
};

export default AdminRoutes;
