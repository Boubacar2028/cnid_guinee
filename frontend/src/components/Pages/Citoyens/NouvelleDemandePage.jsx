import React, { useState } from 'react';
import CitoyenHeader from './CitoyenHeader';
import { ChevronRight, Loader2 } from 'lucide-react';
import DemandeEtapes from './DemandeEtapes';
import PaiementOptions from './PaiementOptions';
import { API_URL } from '../../constants';

const NouvelleDemandePage = () => {
  const [etape, setEtape] = useState(1);
  const [fichierSelectionne, setFichierSelectionne] = useState(null);
  const [showPaiement, setShowPaiement] = useState(false);
  const [demandeComplete, setDemandeComplete] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [createdDemandeNumeroSuivi, setCreatedDemandeNumeroSuivi] = useState(null);
  const [createdDemandeId, setCreatedDemandeId] = useState(null); // ID de la demande pour le paiement
  
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

  // Gestion de la soumission du formulaire
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
                {/* Contenu des étapes via le composant DemandeEtapes */}
                <DemandeEtapes 
                  etape={etape} 
                  setEtape={setEtape} 
                  formData={formData} 
                  handleChange={handleChange}
                  fichierSelectionne={fichierSelectionne}
                  setFichierSelectionne={setFichierSelectionne}
                />

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
                      onClick={() => setEtape(etape - 1)}
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
                        onClick={() => setEtape(etape + 1)}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${(!formData.typeDemande && etape === 1) || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={(!formData.typeDemande && etape === 1) || isSubmitting}
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
