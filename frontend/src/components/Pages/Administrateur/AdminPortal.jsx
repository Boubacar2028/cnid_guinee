import React from 'react';

const AdminPortal = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Portail Administrateur</h1>
        <div className="h-1 w-32 bg-purple-500 mx-auto mb-8"></div>
        <div className="flex items-center justify-center mb-8">
          <div className="bg-purple-100 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">En cours de développement</h2>
        <p className="text-gray-600 mb-8">
          Cette section du portail est actuellement en cours de développement. 
          Nous travaillons activement pour vous offrir un outil complet d'administration et de supervision du système.
        </p>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-800 font-medium">
            Revenez bientôt pour découvrir les nouvelles fonctionnalités!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;