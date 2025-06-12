import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AgentLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/token/`, {
        username: email,
        password: password,
      });

      const data = response.data;

      if (data.access) {
        const decodedToken = jwtDecode(data.access);
        if (decodedToken.type_utilisateur === 'agent') {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          // La réponse 'data' du backend contient maintenant l'objet complet de l'agent.
          // Nous allons le stocker pour l'utiliser dans l'application.
          const userDataForStorage = {
            email: data.userData.email,
            first_name: data.userData.first_name,
            last_name: data.userData.last_name,
            matricule: data.matricule // Ajout du matricule depuis la réponse de l'API
          };
          localStorage.setItem('userData', JSON.stringify(userDataForStorage));
          localStorage.setItem('user_type', decodedToken.type_utilisateur);

          navigate('/portail-agents');
        } else {
          throw new Error('Accès non autorisé. Ce portail est réservé aux agents.');
        }
      } else {
        throw new Error('Token non reçu.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Une erreur est survenue lors de la connexion.';
      setError(errorMessage);
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div
        className="hidden lg:flex w-1/2 bg-contain bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/ministere.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-25"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full border border-gray-200">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Portail Agent</h2>
                <p className="text-gray-500">Veuillez vous connecter pour continuer</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="agent@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="************"
                />
              </div>
              
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} CNID Guinée. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AgentLoginPage;
