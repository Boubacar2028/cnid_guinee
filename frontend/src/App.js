import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Pages/Constantes/Header';
import Footer from './components/Pages/Constantes/Footer';
import ImageCarousel from './components/Pages/Accueil/ImageCarousel';
import InformationsImportantes from './components/Pages/Accueil/InformationsImportantes';
import StatisticsSection from './components/Pages/Accueil/StatisticsSection';
import WelcomeSection from './components/Pages/Accueil/WelcomeSection';
import PortalsSection from './components/Pages/Accueil/PortalsSection';
import TestimonialsSection from './components/Pages/Accueil/TestimonialsSection';
import FaqSection from './components/Pages/Accueil/FaqSection';
import ChatBox from './components/Pages/Accueil/ChatBox';
import CitoyensPortal from './components/Pages/Citoyens/CitoyensPortal';
import BiometriePage from './components/Pages/Citoyens/BiometriePage';
import NouvelleDemandePage from './components/Pages/Citoyens/NouvelleDemandePage';
import HistoriquePage from './components/Pages/Citoyens/HistoriquePage';
import AidePage from './components/Pages/Citoyens/AidePage';
import ProfilePage from './components/Pages/Citoyens/ProfilePage';
import AgentPortal from './components/Pages/Agent/AgentPortal';
import AdminPortal from './components/Pages/Administrateur/AdminPortal';

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
    '/profil'
  ];
  const isInCitoyenSection = citoyenPaths.some(path => location.pathname.includes(path));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!isInCitoyenSection && <Header />}
      <Routes>
          <Route path="/" element={
            <>
              <ImageCarousel />
              <InformationsImportantes />
              <StatisticsSection />
              <WelcomeSection />
              <PortalsSection />
              <TestimonialsSection />
              <FaqSection />
              <ChatBox />
            </>
          } />
          <Route path="/portail-citoyens" element={<CitoyensPortal />} />
          <Route path="/biometrie" element={<BiometriePage />} />

          <Route path="/nouvelle-demande" element={<NouvelleDemandePage />} />
          <Route path="/historique" element={<HistoriquePage />} />
          <Route path="/aide" element={<AidePage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/portail-agents" element={<AgentPortal />} />
          <Route path="/portail-administrateur" element={<AdminPortal />} />
        </Routes>
        <Footer />
      </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
