import React from 'react';
import CitoyenHeader from './CitoyenHeader';
import { Link } from 'react-router-dom';

const AidePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CitoyenHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center border-b border-gray-200 pb-4 mb-6">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">Guide des démarches</h1>
          </div>
          
          {/* Première demande */}
          <div id="premiere-demande" className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Première demande de carte d'identité – en Guinée</h2>
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Pour une première demande :</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Extrait de naissance sécurisé ou jugement supplétif si vous n'avez jamais été enregistré à l'état civil.</li>
                <li>Certificat de résidence délivré par votre quartier ou commune.</li>
                <li>Fiche individuelle de renseignement (disponible au commissariat ou mairie).</li>
                <li>Photocopie de la carte d'un parent ou tuteur, si nécessaire.</li>
                <li>Présentation au centre de délivrance pour la prise d'empreintes digitales, photo et signature.</li>
                <li>Paiement des frais fixés par l'État (souvent entre 20 000 et 30 000 GNF selon les régions).</li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-blue-700">Dans certaines zones rurales, des missions mobiles d'identification sont organisées pour rapprocher le service des citoyens.</p>
                </div>
              </div>
              <div className="mt-5">
                <Link to="/nouvelle-demande" className="text-blue-600 hover:text-blue-800 flex items-center">
                  Commencer ma demande 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Renouvellement */}
          <div id="renouvellement" className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🔁 Renouvellement de carte d'identité – en Guinée</h2>
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Le renouvellement est requis :</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Tous les 10 ans (durée de validité).</li>
                <li>En cas de modification d'informations personnelles (changement de nom, de résidence, etc.).</li>
              </ul>
              
              <h3 className="font-medium text-gray-700 mb-3 mt-4">Pièces nécessaires :</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Ancienne carte d'identité.</li>
                <li>Certificat de résidence ou attestation du quartier.</li>
                <li>Fiche de renouvellement délivrée au centre d'enrôlement.</li>
                <li>Frais de renouvellement équivalents à une première demande.</li>
              </ul>
            </div>
          </div>

          {/* Perte ou vol */}
          <div id="perte-vol" className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">❌ En cas de perte ou de vol – que faire ?</h2>
            <div className="bg-gray-50 p-5 rounded-lg">
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>Se rendre immédiatement au commissariat pour une déclaration de perte ou de vol.</li>
                <li>Une attestation officielle de perte vous sera délivrée.</li>
                <li>Fournir cette attestation + un extrait de naissance + photo d'identité.</li>
                <li>Refaire la procédure comme pour une première demande.</li>
              </ol>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">Si la carte est volée, et qu'un usage frauduleux est suspecté, cela doit être signalé à la police.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Retirer ma carte */}
          <div id="retirer-carte" className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🟨 Retrait de la carte – en Guinée</h2>
            <div className="bg-gray-50 p-5 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Délai de production : de quelques jours à plusieurs semaines selon la zone géographique.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">Vous êtes informé verbalement ou par appel/SMS quand la carte est prête.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-gray-600">Le retrait se fait au même centre que celui de la biométrie.</span>
                </li>
              </ul>
              
              <h3 className="font-medium text-gray-700 mt-4 mb-3">Il faut présenter :</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Un reçu ou fiche de dépôt.</li>
                <li>Une pièce d'identité provisoire, si délivrée lors de l'enrôlement.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AidePage;
