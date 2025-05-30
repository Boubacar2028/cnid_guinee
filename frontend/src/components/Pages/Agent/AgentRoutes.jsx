import React from 'react';
import AgentPortal from './AgentPortal';

// Composant qui gère la restriction d'accès mobile et redirige vers le portail agent sur desktop
const AgentRoutes = () => {
  return (
    <div className="h-screen">
      <AgentPortal />
    </div>
  );
};

export default AgentRoutes;
