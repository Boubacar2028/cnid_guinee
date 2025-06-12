import React from 'react';

// Icons using inline SVG for simplicity and consistency
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);


const DemandeDetailsModal = ({ isOpen, onClose, demande }) => {
  if (!isOpen) return null;

  // Updated static data to match the new API structure
  const staticDemande = {
    id: 'CNI001234',
    citoyen: {
      utilisateur: {
        first_name: 'Mamadou',
        last_name: 'DIALLO',
        telephone: '+224 620 123 456',
        email: 'mamadou.diallo@email.com',
      },
      nin: '123456789012',
      date_naissance: '15/05/1990',
      lieu_naissance: 'Conakry',
      sexe: 'Masculin',
      nationalite: 'Guinéenne',
      adresse: 'Coleah, Matam, Conakry',
      profession: 'Ingénieur',
      situation_matrimoniale: 'Célibataire',
      pere_prenom: 'Thierno',
      pere_nom: 'DIALLO',
      mere_prenom: 'Aissatou',
      mere_nom: 'BAH',
      taille: 180,
      teint: 'Noir',
      signe_particulier: 'Cicatrice sur la joue gauche',
    },
    documents: [
      { name: 'Extrait de naissance', status: 'valid' },
      { name: "Photo d'identité", status: 'valid' },
      { name: 'Certificat de nationalité', status: 'valid' },
      { name: 'Certificat de résidence', status: 'invalid' },
    ],
  };

  const data = demande || staticDemande;

  // Helper component to display a field, avoiding repetition
  const InfoField = ({ label, value }) => (
    <div>
      <label className="text-gray-500 block">{label}</label>
      <p className="font-semibold text-gray-800 break-words">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Traitement de la demande {data?.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Citizen's Profile Information */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du Citoyen (Profil)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
              <InfoField label="Prénom(s)" value={data.citoyen?.utilisateur?.first_name} />
              <InfoField label="Nom" value={data.citoyen?.utilisateur?.last_name} />
              <InfoField label="NIN" value={data.citoyen?.nin} />
              <InfoField label="Date de naissance" value={data.citoyen?.date_naissance} />
              <InfoField label="Lieu de naissance" value={data.citoyen?.lieu_naissance} />
              <InfoField label="Sexe" value={data.citoyen?.sexe} />
              <InfoField label="Nationalité" value={data.citoyen?.nationalite} />
              <InfoField label="Adresse" value={data.citoyen?.adresse} />
              <InfoField label="Profession" value={data.citoyen?.profession} />
              <InfoField label="Situation Matrimoniale" value={data.citoyen?.situation_matrimoniale} />
              <InfoField label="Père (Prénom & Nom)" value={`${data.citoyen?.pere_prenom || ''} ${data.citoyen?.pere_nom || ''}`.trim()} />
              <InfoField label="Mère (Prénom & Nom)" value={`${data.citoyen?.mere_prenom || ''} ${data.citoyen?.mere_nom || ''}`.trim()} />
              <InfoField label="Téléphone" value={data.citoyen?.utilisateur?.telephone} />
              <InfoField label="Email" value={data.citoyen?.utilisateur?.email} />
            </div>
          </div>
          
          {/* Physical Information */}
          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Physiques</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                <InfoField label="Taille (cm)" value={data.citoyen?.taille} />
                <InfoField label="Teint" value={data.citoyen?.teint} />
                <InfoField label="Signe particulier" value={data.citoyen?.signe_particulier} />
            </div>
          </div>

          {/* Documents fournis */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documents fournis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.documents?.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <div className="flex items-center">
                        {doc.status === 'valid' ? <CheckCircleIcon /> : <XCircleIcon />}
                        <span className="ml-3 text-gray-700">{doc.name}</span>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-200">
                        <DownloadIcon />
                    </button>
                </div>
              ))}
            </div>
          </div>

          {/* NIN Verification */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vérification et Actions</h3>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Vérifier NIN
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifier activation
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-start items-center p-4 border-t bg-gray-50 rounded-b-lg space-x-3 sticky bottom-0 z-10">
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Rejeter la demande
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
            Demander des documents
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Envoyer un message
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemandeDetailsModal;
