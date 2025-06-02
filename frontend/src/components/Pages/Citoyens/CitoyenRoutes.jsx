import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CitoyensPortal from './CitoyensPortal';
import BiometriePage from './BiometriePage';
import NouvelleDemandePage from './NouvelleDemandePage';
import HistoriquePage from './HistoriquePage';
import AidePage from './AidePage';
import ProfilePage from './ProfilePage';

const CitoyenRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CitoyensPortal />} />
      <Route path="/biometrie" element={<BiometriePage />} />
      <Route path="/nouvelle-demande" element={<NouvelleDemandePage />} />
      <Route path="/historique" element={<HistoriquePage />} />
      <Route path="/aide" element={<AidePage />} />
      <Route path="/profil" element={<ProfilePage />} />
      {/* Route par défaut vers le tableau de bord */}
      <Route path="*" element={<Navigate to="/portail-citoyens" replace />} />
    </Routes>
  );
};

export default CitoyenRoutes;
