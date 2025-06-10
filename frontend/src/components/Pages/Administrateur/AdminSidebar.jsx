import React from 'react';

const AdminSidebar = ({ activeMenu, setActiveMenu, handleLogout, userData }) => {
  const menuItems = [
    { id: 'dashboard', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>, label: 'Tableau de bord' },
    { id: 'employees', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>, label: 'Gestion des employés' },
    { id: 'historique', icon: <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, label: 'Historique' },
    { id: 'configuration', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>, label: 'Configuration' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      {/* En-tête du Sidebar */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
            <img src="/embleme.png" alt="CNI Guinée" className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Admin Portal</h2>
            <p className="text-xs text-gray-600">Système de gestion</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col flex-1 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`flex items-center px-4 py-3 text-left ${activeMenu === item.id
                ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50'
                : 'text-gray-700'}`}
          >
            <span className="w-5 h-5 mr-3 text-current">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Espace flexible pour pousser le profil en bas */}
      <div className="flex-grow"></div>

      {/* Profil de l'administrateur */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-medium">
            <span>{userData && userData.prenom && userData.nom ? `${userData.prenom.charAt(0).toUpperCase()}${userData.nom.charAt(0).toUpperCase()}` : 'AD'}</span>
          </div>
          <div>
            <p className="font-medium text-sm">{userData && userData.prenom && userData.nom ? `${userData.prenom} ${userData.nom}` : 'Administrateur'}</p>
            <p className="text-xs text-gray-500">{userData && userData.email ? userData.email : 'admin@system.com'}</p>
          </div>
        </div>
      </div>

      {/* Bouton Déconnexion */}
      <div className="p-4 pt-0 mb-4">
        <button onClick={handleLogout} className="flex items-center text-red-500 text-sm hover:text-red-700 w-full">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
