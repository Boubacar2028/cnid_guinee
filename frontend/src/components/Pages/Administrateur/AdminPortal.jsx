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

    const handleLogout = () => {
    // Vider complètement le localStorage pour une déconnexion sécurisée
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('userData');
    
    // Rediriger vers la page de connexion de l'administrateur
    navigate('/connexion-admin');
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
