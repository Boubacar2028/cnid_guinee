import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordChangeModal from './Modals/PasswordChangeModal';
import BiometricModal from './Modals/BiometricModal';
import AgentHeader from './AgentHeader';
import DemandesSection from './Sections/DemandesSection';



const AgentPortal = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard'); // dashboard, demandes
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  
  const handleSubmit = () => {
    // Vérification que les mots de passe correspondent
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    
    // Vérification de la longueur minimale
    if (passwordData.newPassword.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    
    // Simuler la mise à jour du mot de passe
    alert("Mot de passe modifié avec succès!");
    setShowPasswordModal(false);
    // Réinitialiser les données du formulaire
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Fonction pour détecter si l'appareil est mobile
  const checkDeviceSize = () => {
    setIsMobile(window.innerWidth < 1024); // Considère comme mobile si largeur < 1024px
  };

  useEffect(() => {
    // Vérifier la taille de l'écran au chargement
    checkDeviceSize();
    
    // Ajouter un listener pour les changements de taille d'écran
    window.addEventListener('resize', checkDeviceSize);
    
    // Nettoyage du listener
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  // Si l'appareil est mobile, afficher un message d'avertissement
  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative overflow-hidden">
          <div className="flex items-center justify-center mb-4 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 text-center mb-6">
            Le portail agent n'est accessible que sur ordinateur. Veuillez utiliser un appareil avec un écran plus grand pour accéder à cette fonctionnalité.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AgentHeader onOpenPasswordModal={() => setShowPasswordModal(true)} />

      {/* Modal pour la biométrie en attente */}
      <BiometricModal 
        isOpen={showBiometricModal} 
        onClose={() => setShowBiometricModal(false)} 
      />
      
      <PasswordChangeModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        handleSubmit={handleSubmit}
        showCurrentPassword={showCurrentPassword}
        setShowCurrentPassword={setShowCurrentPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
      />
      
      {/* Navigation principale */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`border-b-2 ${activeSection === 'dashboard' ? 'border-green-600 text-green-700' : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'} py-4 px-1 text-sm font-medium focus:outline-none`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Tableau de bord
              </span>
            </button>
            <button 
              onClick={() => setActiveSection('demandes')}
              className={`border-b-2 ${activeSection === 'demandes' ? 'border-green-600 text-green-700' : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'} py-4 px-1 text-sm font-medium focus:outline-none`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Demandes
              </span>
            </button>
            <button 
              onClick={() => setShowBiometricModal(true)}
              className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                Biométrie en attente
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">0</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeSection === 'dashboard' ? (
            <>
              {/* Titre du tableau de bord */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-600 mt-1">Vue d'ensemble de vos activités</p>
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-500">Dernière mise à jour: 26/05/2025</p>
                </div>
              </div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Carte 1: En attente de traitement */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">En attente de traitement</dt>
                      <dd>
                        <div className="text-3xl font-bold text-red-600">0</div>
                        <div className="text-xs text-gray-500">Demandes à traiter</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte 2: Demandes traitées */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Demandes traitées</dt>
                      <dd>
                        <div className="text-3xl font-bold text-green-600">0</div>
                        <div className="text-xs text-gray-500">Approuvées ce mois</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte 3: Biométrie à débloquer */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Biométrie à débloquer</dt>
                      <dd>
                        <div className="text-3xl font-bold text-yellow-600">0</div>
                        <div className="text-xs text-gray-500">Section à débloquer</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte 4: Total citoyens */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total citoyens</dt>
                      <dd>
                        <div className="text-3xl font-bold text-green-600">0</div>
                        <div className="text-xs text-gray-500">Dans le système</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections Rappels et Notifications */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Rappels biométriques */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Rappels biométriques</h3>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-900">RDV biométriques demain</h4>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">0</span>
                  </div>
                  <p className="text-sm text-gray-600">0 citoyens ont un RDV dans 24h</p>
                </div>
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Envoyer rappels RDV
                </button>
              </div>
            </div>

            {/* Notifications biométriques */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Notifications biométriques</h3>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Sections à débloquer</h4>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">0</span>
                  </div>
                  <p className="text-sm text-gray-600">0 citoyens doivent prendre rendez-vous</p>
                </div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifier pour RDV
                </button>
              </div>
            </div>
          </div>
            </>
          ) : activeSection === 'demandes' ? (
            <>
              {/* Titre de la section Demandes */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Demandes</h1>
                <p className="text-gray-600 mt-1">Gestion des demandes de carte d'identité</p>
              </div>
              
              {/* Contenu des demandes */}
              <DemandesSection />
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AgentPortal;