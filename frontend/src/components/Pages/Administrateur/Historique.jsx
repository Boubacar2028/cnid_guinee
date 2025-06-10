import React, { useState, useEffect, useCallback } from 'react';

// Icônes (vous pouvez utiliser react-icons ou des SVGs inline)
const FilterIcon = () => <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L10 14.414V19a1 1 0 01-1.447.894L7 18.118V14.414L3.293 6.707A1 1 0 013 6V3z"></path></svg>;
const SearchIcon = () => <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>;
const CalendarIcon = () => <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>;

// Icônes pour les onglets
const CitoyenIcon = () => <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>;
const AgentIcon = () => <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>;
const PaiementIcon = () => <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zm-7 4a1 1 0 01-1-1 1 1 0 112 0 1 1 0 01-1 1zm3-1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>;
const DemandeIcon = () => <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>;

const tabIcons = {
  citoyens: <CitoyenIcon />,
  agents: <AgentIcon />,
  paiements: <PaiementIcon />,
  demandes: <DemandeIcon />,
};

const columnConfig = {
  citoyens: [
    { key: 'nom_complet', header: 'Nom Complet' },
    { key: 'email', header: 'Email' },
    { key: 'telephone', header: 'Téléphone' },
    { key: 'date_inscription', header: 'Date d\'Inscription' },
    { key: 'statut', header: 'Statut', cell: (item) => <StatusBadge statut={item.statut} /> },
  ],
  agents: [
    { key: 'nom_complet', header: 'Nom Complet' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Rôle' },
    { key: 'date_affectation', header: 'Date d\'Affectation' },
    { key: 'statut', header: 'Statut', cell: (item) => <StatusBadge statut={item.statut} /> },
  ],
  paiements: [
    { key: 'citoyen', header: 'Citoyen' },
    { key: 'montant', header: 'Montant' },
    { key: 'date_paiement', header: 'Date de Paiement' },
    { key: 'type_demande', header: 'Type de Demande' },
    { key: 'statut', header: 'Statut', cell: (item) => <StatusBadge statut={item.statut} /> },
  ],
  demandes: [
    { key: 'demandeur', header: 'Demandeur' },
    { key: 'type_demande', header: 'Type de Demande' },
    { key: 'date_soumission', header: 'Date de Soumission' },
    { key: 'date_traitement', header: 'Date de Traitement' },
    { key: 'statut', header: 'Statut', cell: (item) => <StatusBadge statut={item.statut} /> },
  ],
};

const StatusBadge = ({ statut }) => {
  let badgeColor = 'bg-gray-100 text-gray-800';
  switch (String(statut).toLowerCase()) {
    case 'actif':
    case 'validée':
    case 'confirmé':
      badgeColor = 'bg-green-100 text-green-800';
      break;
    case 'suspendu':
    case 'rejetée':
      badgeColor = 'bg-red-100 text-red-800';
      break;
    case 'en cours':
    case 'en attente':
      badgeColor = 'bg-yellow-100 text-yellow-800';
      break;
    default:
      break;
  }
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}`}>
      {statut}
    </span>
  );
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Historique = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [activeTab, setActiveTab] = useState('citoyens');
  const [statusFilter, setStatusFilter] = useState('tous');

  // State for API data, loading, error, and pagination
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');

    let endpoint = '';
    switch (activeTab) {
      case 'citoyens': endpoint = '/admin/historique/citoyens/'; break;
      case 'agents': endpoint = '/admin/historique/agents/'; break;
      case 'paiements': endpoint = '/admin/historique/paiements/'; break;
      case 'demandes': endpoint = '/admin/historique/demandes/'; break;
      default: setLoading(false); return;
    }

    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (dateRange.startDate) params.append('date_debut', dateRange.startDate);
    if (dateRange.endDate) params.append('date_fin', dateRange.endDate);
    if (statusFilter !== 'tous') params.append('statut', statusFilter);
    params.append('page', currentPage);
    // params.append('page_size', pageSize); // Le backend a une taille de page fixe pour l'instant

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erreur ${response.status} lors de la récupération des données.`);
      }
      const result = await response.json();
      setData(result.results || []);
      setTotalItems(result.count || 0);
      setTotalPages(Math.ceil((result.count || 0) / pageSize));

    } catch (err) {
      setError(err.message);
      setData([]); // Vider les données en cas d'erreur
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, dateRange, statusFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApplyFilters = () => {
    setCurrentPage(1); // Réinitialiser à la première page lors de l'application de nouveaux filtres
    // fetchData sera appelé par l'useEffect car currentPage ou les filtres auront changé
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateRange({ startDate: '', endDate: '' });
    setStatusFilter('tous');
    setCurrentPage(1);
  };

  // Gérer le changement d'onglet
  useEffect(() => {
    setCurrentPage(1); // Réinitialiser à la première page lors du changement d'onglet
    // Les autres filtres (searchTerm, dateRange, statusFilter) sont conservés lors du changement d'onglet
    // fetchData sera appelé par l'useEffect [fetchData] car activeTab change
  }, [activeTab]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Historique</h1>
        <p className="text-sm text-gray-600">Consultez et filtrez l'historique des activités</p>
      </header>

      {/* Section Filtres de recherche */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          Filtres de recherche
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Recherche */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md shadow-sm"
                placeholder="Nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Date de début */}
          <div>
            <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon />
                </div>
                <input 
                    type="date" 
                    name="dateDebut" 
                    id="dateDebut"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md shadow-sm"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
            </div>
          </div>

          {/* Date de fin */}
          <div>
            <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon />
                </div>
                <input 
                    type="date" 
                    name="dateFin" 
                    id="dateFin"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md shadow-sm"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
            </div>
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select 
              id="statut" 
              name="statut"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="suspendu">Suspendu</option>
              <option value="validee">Validée</option>
              <option value="rejetee">Rejetée</option>
              <option value="en_cours">En cours</option>
            </select>
          </div>
        </div>
        <div className="flex justify-start space-x-3">
          <button
            onClick={handleApplyFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FilterIcon />
            Appliquer les filtres
          </button>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Section Contenu Principal (Onglets et Tableau) */}
      <div className="bg-white rounded-lg shadow">
        {/* Barre d'onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {['citoyens', 'agents', 'paiements', 'demandes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize flex items-center`}
              >
                {tabIcons[tab]}
                {tab} {activeTab === tab ? `(${totalItems || 0})` : ''}
              </button>
            ))}
          </nav>
        </div>

        {/* Tableau de données */}
        <div className="p-6">
          {loading ? (
            <p className="text-gray-500 text-center py-8">Chargement des données...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-8">Erreur: {error}</p>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {(columnConfig[activeTab] || []).map((col) => (
                      <th key={col.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col.header}
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr key={item.id}>
                      {(columnConfig[activeTab] || []).map((col) => (
                        <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {col.cell ? col.cell(item) : (typeof item[col.key] === 'boolean' ? (item[col.key] ? 'Oui' : 'Non') : String(item[col.key] === null || item[col.key] === undefined ? '' : item[col.key]))}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => console.log('Détails pour item ID:', item.id, 'dans onglet:', activeTab)} className="text-blue-600 hover:text-blue-800">Détails</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune donnée à afficher pour l'onglet "{activeTab}" avec les filtres actuels.</p>
          )}
          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                    {' '}(Total: <span className="font-medium">{totalItems}</span> éléments)
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Précédent</span>
                      {/* Heroicon name: solid/chevron-left */}
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {/* Current Page Indicator (simple version) - Can be expanded to show more page numbers */}
                    <span aria-current="page" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Suivant</span>
                      {/* Heroicon name: solid/chevron-right */}
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Historique;
