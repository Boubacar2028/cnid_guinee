import React, { useState } from 'react';
import CitoyenHeader from './CitoyenHeader';
import { FileText, Upload, Check, AlertCircle, ChevronRight } from 'lucide-react';

const NouvelleDemandePage = () => {
  const [typeDemande, setTypeDemande] = useState('');
  const [etape, setEtape] = useState(1);
  const [fichierSelectionne, setFichierSelectionne] = useState(null);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <CitoyenHeader />
      <div className="pt-20 pb-12 px-4 sm:pt-24 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle demande</h1>
            <p className="text-gray-600 mt-2">Remplissez le formulaire ci-dessous pour initier votre demande de carte nationale d'identité</p>
          </div>
          
          {/* Indicateur d'étapes */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${etape >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <span>1</span>
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Type</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${etape >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${etape >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <span>2</span>
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Infos</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${etape >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${etape >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <span>3</span>
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Documents</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${etape >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${etape >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <span>4</span>
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Validation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
          
          {/* Formulaire de nouvelle demande */}
          <form className="space-y-8">
            {etape === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FileText size={20} className="mr-2 text-blue-600" />
                  Sélectionnez le type de demande
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${typeDemande === 'nouvelle' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                    onClick={() => setTypeDemande('nouvelle')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      {typeDemande === 'nouvelle' && (
                        <div className="bg-blue-600 text-white p-1 rounded-full">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900">Première demande</h3>
                    <p className="text-sm text-gray-500 mt-1">Pour obtenir votre première carte nationale d'identité</p>
                  </div>
                  
                  <div 
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${typeDemande === 'renouvellement' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                    onClick={() => setTypeDemande('renouvellement')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      {typeDemande === 'renouvellement' && (
                        <div className="bg-blue-600 text-white p-1 rounded-full">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900">Renouvellement</h3>
                    <p className="text-sm text-gray-500 mt-1">Pour renouveler votre carte existante ou expirée</p>
                  </div>
                  
                  <div 
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${typeDemande === 'perte' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                    onClick={() => setTypeDemande('perte')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <AlertCircle size={24} className="text-red-600" />
                      </div>
                      {typeDemande === 'perte' && (
                        <div className="bg-blue-600 text-white p-1 rounded-full">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900">Perte ou vol</h3>
                    <p className="text-sm text-gray-500 mt-1">Pour déclarer la perte ou le vol de votre carte</p>
                  </div>
                </div>

                {typeDemande && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                    <h3 className="font-medium text-gray-800 mb-2">Documents nécessaires pour une {typeDemande === 'nouvelle' ? 'première demande' : typeDemande === 'renouvellement' ? 'demande de renouvellement' : 'déclaration de perte'}</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      {typeDemande === 'nouvelle' && (
                        <>
                          <li>Extrait de naissance sécurisé</li>
                          <li>Certificat de résidence</li>
                          <li>Fiche individuelle de renseignement</li>
                        </>
                      )}
                      {typeDemande === 'renouvellement' && (
                        <>
                          <li>Ancienne carte d'identité</li>
                          <li>Récépissé de dépôt</li>
                          <li>Extrait de naissance sécurisé</li>
                        </>
                      )}
                      {typeDemande === 'perte' && (
                        <>
                          <li>Déclaration de perte</li>
                          <li>Attestation du commissariat</li>
                          <li>Extrait de naissance sécurisé</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {etape === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Informations personnelles
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Votre nom de famille"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de naissance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu de naissance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Ville ou commune de naissance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="+224 xx xx xx xx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="exemple@email.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {etape === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Upload size={20} className="mr-2 text-blue-600" />
                  Documents requis
                </h2>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-dashed border-gray-300 p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        id="document1" 
                        onChange={(e) => setFichierSelectionne(e.target.files[0])}
                      />
                      <div className="text-center py-4">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Extrait de naissance sécurisé</p>
                        <p className="text-xs text-gray-400 mt-1">Glissez-déposez ou cliquez pour choisir</p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-dashed border-gray-300 p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="document2" />
                      <div className="text-center py-4">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Certificat de résidence</p>
                        <p className="text-xs text-gray-400 mt-1">Glissez-déposez ou cliquez pour choisir</p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-dashed border-gray-300 p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="document3" />
                      <div className="text-center py-4">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Photo d'identité récente</p>
                        <p className="text-xs text-gray-400 mt-1">Glissez-déposez ou cliquez pour choisir</p>
                      </div>
                    </div>
                  </div>
                  
                  {fichierSelectionne && (
                    <div className="flex items-center p-2 bg-green-50 rounded-lg border border-green-100">
                      <Check size={20} className="text-green-600 mr-2" />
                      <span className="text-sm text-green-700">{fichierSelectionne.name} sélectionné</span>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Tous les documents doivent être lisibles et au format JPG, PNG ou PDF. Taille maximale : 5MB par fichier.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {etape === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Check size={20} className="mr-2 text-blue-600" />
                  Récapitulatif et validation
                </h2>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Vérifiez les informations avant de soumettre</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Type de demande</p>
                      <p className="font-medium">{typeDemande === 'nouvelle' ? 'Première demande' : typeDemande === 'renouvellement' ? 'Renouvellement' : 'Perte ou vol'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">Boubacar Bah</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de naissance</p>
                      <p className="font-medium">01/01/1990</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium">+224 xx xx xx xx</p>
                    </div>
                  </div>
                  
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Documents téléchargés</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2" />
                        <span className="text-sm">Extrait de naissance</span>
                      </div>
                      {fichierSelectionne && (
                        <div className="flex items-center">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">{fichierSelectionne.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input type="checkbox" id="terms" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      Je certifie que les informations fournies sont exactes et j'accepte les conditions d'utilisation
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between pt-4 border-t border-gray-100">
              {etape > 1 && (
                <button
                  type="button"
                  onClick={() => setEtape(etape - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Précédent
                </button>
              )}
              
              <div className="ml-auto">
                {etape < 4 ? (
                  <button
                    type="button"
                    onClick={() => setEtape(etape + 1)}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${!typeDemande && etape === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!typeDemande && etape === 1}
                  >
                    Suivant
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Soumettre la demande
                  </button>
                )}
              </div>
            </div>
          </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default NouvelleDemandePage;
