import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // Importer jwt-decode

const AuthPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    telephone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateEmail(formData.email)) {
        setError('Veuillez entrer une adresse email valide');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Utiliser l'email comme username pour l'authentification JWT
      console.log('Tentative de connexion avec:', { username: formData.email, password: formData.password });
      
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: formData.email,
        password: formData.password
      });
      
      console.log('Connexion réussie, réponse:', response.data);
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_type', response.data.type_utilisateur);

      // Décoder le token pour obtenir les informations utilisateur
      try {
        const decodedToken = jwtDecode(response.data.access);
        console.log('Token décodé:', decodedToken);
        const userData = {
          userId: decodedToken.user_id, // Assurez-vous que c'est bien 'user_id' dans votre token
          email: decodedToken.email,       // et 'email', 'first_name', 'last_name'
          firstName: decodedToken.first_name,
          lastName: decodedToken.last_name,
          // Ajoutez d'autres champs si présents et utiles
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('Données utilisateur stockées dans localStorage:', userData);
      } catch (decodeError) {
        console.error('Erreur lors du décodage du token ou de la récupération des infos utilisateur:', decodeError);
        // Optionnel: Gérer l'erreur, par exemple ne pas stocker userData ou afficher un message
      }

      
      // Redirection en fonction du type d'utilisateur
      if (response.data.type_utilisateur === 'citoyen') {
        navigate('/portail-citoyens/');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      let errorMessage = 'Identifiants invalides. Vérifiez votre email et mot de passe.';
      
      if (err.response) {
        console.log('Statut de l\'erreur:', err.response.status);
        console.log('Détails de l\'erreur:', err.response.data);
        
        // Afficher des messages d'erreur plus détaillés et utiles
        if (err.response.data) {
          if (err.response.data.detail) {
            errorMessage = `Erreur: ${err.response.data.detail}`;
          } else if (err.response.data.username) {
            // L'erreur spécifique au champ username
            errorMessage = `Problème avec l'identifiant: ${err.response.data.username}`;
          } else if (err.response.data.password) {
            errorMessage = `Problème avec le mot de passe: ${err.response.data.password}`;
          } else if (typeof err.response.data === 'object') {
            errorMessage = `Erreur: ${JSON.stringify(err.response.data)}`;
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    
    if (!validatePassword(formData.password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Tentative d\'inscription avec les données:', formData);
      
      // Structure encore plus simplifiée
      const userData = {
        utilisateur: {
          username: formData.email,
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          telephone: formData.telephone || ''
        },
        // Ajouter des valeurs par défaut pour les champs obligatoires
        nin: 'TEMP-' + Date.now(), // NIN temporaire unique
        sexe: 'M',
        nationalite: 'Guinéenne',
        situation_matrimoniale: 'celibataire'
      };
      
      console.log('Données d\'inscription à envoyer:', userData);
      const response = await axios.post('http://localhost:8000/api/citoyens/', userData);
      
      console.log('Réponse d\'inscription:', response.data);
      
      // Redirection vers la connexion après inscription réussie
      setIsLogin(true);
      setStep(1);
      setError('Inscription réussie. Vous pouvez maintenant vous connecter.');
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      
      // Affichage détaillé de l'erreur avec toutes les informations disponibles
      if (err.response) {
        console.log('Status:', err.response.status);
        console.log('Headers:', err.response.headers);
        console.log('Data:', err.response.data);
        
        // Construction d'un message d'erreur détaillé
        let errorMessage = `Erreur ${err.response.status}: `;
        
        if (typeof err.response.data === 'object') {
          // Afficher l'erreur complète en JSON pour débogage
          console.log('Erreur détaillée:', JSON.stringify(err.response.data, null, 2));
          
          // Extraire les messages d'erreur des différents champs
          const errorDetails = [];
          
          // Vérifier les erreurs sur l'objet utilisateur
          if (err.response.data.utilisateur) {
            Object.entries(err.response.data.utilisateur).forEach(([field, messages]) => {
              errorDetails.push(`${field}: ${messages.join(', ')}`);
            });
          }
          
          // Vérifier les erreurs sur les autres champs
          Object.entries(err.response.data).forEach(([field, value]) => {
            if (field !== 'utilisateur' && typeof value === 'string') {
              errorDetails.push(`${field}: ${value}`);
            } else if (field !== 'utilisateur' && Array.isArray(value)) {
              errorDetails.push(`${field}: ${value.join(', ')}`);
            }
          });
          
          if (errorDetails.length > 0) {
            errorMessage += errorDetails.join('; ');
          } else {
            errorMessage += JSON.stringify(err.response.data);
          }
        } else if (typeof err.response.data === 'string') {
          errorMessage += err.response.data;
        } else {
          errorMessage += 'Erreur inconnue';
        }
        
        setError(errorMessage);
      } else if (err.request) {
        // La requête a été faite mais pas de réponse
        console.log('Request:', err.request);
        setError('Pas de réponse du serveur. Vérifiez que le serveur backend est en cours d\'exécution.');
      } else {
        // Erreur lors de la configuration de la requête
        console.log('Error message:', err.message);
        setError('Erreur: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setError('');
    setFormData({
      ...formData,
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Section image à gauche */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img 
          src="/image9.jpg" 
          alt="CNID Guinée" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-10">
          <img src="/embleme.png" alt="Emblème de la Guinée" className="h-24 w-24 object-contain mb-4" />
          <h1 className="text-3xl font-bold text-center mb-4">Bienvenue au portails citoyens de CNID</h1>
          <p className="text-lg text-center">Votre plateforme pour les services de carte nationale d'identité</p>
        </div>
      </div>
      
      {/* Section formulaire à droite */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
          {/* Header avec emblème */}
          <div className="bg-white px-6 py-4 flex justify-center items-center border-b">
            <div className="flex items-center justify-center">
              <img src="/embleme.png" alt="Emblème de la Guinée" className="h-12 w-12 object-contain" />
              <h3 className="text-xl font-bold text-gray-800 ml-2">République de Guinée</h3>
            </div>
          </div>
          
          {/* Titre */}
          <div className="bg-white px-6 py-4 text-center border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Connectez-vous au Portail Citoyens' : 'Créer vos identifiants Service Public'}
            </h2>
          </div>
          
          {/* Corps du formulaire */}
          <div className="px-6 py-4">
            {error && (
              <div className={`p-3 rounded-md text-sm mb-4 ${error.includes('réussie') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {error}
              </div>
            )}
            
            {isLogin ? (
              /* Formulaire de connexion */
              <form onSubmit={handleLogin} className="space-y-4">
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Saisir adresse électronique
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Adresse électronique"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center">
                        <ArrowLeft size={16} className="mr-1" /> Retour
                      </Link>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center text-blue-500 mb-4">
                      <ArrowLeft size={16} className="mr-1 cursor-pointer" onClick={handlePrevStep} />
                      <span>{formData.email}</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Saisir le mot de passe
                      </label>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Se souvenir de moi
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">
                        Vous avez oublié votre mot de passe?
                      </a>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Connexion...' : 'Se connecter'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              /* Formulaire d'inscription */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <div className="border-l-4 border-blue-500 bg-gray-100 p-4 mb-4">
                    <p className="text-sm text-gray-700">Les informations demandées sont obligatoires</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quelle est votre adresse email personnelle ?
                    </label>
                    <p className="text-xs text-gray-500 mb-1">Par exemple : nom@example.com</p>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      name="telephone"
                      type="tel"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.telephone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {/* Indications sur le mot de passe */}
                  <div className="mb-4 border-l-4 border-blue-500 bg-gray-100 p-4">
                    <p className="text-sm font-medium text-gray-700">Pour créer votre mot de passe, utiliser :</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 mt-1">
                      <li>au moins 8 caractères</li>
                      <li>au moins 1 lettre en majuscule</li>
                      <li>au moins 1 lettre en minuscule</li>
                      <li>au moins 1 chiffre</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Choisir votre mot de passe
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmez votre mot de passe
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center">
                    <ArrowLeft size={16} className="mr-1" /> Retour
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Inscription...' : 'S\'inscrire'}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Footer du formulaire */}
          <div className="px-6 py-4 bg-gray-50 text-center border-t">
            <p className="text-sm text-gray-600">
              {isLogin ? "Vous n'avez pas de compte? " : "Vous avez déjà un compte? "}
              <button 
                onClick={toggleAuthMode}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
          
          {/* Footer avec liens */}
          <div className="bg-black text-white text-xs px-6 py-2 flex justify-center space-x-4">
            <a href="#" className="hover:underline">Contactez-nous</a>
            <a href="#" className="hover:underline">Confidentialité</a>
            <a href="#" className="hover:underline">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;