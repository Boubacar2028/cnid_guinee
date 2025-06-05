import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUserCircle, FaFileAlt, FaListAlt, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaSpinner, FaPaperclip, FaDownload, FaPrint, FaInfoCircle, FaUser, FaIdCard, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CitoyenHeader from './CitoyenHeader'; // Assurez-vous que le chemin est correct

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const DemandeDetailPage = () => {
  const [timelineItems, setTimelineItems] = useState([]);
  const { demandeId } = useParams();
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDemandeDetails = async () => {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/connexion'); // Rediriger si non connecté
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/demandes/${demandeId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setDemande(response.data);

      // Préparation des éléments de la timeline de suivi
      const fetchedDemande = response.data;
      const statusHierarchy = ['soumise', 'en_cours', 'validee'];
      const timelineStepConfigs = [
        { id: 'soumise', label: 'En attente', description: 'Votre demande a été reçue et est en attente de traitement.' },
        { id: 'en_cours', label: 'En traitement', description: "Votre demande est en cours d'examen par nos services." },
        { id: 'validee', label: 'Validée', description: "Votre demande a été approuvée et votre carte d'identité est en cours de production." },
      ];

      if (fetchedDemande.statut === 'rejetee') {
        setTimelineItems([
          {
            id: 'rejetee',
            label: 'Rejetée',
            description: fetchedDemande.motif_rejet || "Votre demande a été rejetée.",
            Icon: FaTimesCircle,
            iconBgClass: 'bg-red-500',
            iconFgClass: 'text-white',
            isCurrent: true,
          }
        ]);
      } else {
        const actualStatusForHierarchy = fetchedDemande.statut || 'soumise';
        const currentActualStatusIndexInHierarchy = statusHierarchy.indexOf(actualStatusForHierarchy);

        const items = timelineStepConfigs.map((stepConfig) => {
          let IconComponent;
          let iconBgClass, iconFgClass;
          let isStepCurrent = false;
          let stepState = 'pending'; // 'completed', 'current', 'pending'

          const stepIndexInHierarchy = statusHierarchy.indexOf(stepConfig.id);

          if (stepIndexInHierarchy < currentActualStatusIndexInHierarchy) {
            stepState = 'completed';
          } else if (stepIndexInHierarchy === currentActualStatusIndexInHierarchy) {
            stepState = 'current';
          } else { // stepIndexInHierarchy > currentActualStatusIndexInHierarchy
            stepState = 'pending';
          }

          if (stepState === 'completed') {
            IconComponent = FaCheckCircle;
            iconBgClass = 'bg-green-500';
            iconFgClass = 'text-white';
          } else if (stepState === 'current') {
            IconComponent = FaCheckCircle; // Using FaCheckCircle for current as per image (blue check)
            iconBgClass = 'bg-blue-500';
            iconFgClass = 'text-white';
            isStepCurrent = true;
          } else { // pending
            IconComponent = FaClock;
            iconBgClass = 'bg-gray-300';
            iconFgClass = 'text-gray-700';
          }

          return {
            ...stepConfig,
            Icon: IconComponent,
            iconBgClass,
            iconFgClass,
            isCurrent: isStepCurrent,
          };
        });
        setTimelineItems(items);
      }
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de la demande:', err);
        setError(err.response?.data?.detail || err.message || 'Une erreur est survenue.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Gérer la redirection ou l'affichage d'un message spécifique
          // navigate('/connexion'); // Optionnel: rediriger en cas d'erreur d'auth
        }
      }
      setIsLoading(false);
    };

    fetchDemandeDetails();
  }, [demandeId, navigate]);

  const getStatusIconAndColor = (statut) => {
    switch (statut) {
      case 'soumise':
      case 'en_attente':
        return { icon: <FaHourglassHalf className="mr-2" />, color: 'text-yellow-500', label: 'En attente' };
      case 'en_cours':
      case 'en_traitement':
        return { icon: <FaSpinner className="mr-2 animate-spin" />, color: 'text-blue-500', label: 'En cours de traitement' };
      case 'validee':
      case 'approuvee':
      case 'prete_pour_retrait':
        return { icon: <FaCheckCircle className="mr-2" />, color: 'text-green-500', label: 'Validée/Prête' };
      case 'rejetee':
        return { icon: <FaTimesCircle className="mr-2" />, color: 'text-red-500', label: 'Rejetée' };
      default:
        return { icon: <FaHourglassHalf className="mr-2" />, color: 'text-gray-500', label: 'Inconnu' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <CitoyenHeader />
        <div className="flex justify-center items-center flex-grow">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <p className="ml-3 text-lg">Chargement des détails de la demande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <CitoyenHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-red-700">Erreur</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <Link to="/portail-citoyens" className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <FaArrowLeft className="inline mr-2" /> Retour au portail
          </Link>
        </div>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <CitoyenHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold">Demande non trouvée</h1>
          <Link to="/portail-citoyens" className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <FaArrowLeft className="inline mr-2" /> Retour au portail
          </Link>
        </div>
      </div>
    );
  }

  const { icon: StatusIcon, color: statusColor, label: statusLabel } = getStatusIconAndColor(demande.statut);

  // Fonction pour afficher une information si elle existe
  const renderDetail = (label, value, icon, isDate = false) => {
    if (!value && value !== 0 && value !== false) return null;
    const displayValue = isDate ? format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: fr }) : value;
    return (
      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500 flex items-center">
          {icon && React.cloneElement(icon, { className: 'mr-2 text-gray-400' })}
          {label}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{displayValue}</dd>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <CitoyenHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <FaFileAlt className="mr-3" /> Détails de la Demande
              </h1>
              <Link 
                to="/portail-citoyens" 
                className="text-white hover:text-indigo-200 transition-colors duration-150 flex items-center"
                title="Retour au portail"
              >
                <FaArrowLeft className="mr-2" /> Retour
              </Link>
            </div>
            <p className="mt-2 text-indigo-200 text-lg">
              Référence: CNID-{demande.id}
            </p>
          </div>

          {/* Section Suivi de la demande */} 
          {timelineItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Suivi de la demande</h3>
              <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
                {timelineItems.map((item, index) => (
                  <li key={item.id || index} className="mb-10 ml-6">
                    <span className={`absolute flex items-center justify-center w-8 h-8 ${item.iconBgClass} rounded-full -left-4 ring-4 ring-white dark:ring-gray-900`}>
                      <item.Icon className={`w-4 h-4 ${item.iconFgClass}`} />
                    </span>
                    <h4 className={`text-lg font-semibold ${item.isCurrent ? (item.iconBgClass.includes('blue') ? 'text-blue-600' : item.iconBgClass.includes('red') ? 'text-red-600' : 'text-gray-900') : 'text-gray-900'} dark:text-white`}>
                      {item.label}
                      {item.isCurrent && !item.iconBgClass.includes('red') && (
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium ml-3 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Actuel</span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Informations du Demandeur */}
          {demande.citoyen && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUserCircle className="mr-2 text-blue-500" /> Informations du Demandeur
              </h2>
              <dl className="divide-y divide-gray-200">
                {renderDetail('Nom complet', `${demande.citoyen.utilisateur.first_name || ''} ${demande.citoyen.utilisateur.last_name || ''}`, <FaUserCircle />)}
                {renderDetail('Email', demande.citoyen.utilisateur.email, <FaUserCircle />)}
                {renderDetail('Téléphone', demande.citoyen.utilisateur.telephone, <FaUserCircle />)}
                {renderDetail('NIN', demande.citoyen.nin, <FaUserCircle />)}
                {renderDetail('Date de naissance', demande.citoyen.date_naissance, <FaCalendarAlt />, true)}
                {renderDetail('Lieu de naissance', demande.citoyen.lieu_naissance, <FaUserCircle />)}
                {renderDetail('Sexe', demande.citoyen.sexe === 'M' ? 'Masculin' : 'Féminin', <FaUserCircle />)}
                {renderDetail('Nationalité', demande.citoyen.nationalite, <FaUserCircle />)}
                {renderDetail('Adresse', demande.citoyen.adresse, <FaUserCircle />)}
                {renderDetail('Profession', demande.citoyen.profession, <FaUserCircle />)}
                {renderDetail('Situation matrimoniale', demande.citoyen.situation_matrimoniale, <FaUserCircle />)}
              </dl>
            </div>
          )}

          {/* Détails de la demande CNI */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" /> Informations Fournies pour la CNI
            </h2>
            <dl className="divide-y divide-gray-200">
              {renderDetail('Type de demande', demande.libelle_type_demande, <FaFileAlt />)}
              {renderDetail('Nom sur CNI', demande.nom_sur_cni, <FaFileAlt />)}
              {renderDetail('Prénom sur CNI', demande.prenom_sur_cni, <FaFileAlt />)}
              {renderDetail('Date de naissance (CNI)', demande.date_naissance_sur_cni, <FaCalendarAlt />, true)}
              {renderDetail('Lieu de naissance (CNI)', demande.lieu_naissance_sur_cni, <FaFileAlt />)}
              {renderDetail('Sexe (CNI)', demande.sexe_sur_cni, <FaFileAlt />)}
              {renderDetail('Taille (cm)', demande.taille_sur_cni, <FaFileAlt />)}
              {renderDetail('Profession (CNI)', demande.profession_sur_cni, <FaFileAlt />)}
              {renderDetail('Adresse de résidence (CNI)', demande.adresse_residence_sur_cni, <FaFileAlt />)}
              {renderDetail('Nom du père (CNI)', demande.nom_pere_sur_cni, <FaFileAlt />)}
              {renderDetail('Nom de la mère (CNI)', demande.nom_mere_sur_cni, <FaFileAlt />)}
              {renderDetail('Numéro extrait de naissance', demande.numero_extrait_naissance, <FaFileAlt />)}
              {renderDetail('Date de soumission', demande.date_soumission, <FaCalendarAlt />, true)}
              {demande.date_traitement && renderDetail('Date de dernier traitement', demande.date_traitement, <FaCalendarAlt />, true)}
            </dl>
          </div>

          {/* Documents Fournis */}
          {demande.documents && demande.documents.length > 0 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaPaperclip className="mr-2 text-blue-500" /> Documents Fournis ({demande.nombre_documents})
              </h2>
              <ul className="space-y-3">
                {demande.documents.map(doc => (
                  <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-all duration-150">
                    <div className="flex items-center">
                      <FaFileAlt className="text-lg text-gray-500 mr-3" />
                      <span className="text-sm font-medium text-gray-700">{doc.nom_fichier || 'Document sans nom'} ({doc.type_document})</span>
                    </div>
                    {doc.fichier && (
                      <a 
                        href={`${API_URL}${doc.fichier}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-colors duration-150"
                        title={`Télécharger ${doc.nom_fichier || 'document'}`}
                      >
                        <FaDownload className="mr-1" /> Télécharger
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions (Ex: Imprimer) */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 text-right">
            <button 
              onClick={() => window.print()} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-150 flex items-center ml-auto"
            >
              <FaPrint className="mr-2" /> Imprimer la page
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DemandeDetailPage;
