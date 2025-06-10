import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import EmployeeManagement from './EmployeeManagement';
import Historique from './Historique';

const AdminPortal = () => {
  const [userData, setUserData] = useState(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        localStorage.removeItem('user'); // Supprimer les données corrompues
      }
    }
  }, []);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user'); // Assurer la suppression des infos utilisateur
    localStorage.removeItem('user_type'); // Supprimer le type d'utilisateur
    // Optionnel: afficher un message de déconnexion réussie
    navigate('/portail-administrateur/login');
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
