import React from 'react';

const CitoyensPortal = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Portail Citoyens</h1>
        <div className="h-1 w-32 bg-green-500 mx-auto mb-8"></div>
        <div className="flex items-center justify-center mb-8">
          <div className="bg-green-100 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">En cours de développement</h2>
        <p className="text-gray-600 mb-8">
          Cette section du portail est actuellement en cours de développement. 
          Nous travaillons activement pour vous offrir un service de qualité pour vos démarches administratives en ligne.
        </p>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800 font-medium">
            Revenez bientôt pour découvrir les nouvelles fonctionnalités!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CitoyensPortal;