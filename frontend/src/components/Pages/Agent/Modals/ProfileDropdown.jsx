import React from 'react';

const ProfileDropdown = ({ isOpen, onClose, onLogout, userData }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-medium">
            {userData?.initials || 'FC'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{userData?.name || 'Fatounata CAMARA'}</p>
            <p className="text-xs text-gray-500">Matricule: {userData?.matricule || 'AG00234'}</p>
          </div>
        </div>
      </div>
      <button 
        onClick={onLogout}
        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Se déconnecter
      </button>
    </div>
  );
};

export default ProfileDropdown;
