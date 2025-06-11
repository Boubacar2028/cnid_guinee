import React, { useState, useEffect, useCallback } from 'react';
import AjouterEmploye from './AjouterEmploye';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [employeeToProcess, setEmployeeToProcess] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

    const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

      const response = await fetch(`${API_BASE_URL}/agents/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedEmployees = data.map(agent => {
          const user = agent.utilisateur || {};
          return {
              id: agent.id,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              email: user.email,
              status: user.is_active ? 'Actif' : 'Bloqué',
              dateAjout: user.date_joined,
              derniereActivite: user.last_login,
              demandesTraitees: agent.demandes_traitees_count,
              user: {
                  nom: user.last_name || '',
                  prenom: user.first_name || '',
              },
          };
      });

      setEmployees(formattedEmployees);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des employés:', err);
      setError('Impossible de charger les employés. Veuillez réessayer plus tard.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEditModalOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;

    try {
      const token = localStorage.getItem('access_token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      
      const payload = {
        utilisateur: {
          first_name: editingEmployee.user.prenom,
          last_name: editingEmployee.user.nom,
          email: editingEmployee.email,
        }
      };

      await axios.patch(`${API_BASE_URL}/agents/${editingEmployee.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé', error);
    }
  };

  const handleDeleteConfirmation = (employee) => {
    setEmployeeToProcess(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToProcess) return;

    try {
      const token = localStorage.getItem('access_token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

      await axios.delete(`${API_BASE_URL}/agents/${employeeToProcess.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowDeleteModal(false);
      setEmployeeToProcess(null);
      fetchEmployees(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé', error);
      // Gérer l'affichage de l'erreur à l'utilisateur si nécessaire
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'Actif').length,
    blocked: employees.filter(emp => emp.status === 'Bloqué').length,
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (showAddForm) {
    return <AjouterEmploye onClose={() => setShowAddForm(false)} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des employés</h1>
          <p className="text-gray-600">Gérer les comptes et permissions des employés</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Ajouter un employé
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-600">Total employés</div>
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-600">Employés actifs</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-600">Employés bloqués</div>
          <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
        </div>
        
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Rechercher un employé..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* État de chargement */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun employé trouvé</h3>
          <p className="mt-1 text-gray-500">Commencez par ajouter des employés à votre système.</p>
          <div className="mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter un employé
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employé
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'ajout
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière activité
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demandes traitées
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                  <div className="text-sm text-gray-500">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.status === 'Actif'
                        ? 'bg-gray-800 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(employee.dateAjout)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(employee.derniereActivite)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-center">
                  {employee.demandesTraitees}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-2 rounded-md border border-gray-200 hover:bg-gray-100" title="Verrouiller/Déverrouiller">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </button>
                    <button onClick={() => handleEdit(employee)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-100" title="Modifier">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
                    </button>
                    <button onClick={() => handleDeleteConfirmation(employee)} className="p-2 rounded-md border border-gray-200 hover:bg-red-100" title="Supprimer">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

            {isEditModalOpen && editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Modifier l'employé</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" id="nom" value={editingEmployee.user.nom} onChange={(e) => setEditingEmployee({...editingEmployee, user: {...editingEmployee.user, nom: e.target.value}})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" id="prenom" value={editingEmployee.user.prenom} onChange={(e) => setEditingEmployee({...editingEmployee, user: {...editingEmployee.user, prenom: e.target.value}})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value={editingEmployee.email} onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Annuler</button>
              <button onClick={handleUpdateEmployee} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && employeeToProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer l'employé <span className="font-bold">{employeeToProcess.name}</span> ?</p>
            <p className="text-sm text-red-600 mt-2">Cette action est irréversible.</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Annuler</button>
              <button onClick={handleDeleteEmployee} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeManagement;
                                        
