import React, { useState, useEffect } from 'react';
import CitoyenHeader from './CitoyenHeader';
import { Link, useNavigate } from 'react-router-dom';

const CitoyensPortal = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Erreur parsing userData from localStorage:', error);
        // Optionnel: gérer l'erreur, par exemple en supprimant les données corrompues
        localStorage.removeItem('userData');
      }
    }
  }, []);

  return (
    <>
      <CitoyenHeader />
      <div className="bg-gray-100 pt-14 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-60px)]">
        <div className="max-w-7xl mx-auto">
          {/* En-tête du tableau de bord */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">
                {userData ? `Bienvenue, ${userData.firstName} ${userData.lastName}` : 'Chargement...'}
              </p>
            </div>
            <button
              onClick={() => navigate('/portail-citoyens/nouvelle-demande')}
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center sm:justify-start"
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
                <Link to="/portail-citoyens/nouvelle-demande" className="text-green-600 hover:text-green-700 text-sm font-medium">
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
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Tout marquer comme lu
                </button>
              </div>
              
              <div className="p-6 text-center">
                <p className="text-gray-500">Aucune notification</p>
              </div>
            </div>
          </div>

          {/* Section Guide des démarches et Rendez-vous */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Guide des démarches - prend 2/3 de l'espace sur desktop */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Guide des démarches</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Première demande */}
                <Link to="/portail-citoyens/aide#premiere-demande" className="block transition-transform duration-300 hover:scale-105 hover:shadow-md active:bg-blue-200">
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-100 h-full hover:bg-red-100 transition-colors duration-300">
                    <h3 className="font-medium text-red-800 mb-2 flex items-center">
                      Première demande
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    <p className="text-sm text-red-700">Comment effectuer votre première demande de carte d'identité</p>
                  </div>
                </Link>
                
                {/* Renouvellement */}
                <Link to="/portail-citoyens/aide#renouvellement" className="block transition-transform duration-300 hover:scale-105 hover:shadow-md active:bg-green-200">
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100 h-full hover:bg-green-100 transition-colors duration-300">
                    <h3 className="font-medium text-green-800 mb-2 flex items-center">
                      Renouvellement
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    <p className="text-sm text-green-700">Procédure pour renouveler votre carte d'identité existante</p>
                  </div>
                </Link>
                
                {/* Perte ou vol */}
                <Link to="/portail-citoyens/aide#perte-vol" className="block transition-transform duration-300 hover:scale-105 hover:shadow-md active:bg-yellow-200">
                  <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-100 h-full hover:bg-yellow-100 transition-colors duration-300">
                    <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                      Perte ou vol
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    <p className="text-sm text-yellow-700">Démarches à suivre en cas de perte ou de vol de votre carte</p>
                  </div>
                </Link>
                
                {/* Retirer ma carte */}
                <Link to="/portail-citoyens/aide#retirer-carte" className="block transition-transform duration-300 hover:scale-105 hover:shadow-md active:bg-purple-200">
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-100 h-full hover:bg-red-100 transition-colors duration-300">
                    <h3 className="font-medium text-red-800 mb-2 flex items-center">
                      Retirer ma carte
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    <p className="text-sm text-red-700">Comment et où récupérer votre nouvelle carte d'identité</p>
                  </div>
                </Link>
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