import React, { useState } from 'react';
import CitoyenHeader from './CitoyenHeader';
import { ChevronRight, Loader2 } from 'lucide-react';
import DemandeEtapes from './DemandeEtapes';
import PaiementOptions from './PaiementOptions';
import { API_URL } from '../../constants';

const NouvelleDemandePage = () => {
  // États pour chaque étape
  const [etape, setEtape] = useState(1);
  const [etape1Complete, setEtape1Complete] = useState(false);
  const [etape2Complete, setEtape2Complete] = useState(false);
  const [etape3Complete, setEtape3Complete] = useState(false);
  const [etape4Complete, setEtape4Complete] = useState(false);
  const [etape5Complete, setEtape5Complete] = useState(false);
  const [etape6Complete, setEtape6Complete] = useState(false);
  const [etape7Complete, setEtape7Complete] = useState(false);
  const [etape8Complete, setEtape8Complete] = useState(false);
  const [etape9Complete, setEtape9Complete] = useState(false);
  const [etape10Complete, setEtape10Complete] = useState(false);
  
  // États pour les erreurs de validation
  const [validationErrors, setValidationErrors] = useState({
    etape1: {},
    etape2: {},
    etape3: {},
    etape4: {},
    etape5: {},
    etape6: {},
    etape7: {},
    etape8: {},
    etape9: {},
    etape10: {}
  });
  const [fichierSelectionne, setFichierSelectionne] = useState(null);
  const [showPaiement, setShowPaiement] = useState(false);
  const [demandeComplete, setDemandeComplete] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [createdDemandeNumeroSuivi, setCreatedDemandeNumeroSuivi] = useState(null);
  const [createdDemandeId, setCreatedDemandeId] = useState(null); // ID de la demande pour le paiement

  // État pour les documents uploadés
  const [documents, setDocuments] = useState({
    extraitNaissance: null,
    certificatResidence: null,
    photoIdentite: null,
  });
  
  // État unique pour toutes les données du formulaire
  const [formData, setFormData] = useState({
    typeDemande: '',
    
    // Informations personnelles
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    nin: '',
    sexe: '',
    statutNationalite: 'Naissance',
    profession: '',
    domicile: '',
    situationMatrimoniale: '',
    
    // Signalement
    taille: '',
    teint: '',
    signesParticuliers: '',
    couleurCheveux: '',
    
    // Informations ascendantes
    prenomPere: '',
    prenomMere: '',
    nomMere: ''
  });
  
  // Fonction pour mettre à jour les champs du formulaire
  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Gestion de la sélection des fichiers
  const handleFileChange = (type, file) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  // Validation des champs pour chaque étape
  const validateEtape = (etapeNum) => {
    const errors = {};

    // La validation est effectuée à chaque fois pour garantir la cohérence des données
    switch (etapeNum) {
      case 1: // Type de demande
        if (!formData.typeDemande) {
          errors.typeDemande = "Veuillez sélectionner un type de demande";
        }
        break;
      case 2: // Informations personnelles
        if (!formData.nom) errors.nom = "Le nom est requis";
        if (!formData.prenom) errors.prenom = "Le prénom est requis";
        if (!formData.dateNaissance) errors.dateNaissance = "La date de naissance est requise";
        if (!formData.lieuNaissance) errors.lieuNaissance = "Le lieu de naissance est requis";
        if (!formData.nin) errors.nin = "Le NIN est requis";
        if (!formData.sexe) errors.sexe = "Le sexe est requis";
        if (!formData.statutNationalite) errors.statutNationalite = "Le statut de nationalité est requis";
        if (!formData.profession) errors.profession = "La profession est requise";
        if (!formData.domicile) errors.domicile = "Le domicile est requis";
        if (!formData.situationMatrimoniale) errors.situationMatrimoniale = "La situation matrimoniale est requise";
        break;
      case 3: // Signalement
        if (!formData.taille) errors.taille = "La taille est requise";
        if (!formData.teint) errors.teint = "Le teint est requis";
        if (!formData.couleurCheveux) errors.couleurCheveux = "La couleur des cheveux est requise";
        break;
      case 4: // Informations ascendantes
        if (!formData.prenomPere) errors.prenomPere = "Le prénom du père est requis";
        if (!formData.prenomMere) errors.prenomMere = "Le prénom de la mère est requis";
        if (!formData.nomMere) errors.nomMere = "Le nom de la mère est requis";
        break;
      case 5: // Documents
        if (!documents.extraitNaissance || !documents.certificatResidence || !documents.photoIdentite) {
          errors.documents = "Veuillez téléverser tous les documents requis.";
        }
        break;
      default:
        break;
    }
    return errors;
  };

  // Fonction pour passer à l'étape suivante
  const handleNext = (currentEtape) => {
    const errors = validateEtape(currentEtape);
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [`etape${currentEtape}`]: errors
    }));

    if (Object.keys(errors).length === 0) {
      // Si aucune erreur, marquer l'étape comme complète et passer à la suivante
      const etapeCompleteState = `etape${currentEtape}Complete`;
      setEtape(prev => {
        // Utiliser l'état approprié en fonction de l'étape
        switch (currentEtape) {
          case 1: setEtape1Complete(true); break;
          case 2: setEtape2Complete(true); break;
          case 3: setEtape3Complete(true); break;
          case 4: setEtape4Complete(true); break;
          case 5: setEtape5Complete(true); break;
          case 6: setEtape6Complete(true); break;
          case 7: setEtape7Complete(true); break;
          case 8: setEtape8Complete(true); break;
          case 9: setEtape9Complete(true); break;
          case 10: setEtape10Complete(true); break;
        }
        return prev + 1;
      });
    }
  };

  // Fonction pour revenir à l'étape précédente
  const handlePrevious = () => {
    setEtape(prev => prev - 1);
  };

  // Gestion de la soumission finale du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    const token = localStorage.getItem('access_token');
    if (!token) {
      setSubmissionError("Vous n'êtes pas authentifié. Veuillez vous reconnecter.");
      setIsSubmitting(false);
      return;
    }

    // Pour l'instant, nous envoyons uniquement le type de demande.
    // TODO: Étendre pour envoyer toutes les données du formulaire (formData)
    const demandeData = {
      type_demande: formData.typeDemande,
    };

    try {
      const response = await fetch(`${API_URL}/api/demandes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(demandeData),
      });

      if (response.status === 201) {
        const data = await response.json();
        setCreatedDemandeNumeroSuivi(data.numero_suivi || `CNI-${data.id}`);
        setCreatedDemandeId(data.id); // Stocker l'ID de la demande pour le paiement
        setShowPaiement(true); // Afficher les options de paiement 
      } else {
        const errorData = await response.json();
        let errorMessage = "Une erreur est survenue lors de la création de la demande.";
        if (errorData && typeof errorData === 'object') {
          // Essayer de trouver un message d'erreur plus spécifique
          if (errorData.detail) errorMessage = errorData.detail;
          else if (errorData.message) errorMessage = errorData.message;
          else if (Object.keys(errorData).length > 0) errorMessage = JSON.stringify(errorData);
        }
        setSubmissionError(errorMessage + ` (Statut: ${response.status})`);
      }
    } catch (error) {
      console.error('Erreur de soumission de la demande:', error);
      setSubmissionError('Une erreur réseau est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Gestion de la fermeture de la fenêtre de paiement
  const handleClosePaiement = () => {
    setShowPaiement(false);
  };
  
  // Gestion du paiement réussi
  const handlePaymentComplete = () => {
    setShowPaiement(false);
    setDemandeComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <CitoyenHeader />
      
      {/* Espacement supplémentaire pour éviter que le header ne cache le contenu */}
      <div className="h-16"></div>
      
      {demandeComplete ? (
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Demande envoyée avec succès !</h1>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Votre demande de carte nationale d'identité a été enregistrée. Vous recevrez bientôt un SMS vous invitant à vous présenter pour la prise des données biométriques.  
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 inline-block">
                <p className="text-sm text-blue-800 font-medium">Numéro de suivi:</p>
                <p className="text-lg font-mono font-bold">{createdDemandeNumeroSuivi || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle demande de carte d'identité</h1>
              
              {/* Indicateur d'étapes */}
              <div className="relative mb-8 overflow-x-auto pb-2">
                <div className="flex space-x-2 md:space-x-4 min-w-max">
                  <div className={`flex flex-col items-center ${etape >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${etape >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      1
                    </div>
                    <span className="text-xs font-medium">Type</span>
                  </div>
                  
                  <div className="flex-1 flex items-center">
                    <div className={`h-0.5 w-full ${etape > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  <div className={`flex flex-col items-center ${etape >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${etape >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      2
                    </div>
                    <span className="text-xs font-medium">Infos</span>
                  </div>
                  
                  <div className="flex-1 flex items-center">
                    <div className={`h-0.5 w-full ${etape > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  <div className={`flex flex-col items-center ${etape >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${etape >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      3
                    </div>
                    <span className="text-xs font-medium">Signalement</span>
                  </div>
                  
                  <div className="flex-1 flex items-center">
                    <div className={`h-0.5 w-full ${etape > 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  <div className={`flex flex-col items-center ${etape >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${etape >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      4
                    </div>
                    <span className="text-xs font-medium">Ascendants</span>
                  </div>
                  
                  <div className="flex-1 flex items-center">
                    <div className={`h-0.5 w-full ${etape > 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  <div className={`flex flex-col items-center ${etape >= 5 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${etape >= 5 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      5
                    </div>
                    <span className="text-xs font-medium">Documents</span>
                  </div>
                  
                  <div className="flex-1 flex items-center">
                    <div className={`h-0.5 w-full ${etape > 5 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  <div className={`flex flex-col items-center ${etape >= 6 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${etape >= 6 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      6
                    </div>
                    <span className="text-xs font-medium">Récapitulatif</span>
                  </div>
                </div>
              </div>
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-8">
                  <CitoyenHeader />
                  <DemandeEtapes 
                    etape={etape}
                    formData={formData}
                    handleChange={handleChange}
                    documents={documents}
                    handleFileChange={handleFileChange}
                    validationErrors={validationErrors}
                    handleNext={handleNext}
                    handlePrevious={handlePrevious}
                  />
                </div>

                {submissionError && (
                  <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
                    <p className="font-semibold mb-1">Erreur lors de la soumission :</p>
                    <p>{submissionError}</p>
                  </div>
                )}
                
                {/* Boutons de navigation */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  {etape > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={isSubmitting}
                    >
                      Précédent
                    </button>
                  )}
                  
                  <div className="ml-auto">
                    {etape < 6 ? (
                      <button
                        type="button"
                        onClick={() => handleNext(etape)}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                      >
                        Suivant
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center w-full md:w-auto ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="animate-spin mr-2" />
                            Soumission en cours...
                          </>
                        ) : (
                          'Soumettre la demande'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Composant de paiement */}
      {showPaiement && createdDemandeId && (
        <PaiementOptions
          demandeId={createdDemandeId} // Passer l'ID de la demande
          onClose={handleClosePaiement}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default NouvelleDemandePage;
