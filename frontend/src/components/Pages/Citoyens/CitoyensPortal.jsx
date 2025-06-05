import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assurez-vous qu'axios est installé ou utilisez votre client HTTP
import CitoyenHeader from './CitoyenHeader';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaSignOutAlt, FaEnvelope, FaEnvelopeOpen, FaTimes, FaPaperPlane, FaFolderOpen, FaCalendarAlt, FaClock, FaFileAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale'; // Ajout pour le modal

// Style pour le modal (peut être externalisé)
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

Modal.setAppElement('#root'); // Pour l'accessibilité, s'assurer que #root est l'id de votre app root

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CitoyensPortal = () => {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [isLoadingDemandes, setIsLoadingDemandes] = useState(true); 
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Erreur parsing userData from localStorage:', error);
        // Optionnel: gérer l'erreur, par exemple en supprimant les données corrompues
        localStorage.removeItem('userData');
      }
    }

    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const token = localStorage.getItem('access_token'); // Clé mise à jour
        if (!token) {
          console.error('Token non trouvé, impossible de récupérer les notifications.');
          setLoadingNotifications(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/notifications/`, { // Assurez-vous que l'URL est correcte
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        // Gérer l'erreur, par exemple afficher un message à l'utilisateur
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();

    const fetchDemandes = async () => {
      setIsLoadingDemandes(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("Token non trouvé, impossible de récupérer les demandes.");
        setIsLoadingDemandes(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/mes-demandes/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDemandes(data);
        } else {
          console.error('Erreur lors de la récupération des demandes:', response.status, response.statusText);
          const errorData = await response.json().catch(() => ({}));
          setDemandes([]); // Vider les demandes en cas d'erreur de réponse
          // Afficher une erreur à l'utilisateur si nécessaire
        }
      } catch (error) {
        console.error('Erreur réseau ou autre lors de la récupération des demandes:', error);
        setDemandes([]); // Vider les demandes en cas d'erreur réseau
      } finally {
        setIsLoadingDemandes(false);
      }
    };

    fetchDemandes();
  }, [API_URL]);

  const openModal = (notification) => {
    setSelectedNotification(notification);
    setModalIsOpen(true);
    // Ici, nous appellerons l'API pour marquer comme lue si elle ne l'est pas déjà
    if (notification.statut !== 'lue') {
      markAsRead(notification.id);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedNotification(null);
  };

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("Token non trouvé, impossible de marquer comme lu.");
      // Gérer l'absence de token, peut-être rediriger vers login
      return;
    }
    try {
      await axios.patch(`http://localhost:8000/api/notifications/${notificationId}/mark-as-read/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Mettre à jour l'état local de la notification pour la marquer comme lue
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId ? { ...notif, statut: 'lue' } : notif
        )
      );
    } catch (err) {
      console.error("Erreur lors du marquage de la notification comme lue:", err);
      // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    }
  };

  return (
    <>
      <CitoyenHeader />
      <div className="bg-gray-100 pt-14 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-60px)]">
        <div className="max-w-7xl mx-auto">
          {/* En-tête du tableau de bord */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">
                {userData ? `Bienvenue, ${userData.firstName} ${userData.lastName}` : 'Chargement...'}
              </p>
            </div>
            <button
              onClick={() => navigate('/portail-citoyens/nouvelle-demande')}
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center sm:justify-start"
            >
              <span className="mr-1">+</span> Nouvelle demande
            </button>
          </div>

          {/* Contenu principal - trois colonnes sur grand écran */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 sm:px-0">
            {/* Colonne de gauche - Mes demandes (2/3 de la largeur) */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaFolderOpen className="mr-3 text-blue-600" /> Mes Demandes
                </h2>
              </div>
              
              <div className="p-6">
                {isLoadingDemandes ? (
                  <p className="text-gray-500 text-center">Chargement des demandes...</p>
                ) : demandes.length > 0 ? (
                  <div className="space-y-6">
                    {demandes.map(demande => (
                      <Link to={`/portail-citoyens/demandes/${demande.id}`} key={demande.id} className="block bg-white shadow-md rounded-lg p-5 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-blue-700 truncate">{demande.libelle_type_demande}</h3>
                          <span 
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${ 
                              demande.statut === 'en_cours' ? 'bg-yellow-100 text-yellow-700' :
                              demande.statut === 'validee' ? 'bg-green-100 text-green-700' :
                              demande.statut === 'rejetee' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {demande.libelle_statut}
                          </span>
                        </div>
                        <p className="text-md text-gray-600 mb-1">Demandeur: {demande.citoyen && demande.citoyen.utilisateur ? `${demande.citoyen.utilisateur.first_name || ''} ${demande.citoyen.utilisateur.last_name || ''}`.trim() || 'N/A' : 'N/A'}</p>
                        <div className="text-sm text-gray-500 space-y-2">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" /> 
                            Soumis le {demande.date_soumission_formatee}
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-2 text-gray-400" /> 
                            Mis à jour {formatDistanceToNow(new Date(demande.date_mise_a_jour), { addSuffix: true, locale: fr })}
                          </div>
                          <div className="flex items-center">
                            <FaFileAlt className="mr-2 text-gray-400" /> 
                            {demande.nombre_documents} document{demande.nombre_documents !== 1 ? 's' : ''} associé{demande.nombre_documents !== 1 ? 's' : ''}
                          </div>
                        </div>
                        {/* Vous pouvez ajouter un bouton/lien ici pour voir les détails de la demande si nécessaire */}
                        {/* <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">Voir détails</button> */}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">Vous n'avez aucune demande pour le moment.</p>
                )}
              </div>
            </div>

            {/* Colonne de droite - Notifications */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                {/* Bouton "Tout marquer comme lu" - fonctionnalité à implémenter */}
                {/* <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Tout marquer comme lu
                </button> */}
              </div>
              
              <div className="p-6">
                {loadingNotifications ? (
                  <p className="text-gray-500 text-center">Chargement des notifications...</p>
                ) : notifications.length > 0 ? (
                  <ul className="space-y-3">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`bg-white shadow rounded-lg p-4 mb-3 hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer ${notif.statut !== 'lue' ? 'border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                        onClick={() => openModal(notif)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {notif.statut !== 'lue' ? 
                              <FaEnvelope className="text-blue-500 mr-3 text-xl" /> : 
                              <FaEnvelopeOpen className="text-gray-500 mr-3 text-xl" />
                            }
                            <p className={`text-sm ${notif.statut !== 'lue' ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}>
                              {notif.contenu.substring(0, 100)}{notif.contenu.length > 100 && '...'}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                            {new Date(notif.date_envoi_formatee ? notif.date_envoi_formatee.split(' ')[0].split('-').reverse().join('-') + ' ' + notif.date_envoi_formatee.split(' ')[1] : notif.date_creation).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {notif.demande_id && (
                          <div className="mt-2 text-right">
                            <Link to={`/portail-citoyens/mes-demandes/${notif.demande_id}`} className="text-xs text-blue-600 hover:text-blue-800" onClick={(e) => e.stopPropagation()}>
                              Voir la demande associée
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center">Aucune notification pour le moment.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section Guide des démarches et Rendez-vous */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Guide des démarches - prend 2/3 de l'espace sur desktop */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Guide des démarches</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Première demande */}
                <Link to="/portail-citoyens/aide#premiere-demande" className="block transition-transform duration-300 hover:scale-105 hover:shadow-md active:bg-blue-200">
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-100 h-full hover:bg-red-100 transition-colors duration-300">
                    <h3 className="font-medium text-red-800 mb-2 flex items-center">
                      Première demande
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    <p className="text-sm text-red-700">Comment effectuer votre première demande de carte d'identité</p>
                  </div>
                </Link>
                
                {/* Renouvellement */}
                <Link to="/portail-citoyens/aide#renouvellement" className="block transition-transform duration-300 hover:scale-105 hover:shadow-md active:bg-green-200">
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100 h-full hover:bg-green-100 transition-colors duration-300">
                    <h3 className="font-medium text-green-800 mb-2 flex items-center">
                      Renouvellement
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    <p className="text-sm text-green-700">Procédure pour renouveler votre carte d'identité existante</p>
                  </div>
                </Link>
                
                {/* Perte ou vol */}
                <Link to="/portail-citoyens/aide#perte-vol" className="block transition-transform duration-300 hover:scale-105 hover:shadow-md active:bg-yellow-200">
                  <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-100 h-full hover:bg-yellow-100 transition-colors duration-300">
                    <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                      Perte ou vol
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    <p className="text-sm text-yellow-700">Démarches à suivre en cas de perte ou de vol de votre carte</p>
                  </div>
                </Link>
                
                {/* Retirer ma carte */}
                <Link to="/portail-citoyens/aide#retirer-carte" className="block transition-transform duration-300 hover:scale-105 hover:shadow-md active:bg-purple-200">
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-100 h-full hover:bg-red-100 transition-colors duration-300">
                    <h3 className="font-medium text-red-800 mb-2 flex items-center">
                      Retirer ma carte
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    <p className="text-sm text-red-700">Comment et où récupérer votre nouvelle carte d'identité</p>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Rendez-vous - prend 1/3 de l'espace sur desktop */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Rendez-vous</h2>
              </div>
              
              <div className="p-6 text-center flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
                <p className="text-gray-500 mt-2">Vous n'avez pas de rendez-vous programmé.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedNotification && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customModalStyles}
          contentLabel="Détails de la Notification"
        >
          <h2 className="text-xl font-semibold mb-4">Détails de la Notification</h2>
          <div className="mb-2">
            <span className="font-semibold">Date:</span> {new Date(selectedNotification.date_envoi_formatee ? selectedNotification.date_envoi_formatee.split(' ')[0].split('-').reverse().join('-') + ' ' + selectedNotification.date_envoi_formatee.split(' ')[1] : selectedNotification.date_creation).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Message:</span>
            <p className="whitespace-pre-wrap text-gray-700 mt-1">{selectedNotification.contenu}</p>
          </div>
          {selectedNotification.demande_id && (
            <div className="mb-4">
              <Link 
                to={`/portail-citoyens/mes-demandes/${selectedNotification.demande_id}`} 
                className="text-blue-600 hover:text-blue-800"
                onClick={closeModal} // Ferme le modal avant la navigation
              >
                Voir la demande N° {selectedNotification.demande_id}
              </Link>
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={async () => {
                if (!selectedNotification) return;
                const token = localStorage.getItem('access_token');
                if (!token) {
                  console.error("Token non trouvé, impossible de télécharger le reçu.");
                  // Gérer l'absence de token
                  return;
                }
                try {
                  const response = await fetch(`${API_URL}/api/notifications/${selectedNotification.id}/telecharger-recu/`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                  });
                  if (response.ok) {
                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    // Extraire le nom du fichier de l'en-tête Content-Disposition si disponible, sinon utiliser un nom par défaut
                    const disposition = response.headers.get('content-disposition');
                    let filename = `recu_paiement_CNID-${selectedNotification.demande_id}.pdf`; // Nom par défaut
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        const matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) { 
                            filename = matches[1].replace(/['"]/g, '');
                        }
                    }
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(downloadUrl); // Libérer l'URL de l'objet
                  } else {
                    // Gérer les erreurs HTTP (ex: 404, 500)
                    const errorData = await response.json().catch(() => ({})); // Essayer de parser l'erreur JSON
                    console.error('Erreur lors du téléchargement du reçu:', response.status, response.statusText, errorData);
                    alert(`Erreur lors du téléchargement du reçu: ${errorData.error || response.statusText}`);
                  }
                } catch (error) {
                  console.error('Erreur réseau ou autre lors du téléchargement du reçu:', error);
                  alert('Une erreur est survenue lors de la tentative de téléchargement du reçu.');
                }
              }} 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              Télécharger le reçu
            </button>
            <button 
              onClick={closeModal} 
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Fermer
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CitoyensPortal;