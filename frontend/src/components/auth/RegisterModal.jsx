import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    telephone: '',
    nin: '',
    date_naissance: '',
    lieu_naissance: '',
    sexe: 'M',
    adresse: '',
    profession: '',
    situation_matrimoniale: 'celibataire',
    pere_nom: '',
    mere_nom: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Pour gérer un formulaire en plusieurs étapes

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Utiliser l'email comme username pour permettre la connexion avec email
      await axios.post('http://localhost:8000/api/auth/citoyens/', {
        utilisateur: {
          username: formData.email, // Utiliser l'email comme username
          password: formData.password,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          telephone: formData.telephone,
          type_utilisateur: 'citoyen'
        },
        nin: formData.nin,
        date_naissance: formData.date_naissance,
        lieu_naissance: formData.lieu_naissance,
        sexe: formData.sexe,
        adresse: formData.adresse,
        profession: formData.profession,
        situation_matrimoniale: formData.situation_matrimoniale,
        pere_nom: formData.pere_nom,
        mere_nom: formData.mere_nom
      });
      
      // Redirection vers la connexion après inscription réussie
      onSwitchToLogin();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'inscription. Veuillez vérifier vos informations.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all">
        {/* Header du modal */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Inscription au portail citoyens</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Corps du modal */}
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {/* Indicateur d'étape */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
                <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                <div className={`w-16 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
              </div>
            </div>
            
            {/* Étape 1: Informations de compte */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">Informations de compte</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom d'utilisateur*
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email*
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe*
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone*
                    </label>
                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.telephone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
            
            {/* Étape 2: Informations personnelles */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">Informations personnelles</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom*
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom*
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
            
            {/* Étape 3: Confirmation et soumission */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">Confirmation</h4>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    Veuillez vérifier vos informations avant de soumettre votre inscription. 
                    Vous pourrez compléter votre profil et ajouter votre NIN lors de votre première demande de CNI.
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><strong>Nom d'utilisateur:</strong> {formData.username}</li>
                    <li><strong>Email:</strong> {formData.email}</li>
                    <li><strong>Prénom:</strong> {formData.first_name}</li>
                    <li><strong>Nom:</strong> {formData.last_name}</li>
                    <li><strong>Téléphone:</strong> {formData.telephone}</li>
                  </ul>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Précédent
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Traitement en cours...
                      </>
                    ) : 'S\'inscrire'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Footer du modal */}
        <div className="px-6 py-4 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte?{' '}
            <button 
              onClick={onSwitchToLogin}
              className="font-medium text-green-600 hover:text-green-500 focus:outline-none"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;