import React, { useState, useEffect } from 'react';
import CitoyenHeader from './CitoyenHeader';
import { Eye, EyeOff } from 'lucide-react';

const ProfilePage = () => {
  // État initial du formulaire
  const [formData, setFormData] = useState({
    prenom: 'Boubacar',
    nom: 'Bah',
    email: 'boubacar.bah@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // États pour la gestion des erreurs et des succès
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // États pour afficher/masquer les mots de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // État pour suivre quelle section est en cours d'édition
  const [editingSection, setEditingSection] = useState(null);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Effacer les erreurs lorsque l'utilisateur commence à taper
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Fonction pour valider le formulaire
  const validateForm = (section) => {
    const newErrors = {};

    if (section === 'info') {
      if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
      if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
      if (!formData.email.trim()) {
        newErrors.email = 'L\'email est requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Format d\'email invalide';
      }
    } else if (section === 'password') {
      if (!formData.currentPassword) newErrors.currentPassword = 'Le mot de passe actuel est requis';
      if (!formData.newPassword) {
        newErrors.newPassword = 'Le nouveau mot de passe est requis';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = (section) => (e) => {
    e.preventDefault();
    
    if (!validateForm(section)) return;
    
    setLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setLoading(false);
      setSuccess(`Vos informations ${section === 'info' ? 'personnelles' : 'de connexion'} ont été mises à jour avec succès.`);
      
      // Réinitialiser les champs de mot de passe si c'est la section mot de passe
      if (section === 'password') {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        setSuccess('');
        setEditingSection(null);
      }, 5000);
    }, 1500);
  };

  // Fonction pour activer le mode édition d'une section
  const toggleEditSection = (section) => {
    if (editingSection === section) {
      setEditingSection(null);
    } else {
      setEditingSection(section);
      setSuccess('');
    }
  };

  return (
    <>
      <CitoyenHeader />
      <div className="min-h-screen bg-gray-100 pt-20 pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-full lg:max-w-7xl xl:max-w-screen-2xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* En-tête de la page */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Mon profil</h1>
              <p className="text-gray-600 mt-1">Gérez vos informations de connexion</p>
            </div>

            {/* Message de succès */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 space-y-8">
              {/* Section Email */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">Adresse électronique</h2>
                  <button 
                    onClick={() => toggleEditSection('info')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${editingSection === 'info' ? 'bg-gray-200 text-gray-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    {editingSection === 'info' ? 'Annuler' : 'Modifier'}
                  </button>
                </div>

                <div className="p-6">
                  {editingSection === 'info' ? (
                    <form onSubmit={handleSubmit('info')} className="space-y-4">
                      <div>
                        <div className="flex items-center">
                          <div className="bg-blue-50 p-1 rounded-lg mr-2">
                            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse électronique *</label>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Adresse électronique</h3>
                        <p className="mt-1 text-sm text-gray-900">{formData.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Mot de passe */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">Mot de passe</h2>
                  <button 
                    onClick={() => toggleEditSection('password')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${editingSection === 'password' ? 'bg-gray-200 text-gray-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    {editingSection === 'password' ? 'Annuler' : 'Modifier'}
                  </button>
                </div>

                <div className="p-6">
                  {editingSection === 'password' ? (
                    <form onSubmit={handleSubmit('password')} className="space-y-4">
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">Les champs marqués d'un astérisque (*) doivent être renseignés.</p>
                          </div>
                        </div>
                      </div>
                      {/* Mot de passe actuel */}
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={`block w-full rounded-md border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          <button 
                            type="button" 
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
                      </div>

                      {/* Nouveau mot de passe */}
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`block w-full rounded-md border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          <button 
                            type="button" 
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                        <p className="mt-1 text-xs text-gray-500">Le mot de passe doit contenir au moins 8 caractères.</p>
                      </div>

                      {/* Confirmation du nouveau mot de passe */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`block w-full rounded-md border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          <button 
                            type="button" 
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Enregistrement...
                            </>
                          ) : 'Enregistrer'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Votre mot de passe a été défini le 01/01/2023.</p>
                      <p className="text-sm text-gray-500">Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe régulièrement.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;