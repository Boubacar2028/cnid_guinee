import React from 'react';

const BiometricModal = ({ isOpen, onClose }) => {
  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full relative overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Citoyens en attente de déblocage biométrique</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-6">
          {/* En-têtes des colonnes */}
          <div className="flex border-b border-gray-200 pb-3 text-sm font-medium text-gray-600">
            <div className="w-1/3">Citoyen</div>
            <div className="w-1/4">NIN</div>
            <div className="w-1/4">Date d'approbation</div>
            <div className="w-1/6">Action</div>
          </div>
          
          {/* Message "Aucun citoyen" */}
          <div className="py-10 flex flex-col items-center justify-center">
            <svg className="h-16 w-16 text-yellow-500 opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-1">Aucun citoyen en attente</p>
            <p className="text-red-600">Aucun citoyen ne doit prendre un rendez-vous biométrique.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricModal;
