import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CitoyenDashboard = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/auth/demandes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDemandes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des demandes');
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  const handleNouvelleDemande = () => {
    navigate('/nouvelle-demande');
  };

  const getStatutLabel = (statut) => {
    const labels = {
      'en_attente': 'En attente',
      'en_cours': 'En cours de traitement',
      'validee': 'Validée',
      'rejetee': 'Rejetée'
    };
    return labels[statut] || statut;
  };

  const getStatutClass = (statut) => {
    const classes = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'en_cours': 'bg-blue-100 text-blue-800',
      'validee': 'bg-green-100 text-green-800',
      'rejetee': 'bg-red-100 text-red-800'
    };
    return `${classes[statut]} px-2 py-1 rounded-full text-sm font-medium`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes demandes de CNI</h1>
        <button
          onClick={handleNouvelleDemande}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Nouvelle demande
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent traitant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {demandes.map((demande) => (
              <tr key={demande.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(demande.date_creation).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatutClass(demande.statut)}>
                    {getStatutLabel(demande.statut)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {demande.agent_traitant ? `${demande.agent_traitant.first_name} ${demande.agent_traitant.last_name}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/demandes/${demande.id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Voir les détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {demandes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune demande trouvée. Créez votre première demande de CNI en cliquant sur le bouton "Nouvelle demande".
          </div>
        )}
      </div>
    </div>
  );
};

export default CitoyenDashboard;