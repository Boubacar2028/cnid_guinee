import React from 'react';

const AgentPortal = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Portail Agents</h1>
        <div className="h-1 w-32 bg-blue-500 mx-auto mb-8"></div>
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">En cours de développement</h2>
        <p className="text-gray-600 mb-8">
          Cette section du portail est actuellement en cours de développement. 
          Nous travaillons activement pour vous offrir un outil efficace pour le traitement des demandes.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium">
            Revenez bientôt pour découvrir les nouvelles fonctionnalités!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentPortal;