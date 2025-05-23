import React from 'react';
import CitoyenHeader from './CitoyenHeader';
import { Link, useNavigate } from 'react-router-dom';

const CitoyensPortal = () => {
  const navigate = useNavigate();

  return (
    <>
      <CitoyenHeader />
      <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête du tableau de bord */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">Bienvenue, Boubacar Bah</p>
            </div>
            <button
              onClick={() => navigate('/nouvelle-demande')}
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center sm:justify-start"
            >
              <span className="mr-1">+</span> Nouvelle demande
            </button>
          </div>

          {/* Contenu principal - deux colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2 sm:px-0">
            {/* Colonne de gauche - Mes demandes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Mes demandes</h2>
                <Link to="/nouvelle-demande" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  + Nouvelle demande
                </Link>
              </div>
              
              <div className="p-6 text-center">
                <p className="text-gray-500">Aucune demande</p>
              </div>

            </div>

            {/* Colonne de droite - Notifications */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Tout marquer comme lu
                </button>
              </div>
              
              <div className="p-6 text-center">
                <p className="text-gray-500">Aucune notification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CitoyensPortal;