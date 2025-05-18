import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AgentPortal from './components/Pages/Agent/AgentPortal';
import AdminPortal from './components/Pages/Administrateur/AdminPortal';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
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
          <Route path="/portail-agents" element={<AgentPortal />} />
          <Route path="/portail-administrateur" element={<AdminPortal />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
