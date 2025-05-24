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

          {/* Section Guide des démarches et Rendez-vous */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Guide des démarches - prend 2/3 de l'espace sur desktop */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Guide des démarches</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Première demande */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Première demande</h3>
                  <p className="text-sm text-blue-700">Comment effectuer votre première demande de carte d'identité</p>
                </div>
                
                {/* Renouvellement */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800 mb-2">Renouvellement</h3>
                  <p className="text-sm text-green-700">Procédure pour renouveler votre carte d'identité existante</p>
                </div>
                
                {/* Perte ou vol */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h3 className="font-medium text-yellow-800 mb-2">Perte ou vol</h3>
                  <p className="text-sm text-yellow-700">Démarches à suivre en cas de perte ou de vol de votre carte</p>
                </div>
                
                {/* Retirer ma carte */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-2">Retirer ma carte</h3>
                  <p className="text-sm text-purple-700">Comment et où récupérer votre nouvelle carte d'identité</p>
                </div>
              </div>
            </div>
            
            {/* Rendez-vous - prend 1/3 de l'espace sur desktop */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Rendez-vous</h2>
              </div>
              
              <div className="p-6 text-center flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
                <p className="text-gray-500 mt-2">Vous n'avez pas de rendez-vous programmé.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CitoyensPortal;