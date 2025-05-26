import React, { useState } from 'react';

const DemandesSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Simuler une recherche (sera remplacé par une vraie recherche plus tard)
  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className="w-full">
      {/* Barre de recherche */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-400 absolute left-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, NIN ou ID..."
              className="w-full border border-gray-300 rounded-md pl-10 py-3 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      
      {/* Liste des demandes (vide pour l'instant) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex justify-center">
            <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center justify-center">
            <svg className="h-16 w-16 text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-1">Aucune demande en attente</p>
            <p className="text-gray-500">Les demandes approuvées ou rejetées apparaîtront ici.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandesSection;
