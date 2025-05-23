import React from 'react';
import CitoyenHeader from './CitoyenHeader';

const HistoriquePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CitoyenHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historique des demandes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Historique des demandes</h1>
            
            {/* Filtres */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Type de demande</option>
                  <option value="nouvelle">Nouvelle carte</option>
                  <option value="renouvellement">Renouvellement</option>
                  <option value="perte">Déclaration de perte</option>
                </select>
                <select className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Statut</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="rejete">Rejeté</option>
                </select>
              </div>
            </div>

            {/* Message si aucune demande */}
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun historique</p>
            </div>
          </div>

          {/* Historique des paiements */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Historique des paiements</h1>
            
            {/* Filtres */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Type de paiement</option>
                  <option value="nouvelle">Nouvelle carte</option>
                  <option value="renouvellement">Renouvellement</option>
                  <option value="perte">Remplacement</option>
                </select>
                <input
                  type="month"
                  className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Message si aucun paiement */}
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun historique de paiement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriquePage;
