import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Pages/Constantes/Header';
import Footer from './components/Pages/Constantes/Footer';
import ImageCarousel from './components/Pages/Accueil/ImageCarousel';
import InformationsImportantes from './components/Pages/Accueil/InformationsImportantes';
import StatisticsSection from './components/Pages/Accueil/StatisticsSection';
import WelcomeSection from './components/Pages/Accueil/WelcomeSection';
import PortalsSection from './components/Pages/Accueil/PortalsSection';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <ImageCarousel />
        <InformationsImportantes />
        <StatisticsSection />
        <WelcomeSection />
        <PortalsSection />
        <main className="flex-grow">
          {/* Le contenu principal commence ici */}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
