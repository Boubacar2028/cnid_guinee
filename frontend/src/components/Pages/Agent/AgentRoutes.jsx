import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AgentPortal from './AgentPortal';
import AgentLoginPage from './AgentLoginPage';
import AgentProtectedRoute from './AgentProtectedRoute';

const AgentRoutes = () => {
  return (
    <Routes>
      <Route path="connexion" element={<AgentLoginPage />} />
      <Route 
        path="/*" 
        element={
          <AgentProtectedRoute>
            <AgentPortal />
          </AgentProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AgentRoutes;
