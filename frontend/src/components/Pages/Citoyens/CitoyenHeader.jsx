import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, User, HelpCircle, FileText, Home, Calendar } from 'lucide-react';

const CitoyenHeader = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Erreur parsing userData from localStorage:', error);
        localStorage.removeItem('userData'); // Supprimer les données corrompues
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('userData');
    setUserData(null); // Réinitialiser l'état local
    navigate('/'); // Rediriger vers la page d'accueil/connexion
  };
  const location = useLocation();
  
  // Déterminer la page active
  const isActive = (path) => location.pathname === path;
  
  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fermer les menus si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);
  
  return (
    <header className={`bg-white ${scrolled ? 'shadow-md' : 'shadow-sm'} py-2 sm:py-3 px-4 fixed top-0 w-full z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo et Navigation links */}
          <div className="flex items-center">
            {/* Bouton menu mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-2 text-gray-700 hover:text-green-600 md:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Logo avec emblème */}
            <Link to="/portail-citoyens" className="flex items-center mr-6 group">
              <div className="relative">
                <img src="/embleme.png" alt="Emblème de la Guinée" className="h-10 w-10 object-contain mr-2 transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 w-0 group-hover:w-full transition-all duration-300"></span>
              </div>
              <span className="font-semibold text-gray-800 hidden sm:block">CNID Guinée</span>
            </Link>
            
            {/* Navigation links - desktop */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-6">
              <Link to="/portail-citoyens/biometrie" className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isActive('/portail-citoyens/biometrie') ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Calendar size={18} className="mr-2" />
                <span className="font-medium text-sm lg:text-base">Biométrie</span>
              </Link>
              <Link to="/portail-citoyens" className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isActive('/portail-citoyens') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Home size={18} className="mr-2" />
                <span className="font-medium text-sm lg:text-base">Tableau de bord</span>
              </Link>
              
              <Link to="/portail-citoyens/nouvelle-demande" className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isActive('/portail-citoyens/nouvelle-demande') ? 'bg-yellow-50 text-yellow-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <FileText size={18} className="mr-2" />
                <span className="font-medium text-sm lg:text-base">Nouvelle demande</span>
              </Link>
              
              <Link to="/portail-citoyens/historique" className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isActive('/portail-citoyens/historique') ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Bell size={18} className="mr-2" />
                <span className="font-medium text-sm lg:text-base">Historique</span>
              </Link>
              
              <Link to="/portail-citoyens/aide" className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isActive('/portail-citoyens/aide') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <HelpCircle size={18} className="mr-2" />
                <span className="font-medium text-sm lg:text-base">Aide</span>
              </Link>
            </nav>
          </div>
          
          {/* User profile and notifications */}
          <div className="flex items-center space-x-3 md:space-x-5">
            {/* Notification bell */}
            <button className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors hover:bg-yellow-50 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
            </button>
            
            {/* User profile */}
            <div className="relative profile-menu-container">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white font-medium ring-2 ring-white shadow-sm">
                  {userData && userData.firstName && userData.lastName ? `${userData.firstName.charAt(0).toUpperCase()}${userData.lastName.charAt(0).toUpperCase()}` : 'U'}
                </div>
                <span className="hidden sm:inline text-gray-700 font-medium text-sm md:text-base">{userData ? `${userData.firstName} ${userData.lastName}` : 'Chargement...'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-100 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userData ? `${userData.firstName} ${userData.lastName}` : 'Chargement...'}</p>
                    <p className="text-xs text-gray-500">{userData ? userData.email : 'email@example.com'}</p>
                  </div>
                  <Link to="/portail-citoyens/profil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User size={16} className="mr-2 text-gray-500" />
                    Mon profil
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Menu mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-64' : 'max-h-0'}`}>
          <nav className="mt-4 pb-2 border-t border-gray-100 pt-2 space-y-1">
            <Link to="/portail-citoyens/biometrie" className={`flex items-center py-2 px-3 rounded-lg ${isActive('/portail-citoyens/biometrie') ? 'bg-red-50 text-red-600' : 'text-gray-700'}`}>
              <Calendar size={18} className="mr-3" />
              <span className="font-medium">Biométrie</span>
            </Link>
            <Link to="/portail-citoyens" className={`flex items-center py-2 px-3 rounded-lg ${isActive('/portail-citoyens') ? 'bg-green-50 text-green-600' : 'text-gray-700'}`}>
              <Home size={18} className="mr-3" />
              <span className="font-medium">Tableau de bord</span>
            </Link>
            <Link to="/portail-citoyens/nouvelle-demande" className={`flex items-center py-2 px-3 rounded-lg ${isActive('/portail-citoyens/nouvelle-demande') ? 'bg-yellow-50 text-yellow-600' : 'text-gray-700'}`}>
              <FileText size={18} className="mr-3" />
              <span className="font-medium">Nouvelle demande</span>
            </Link>
            <Link to="/portail-citoyens/historique" className={`flex items-center py-2 px-3 rounded-lg ${isActive('/portail-citoyens/historique') ? 'bg-red-50 text-red-600' : 'text-gray-700'}`}>
              <Bell size={18} className="mr-3" />
              <span className="font-medium">Historique</span>
            </Link>
            <Link to="/portail-citoyens/aide" className={`flex items-center py-2 px-3 rounded-lg ${isActive('/portail-citoyens/aide') ? 'bg-green-50 text-green-600' : 'text-gray-700'}`}>
              <HelpCircle size={18} className="mr-3" />
              <span className="font-medium">Aide</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default CitoyenHeader;