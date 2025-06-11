import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import EmployeeManagement from './EmployeeManagement';
import Historique from './Historique';

const AdminPortal = () => {
  const [userData, setUserData] = useState(null);

  React.useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        localStorage.removeItem('userData'); // Supprimer les données corrompues
      }
    }
  }, []);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    const handleLogout = () => {
    // Vider complètement le localStorage pour une déconnexion sécurisée
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('userData');
    
    // Rediriger vers la page de connexion de l'administrateur
    navigate('/');
  };

  // Fonction pour rendre le contenu en fonction du menu actif
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeeManagement />;
      case 'historique':
        return <Historique />;
      case 'configuration':
        return <div className="p-6">Configuration - Contenu à venir</div>;
      default:
        return <Dashboard />;
    }
  };

  if (isMobile) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Accès non autorisé</h1>
            <p className="text-gray-600 max-w-md">
                Le portail administrateur est conçu pour une utilisation sur ordinateur et n'est pas disponible sur les appareils mobiles.
            </p>
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} handleLogout={handleLogout} userData={userData} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPortal;
