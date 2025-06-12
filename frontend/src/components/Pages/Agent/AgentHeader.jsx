import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './Modals/ProfileDropdown';

const AgentHeader = ({ onOpenPasswordModal }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState({
    name: 'Agent',
    matricule: '',
    initials: 'A',
  });

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        // On lit directement depuis l'objet `parsedData` qui est maintenant plat,
        // et non plus depuis un objet `utilisateur` imbriqué.
        if (parsedData && parsedData.first_name) {
          const firstName = parsedData.first_name || '';
          const lastName = parsedData.last_name || '';
          const name = `${firstName} ${lastName}`.trim();
          const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
          
          setAgentData({
            name: name,
            matricule: parsedData.matricule || '',
            initials: initials,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'agent:", error);
      // Données de secours en cas d'erreur
      setAgentData({
        name: 'Agent',
        matricule: '',
        initials: 'A',
      });
    }
  }, []);
  
  const handleLogout = () => {
    // Vider le localStorage pour une déconnexion complète
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user_type');
    navigate('/');
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          {/* Logo et titre */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-red-600 rounded-md flex items-center justify-center">
                  <img src="/embleme.png" alt="CNI Guinée" className="h-8 w-8" />
                </div>
                <div className="ml-3">
                  <div className="text-lg font-semibold text-gray-900">CNID Guinée</div>
                  <div className="text-xs text-gray-500">Portail Agent</div>
                </div>
              </div>
            </div>
            {/* Badge de notifications */}
            <div className="ml-6 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              <span className="text-sm text-yellow-700 font-medium">0 demandes en attente</span>
            </div>
          </div>

          {/* Boutons et profil */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                className="flex items-center focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-red-600 font-medium">
                  {agentData.initials}
                </div>
                <div className="ml-2 text-sm">
                  <div className="font-medium text-gray-900">{agentData.name}</div>
                  <div className="text-xs text-gray-500">Matr {agentData.matricule}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown du profil */}
              <ProfileDropdown 
                isOpen={showProfileDropdown} 
                onClose={() => setShowProfileDropdown(false)}
                onLogout={handleLogout}
                onOpenPasswordModal={onOpenPasswordModal}
                userData={{
                  name: agentData.name,
                  initials: agentData.initials,
                  matricule: agentData.matricule
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AgentHeader;
