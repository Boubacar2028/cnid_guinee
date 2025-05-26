import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './Modals/ProfileDropdown';

const AgentHeader = ({ onOpenPasswordModal }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Logique de déconnexion
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
                  <img src="/emblème.png" alt="CNI Guinée" className="h-8 w-8" />
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
            <button 
              onClick={onOpenPasswordModal}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded flex items-center text-sm transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Changer le mot de passe
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                className="flex items-center focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-red-600 font-medium">
                  FC
                </div>
                <div className="ml-2 text-sm">
                  <div className="font-medium text-gray-900">Fatounata CAMARA</div>
                  <div className="text-xs text-gray-500">Matr AG00234</div>
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
                userData={{
                  name: "Fatounata CAMARA",
                  initials: "FC",
                  matricule: "AG00234"
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
