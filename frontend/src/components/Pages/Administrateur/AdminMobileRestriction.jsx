import React from 'react';
import { Link } from 'react-router-dom';

const AdminMobileRestriction = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès restreint</h1>
        <p className="text-gray-600 mb-6">
          Le portail administrateur n'est accessible que sur ordinateur. 
          Veuillez vous connecter depuis un appareil avec un écran plus large.
        </p>
        <Link 
          to="/" 
          className="inline-block px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default AdminMobileRestriction;
