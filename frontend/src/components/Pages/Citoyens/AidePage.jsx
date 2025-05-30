import React, { useState } from 'react';
import CitoyenHeader from './CitoyenHeader';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, RefreshCw, CreditCard, Search } from 'lucide-react';

const AidePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <CitoyenHeader />
      <div className="pt-20 pb-12 px-4 sm:pt-24 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Centre d'aide</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Retrouvez toutes les informations nécessaires pour effectuer vos démarches relatives à la carte nationale d'identité</p>
          
          {/* Barre de recherche */}
          <div className="mt-6 max-w-xl mx-auto relative">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Rechercher une information..." 
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>
          
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="sticky top-0 z-10 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Guide des démarches</h2>
            </div>
            
            {/* Onglets rapides */}
            <div className="hidden md:flex space-x-4 text-sm">
              <a href="#premiere-demande" className="text-blue-600 hover:text-blue-800 font-medium">Première demande</a>
              <a href="#renouvellement" className="text-blue-600 hover:text-blue-800 font-medium">Renouvellement</a>
              <a href="#perte-vol" className="text-blue-600 hover:text-blue-800 font-medium">Perte/Vol</a>
              <a href="#retirer-carte" className="text-blue-600 hover:text-blue-800 font-medium">Retrait</a>
            </div>
          </div>
          
          <div className="p-6">
          
          {/* Première demande */}
          <div id="premiere-demande" className="mb-10 scroll-mt-32">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Première demande de carte d'identité – en Guinée</h2>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
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
              <div className="mt-6">
                <Link to="/nouvelle-demande" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  Commencer ma demande 
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Renouvellement */}
          <div id="renouvellement" className="mb-10 scroll-mt-32">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg mr-4">
                <RefreshCw className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Renouvellement de carte d'identité – en Guinée</h2>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
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
          <div id="perte-vol" className="mb-10 scroll-mt-32">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-red-100 p-2 rounded-lg mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">En cas de perte ou de vol – que faire ?</h2>
            </div>
            <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm">
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
          <div id="retirer-carte" className="mb-10 scroll-mt-32">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-lg mr-4">
                <CreditCard className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Retrait de la carte – en Guinée</h2>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 shadow-sm">
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
        
        {/* Section FAQ */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="sticky top-0 z-10 bg-white p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Questions fréquentes</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6 max-w-4xl">
              <details className="group rounded-lg border border-gray-200 p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                  <h3 className="font-medium">Quel est le délai pour obtenir ma carte d'identité ?</h3>
                  <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-sm text-gray-600">Le délai varie entre quelques jours et plusieurs semaines selon les régions. Dans les grandes villes, comptez généralement 5 à 10 jours ouvrables. Dans les zones rurales, cela peut prendre jusqu'à 3-4 semaines.</p>
              </details>
              
              <details className="group rounded-lg border border-gray-200 p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                  <h3 className="font-medium">Combien coûte une carte nationale d'identité ?</h3>
                  <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-sm text-gray-600">Le coût est généralement entre 20 000 et 30 000 GNF pour une première demande ou un renouvellement normal. Pour un remplacement suite à une perte, le tarif peut être majoré.</p>
              </details>
              
              <details className="group rounded-lg border border-gray-200 p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                  <h3 className="font-medium">Puis-je demander ma carte d'identité en ligne ?</h3>
                  <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-sm text-gray-600">Vous pouvez pré-remplir votre demande en ligne via ce portail citoyen, mais une présence physique est nécessaire pour la prise d'empreintes et de photo. Le portail vous permet cependant de prendre rendez-vous et de suivre l'avancement de votre demande.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AidePage;
