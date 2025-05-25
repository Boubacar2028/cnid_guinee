import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';

const CitoyenHeader = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm py-2 sm:py-3 px-4 fixed top-0 w-full z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo et Navigation links */}
          <div className="flex items-center">
            {/* Bouton menu mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-2 text-gray-700 hover:text-blue-600 md:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Logo avec emblème */}
            <div className="flex items-center mr-6">
              <img src="/emblème.png" alt="Emblème de la Guinée" className="h-8 w-8 object-contain mr-2" />
            </div>
            
            {/* Navigation links - desktop */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Link to="/biometrie" className="text-gray-700 hover:text-blue-600 font-medium text-sm lg:text-base">
                Biométrie
              </Link>
              <Link to="/portail-citoyens" className="text-gray-700 hover:text-blue-600 font-medium text-sm lg:text-base">
                Tableau de bord
              </Link>
              
              <Link to="/nouvelle-demande" className="text-gray-700 hover:text-blue-600 font-medium text-sm lg:text-base">
                Nouvelle demande
              </Link>
      
              <Link to="/historique" className="text-gray-700 hover:text-blue-600 font-medium text-sm lg:text-base">
                Historique
              </Link>
              <Link to="/aide" className="text-gray-700 hover:text-blue-600 font-medium text-sm lg:text-base">
                Aide
              </Link>
            </nav>
          </div>
          
          {/* User profile and notifications */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Notification bell */}
            <button className="relative p-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User profile */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-1 md:space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  BB
                </div>
                <span className="hidden sm:inline text-gray-700 font-medium text-sm md:text-base">Boubacar Bah</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mon profil
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Se déconnecter
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 border-t border-gray-100 pt-2">
            <Link to="/biometrie" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Biométrie
            </Link>
            <Link to="/portail-citoyens" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Tableau de bord
            </Link>
            <Link to="/nouvelle-demande" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Nouvelle demande
            </Link>
            <Link to="/aide" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Aide
            </Link>
            <Link to="/historique" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Historique
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default CitoyenHeader;