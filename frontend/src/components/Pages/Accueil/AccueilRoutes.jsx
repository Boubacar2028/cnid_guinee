import React from 'react';
import ImageCarousel from './ImageCarousel';
import InformationsImportantes from './InformationsImportantes';
import StatisticsSection from './StatisticsSection';
import WelcomeSection from './WelcomeSection';
import PortalsSection from './PortalsSection';
import TestimonialsSection from './TestimonialsSection';
import FaqSection from './FaqSection';
import ChatBox from './ChatBox';

const AccueilRoutes = () => {
  return (
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
  );
};

export default AccueilRoutes;
