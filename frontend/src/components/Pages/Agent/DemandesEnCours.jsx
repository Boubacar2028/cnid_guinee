import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DemandeDetailsModal from './Modals/DemandeDetailsModal';

const DemandesEnCours = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null);

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    setError('Authentification requise. Veuillez vous reconnecter.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/agent/demandes-en-cours/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Filtrer les demandes pour ne garder que celles avec statut 'en_cours'
                const demandesNonTraitees = response.data.filter(demande => demande.statut === 'en_cours');
                setDemandes(demandesNonTraitees);
                
            } catch (err) {
                setError(err.response?.data?.detail || err.message || 'Une erreur est survenue lors de la récupération des demandes.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDemandes();
    }, []);

    const handleOpenModal = (demande) => {
        setSelectedDemande(demande);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDemande(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="loader"></div><p className='ml-4 text-lg'>Chargement des demandes en cours...</p></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4 bg-red-100 rounded-md">Erreur : {error}</div>;
    }

    return (
        <>
            <div className="container mx-auto px-4 sm:px-8">
                <div className="py-8">
                    <div>
                        <h2 className="text-2xl font-semibold leading-tight">Demandes en Attente de Traitement</h2>
                    </div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Nom Complet du Citoyen
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            N° de la Demande
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date de Soumission
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demandes.length > 0 ? (
                                        demandes.map((demande) => (
                                            <tr key={demande.id}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{`${demande.citoyen.utilisateur.first_name} ${demande.citoyen.utilisateur.last_name}`}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{demande.id}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{demande.date_soumission_formatee}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                                                        <span aria-hidden className="absolute inset-0 bg-yellow-200 opacity-50 rounded-full"></span>
                                                        <span className="relative">{demande.libelle_statut}</span>
                                                    </span>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <button onClick={() => handleOpenModal(demande)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                        Traiter
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                Aucune demande en attente de traitement.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <DemandeDetailsModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                demande={selectedDemande} 
            />
        </>
    );
};

export default DemandesEnCours;
