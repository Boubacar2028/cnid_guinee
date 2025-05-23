import React from 'react';
import CitoyenHeader from './CitoyenHeader';

const AidePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CitoyenHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Aide et support</h1>
          
          {/* FAQ */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions fréquentes</h2>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <button className="flex justify-between items-center w-full text-left">
                  <span className="text-lg font-medium text-gray-900">
                    Comment faire une nouvelle demande ?
                  </span>
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="mt-4 text-gray-600">
                  Pour faire une nouvelle demande, cliquez sur "Nouvelle demande" dans le menu principal. 
                  Remplissez le formulaire avec vos informations et téléchargez les documents requis.
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <button className="flex justify-between items-center w-full text-left">
                  <span className="text-lg font-medium text-gray-900">
                    Comment prendre un rendez-vous biométrique ?
                  </span>
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="mt-4 text-gray-600">
                  Accédez à la section "Biométrie" depuis le menu principal. 
                  Sélectionnez une date et un créneau horaire disponible, puis confirmez votre rendez-vous.
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nous contacter</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Support technique</h3>
                  <p className="text-gray-600 mb-4">
                    Pour toute question technique concernant l'utilisation du portail.
                  </p>
                  <p className="text-gray-900">
                    Email: support@cnid.gn<br />
                    Tél: +224 XX XX XX XX
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Support administratif</h3>
                  <p className="text-gray-600 mb-4">
                    Pour toute question concernant votre dossier ou vos documents.
                  </p>
                  <p className="text-gray-900">
                    Email: admin@cnid.gn<br />
                    Tél: +224 XX XX XX XX
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AidePage;
