import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Pages/Constantes/Header';
import Footer from './components/Pages/Constantes/Footer';
import AccueilRoutes from './components/Pages/Accueil/AccueilRoutes';
import AgentRoutes from './components/Pages/Agent/AgentRoutes';
import AdminPortal from './components/Pages/Administrateur/AdminPortal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLogin from './components/auth/AdminLogin';
import AuthPage from './components/auth/AuthPage';

// Import des composants du portail citoyen
import CitoyensPortal from './components/Pages/Citoyens/CitoyensPortal';
import BiometriePage from './components/Pages/Citoyens/BiometriePage';
import NouvelleDemandePage from './components/Pages/Citoyens/NouvelleDemandePage';
import HistoriquePage from './components/Pages/Citoyens/HistoriquePage';
import AidePage from './components/Pages/Citoyens/AidePage';
import ProfilePage from './components/Pages/Citoyens/ProfilePage';
import DemandeDetailPage from './components/Pages/Citoyens/DemandeDetailPage'; // Ajout de l'import

// Composant pour gérer l'affichage conditionnel du header
const AppContent = () => {
  const location = useLocation();
  
  // Détecter si nous sommes dans une section de portail
  const isInPortalSection = 
    location.pathname.startsWith('/portail-citoyens') ||
    location.pathname.startsWith('/portail-agents') ||
    location.pathname.startsWith('/portail-administrateur');
  
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
      {!isInPortalSection && !isAuthPage && <Header />}
      <Routes>
          <Route path="/" element={<AccueilRoutes />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Routes du portail citoyen */}
          <Route path="/portail-citoyens" element={<CitoyensPortal />} />
          <Route path="/portail-citoyens/biometrie" element={<BiometriePage />} />
          <Route path="/portail-citoyens/nouvelle-demande" element={<NouvelleDemandePage />} />
          <Route path="/portail-citoyens/historique" element={<HistoriquePage />} />
          <Route path="/portail-citoyens/aide" element={<AidePage />} />
          <Route path="/portail-citoyens/profil" element={<ProfilePage />} />
          <Route path="/portail-citoyens/demandes/:demandeId" element={<DemandeDetailPage />} /> {/* Nouvelle route pour les détails de la demande */}
          
          {/* Routes pour les autres portails */}
          <Route path="/portail-agents/*" element={<AgentRoutes />} />
          <Route path="/connexion-admin" element={<AdminLogin />} />

          {/* Route protégée pour le portail administrateur */}
          <Route element={<ProtectedRoute />}>
                        <Route path="/portail-administrateur/*" element={<AdminPortal />} />
          </Route>
          <Route path="/dashboard" element={<Navigate to="/portail-agents" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isInPortalSection && !isAuthPage && <Footer />}
      </div>
  );
};

function App() {
  return (
    <div className="App overflow-x-hidden">
      <Router>
      <AppContent />
    </Router>
    </div>
  );
}

export default App;
