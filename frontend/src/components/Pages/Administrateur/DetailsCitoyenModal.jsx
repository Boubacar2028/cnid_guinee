import React, { useState, useEffect } from 'react';

const StatusBadge = ({ statut }) => {
  let badgeColor = 'bg-gray-100 text-gray-800'; // Default
  if (statut === 'Actif' || statut === 'Validé') {
    badgeColor = 'bg-green-100 text-green-800';
  } else if (statut === 'Inactif' || statut === 'Rejeté') {
    badgeColor = 'bg-red-100 text-red-800';
  } else if (statut === 'En cours') {
    badgeColor = 'bg-yellow-100 text-yellow-800';
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}`}>
      {statut}
    </span>
  );
};

const DetailsCitoyenModal = ({ isOpen, onClose, citoyenId }) => {
  const [citoyenData, setCitoyenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && citoyenId) {
      const fetchCitoyenDetails = async () => {
        setLoading(true);
        setError('');
        setCitoyenData(null); // Reset previous data
        try {
                    const token = localStorage.getItem('access_token');
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/admin/citoyens/${citoyenId}/details/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données du citoyen.');
          }

          const data = await response.json();
          setCitoyenData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCitoyenDetails();
    }
  }, [isOpen, citoyenId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {loading && <p className="text-center py-10">Chargement des détails...</p>}
        {error && <p className="text-center py-10 text-red-500">Erreur: {error}</p>}

        {citoyenData && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Détails du Citoyen</h2>
            
            {/* Informations personnelles */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Informations Personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <p><strong>Nom:</strong> {citoyenData.nom}</p>
                <p><strong>Prénom:</strong> {citoyenData.prenom}</p>
                <p><strong>Email:</strong> {citoyenData.email}</p>
                <p><strong>Téléphone:</strong> {citoyenData.telephone}</p>
                <p><strong>Date d'inscription:</strong> {new Date(citoyenData.date_inscription).toLocaleDateString('fr-FR')}</p>
                <p><strong>Statut:</strong> <StatusBadge statut={citoyenData.statut} /></p>
              </div>
            </div>

            {/* Historique des demandes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Historique des Demandes</h3>
              {citoyenData.demandes && citoyenData.demandes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Demande</th>
                        <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {citoyenData.demandes.map(demande => (
                        <tr key={demande.id}>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">#{demande.id}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">{demande.type}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">{demande.date}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm"><StatusBadge statut={demande.statut} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">Aucune demande trouvée pour ce citoyen.</p>
              )}
            </div>

            <div className="mt-8 text-right">
              <button onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Fermer</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsCitoyenModal;
