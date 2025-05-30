import React, { useState } from 'react';
import CitoyenHeader from './CitoyenHeader';
import { FileText, Calendar, Clock, Download, Search, Filter } from 'lucide-react';

const HistoriquePage = () => {
  const [activeTab, setActiveTab] = useState('demandes');
  
  // Simuler des données d'historique
  const demandesData = [
    { id: 'DEM-2023-001', type: 'Nouvelle carte', date: '15/05/2023', statut: 'Terminé', couleur: 'green' },
    { id: 'DEM-2024-042', type: 'Renouvellement', date: '22/02/2024', statut: 'En cours', couleur: 'yellow' },
    { id: 'DEM-2024-107', type: 'Déclaration de perte', date: '10/05/2024', statut: 'En attente', couleur: 'blue' }
  ];
  
  const paiementsData = [
    { id: 'PAY-2023-001', montant: '30 000 GNF', date: '15/05/2023', methode: 'Orange Money', statut: 'Confirmé' },
    { id: 'PAY-2024-042', montant: '35 000 GNF', date: '22/02/2024', methode: 'MTN MoMo', statut: 'Confirmé' }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <CitoyenHeader />
      <div className="pt-20 pb-12 px-4 sm:pt-24 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Mon historique</h1>
          <p className="text-gray-600">Consultez l'historique de vos demandes et paiements</p>
        </div>

        {/* Onglets */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-md p-1 flex space-x-1">
            <button 
              onClick={() => setActiveTab('demandes')} 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'demandes' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Demandes
            </button>
            <button 
              onClick={() => setActiveTab('paiements')} 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'paiements' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Paiements
            </button>
          </div>
        </div>
          
        {/* Historique des demandes */}
        {activeTab === 'demandes' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0 flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Historique des demandes
              </h2>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Rechercher une demande..." 
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            
            {/* Filtres */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center">
                  <Filter size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
                </div>
                <select className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1">
                  <option value="">Type de demande</option>
                  <option value="nouvelle">Nouvelle carte</option>
                  <option value="renouvellement">Renouvellement</option>
                  <option value="perte">Déclaration de perte</option>
                </select>
                <select className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1">
                  <option value="">Statut</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="rejete">Rejeté</option>
                </select>
                <div className="relative ml-auto">
                  <input
                    type="month"
                    className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1"
                  />
                  <Calendar size={16} className="absolute right-3 top-2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table des demandes */}
            {demandesData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {demandesData.map((demande) => (
                      <tr key={demande.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{demande.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{demande.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-400" />
                            {demande.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${demande.couleur}-100 text-${demande.couleur}-800`}>
                            <span className={`h-1.5 w-1.5 rounded-full bg-${demande.couleur}-600 mr-1.5`}></span>
                            {demande.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                            <FileText size={14} className="mr-1" />
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun historique</h3>
                <p className="text-gray-600 max-w-sm mx-auto">Vous n'avez pas encore effectué de demande. Commencez par créer une nouvelle demande.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Historique des paiements */}
        {activeTab === 'paiements' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Historique des paiements
              </h2>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Rechercher un paiement..." 
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            
            {/* Filtres */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center">
                  <Filter size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
                </div>
                <select className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1">
                  <option value="">Type de paiement</option>
                  <option value="nouvelle">Nouvelle carte</option>
                  <option value="renouvellement">Renouvellement</option>
                  <option value="perte">Remplacement</option>
                </select>
                <select className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1">
                  <option value="">Méthode de paiement</option>
                  <option value="orange">Orange Money</option>
                  <option value="mtn">MTN MoMo</option>
                  <option value="cash">Espèces</option>
                </select>
                <div className="relative ml-auto">
                  <input
                    type="month"
                    className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1"
                  />
                  <Calendar size={16} className="absolute right-3 top-2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table des paiements */}
            {paiementsData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paiementsData.map((paiement) => (
                      <tr key={paiement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paiement.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{paiement.montant}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-400" />
                            {paiement.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{paiement.methode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <button className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center">
                            <Download size={14} className="mr-1" />
                            Reçu
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun historique de paiement</h3>
                <p className="text-gray-600 max-w-sm mx-auto">Vous n'avez pas encore effectué de paiement dans le système.</p>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default HistoriquePage;
