import React from 'react';
import CitoyenHeader from './CitoyenHeader';

const NouvelleDemandePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CitoyenHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle demande</h1>
          
          {/* Formulaire de nouvelle demande */}
          <form className="space-y-6">
            {/* Type de demande */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de demande
              </label>
              <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Sélectionnez un type de demande</option>
                <option value="nouvelle">Nouvelle carte nationale d'identité</option>
                <option value="renouvellement">Renouvellement de carte</option>
                <option value="perte">Déclaration de perte</option>
              </select>
            </div>

            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Documents requis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents requis
              </label>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center">
                  <input type="file" className="hidden" id="document1" />
                  <label
                    htmlFor="document1"
                    className="bg-white px-4 py-2 rounded border border-gray-300 cursor-pointer hover:bg-gray-50"
                  >
                    Choisir un fichier
                  </label>
                  <span className="ml-4 text-sm text-gray-600">
                    Aucun fichier sélectionné
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Soumettre la demande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NouvelleDemandePage;
