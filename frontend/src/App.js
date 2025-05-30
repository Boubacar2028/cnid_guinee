import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Pages/Constantes/Header';
import Footer from './components/Pages/Constantes/Footer';
import AccueilRoutes from './components/Pages/Accueil/AccueilRoutes';
import CitoyenRoutes from './components/Pages/Citoyens/CitoyenRoutes';
import AgentRoutes from './components/Pages/Agent/AgentRoutes';
import AdminRoutes from './components/Pages/Administrateur/AdminRoutes';

// Composant pour gérer l'affichage conditionnel du header
const AppContent = () => {
  const location = useLocation();
  const citoyenPaths = [
    '/portail-citoyens',
    '/biometrie',
    '/tableau-de-bord',
    '/nouvelle-demande',
    '/historique',
    '/aide',
    '/profil',
    '/portail-agents',
    '/portail-administrateur'
  ];
  const isInCitoyenSection = citoyenPaths.some(path => location.pathname.includes(path));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
      {!isInCitoyenSection && <Header />}
      <Routes>
          <Route path="/" element={<AccueilRoutes />} />
          <Route path="/portail-citoyens/*" element={<CitoyenRoutes />} />
          <Route path="/portail-agents" element={<AgentRoutes />} />
          <Route path="/portail-administrateur" element={<AdminRoutes />} />
        </Routes>
        {!isInCitoyenSection && <Footer />}
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
