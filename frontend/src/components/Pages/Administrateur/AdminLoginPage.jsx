import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous d'installer jwt-decode: npm install jwt-decode

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleNextStep = (e) => {
    e.preventDefault();
    if (email) {
      setStep(2);
      setError('');
    } else {
      setError('Veuillez entrer votre adresse email.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Erreur ${response.status} - ${response.statusText}`);
      }

      if (data.access) {
        const decodedToken = jwtDecode(data.access);
        console.log('CONTENU DU TOKEN REÇU :', decodedToken);
        if (decodedToken.type_utilisateur === 'admin') {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          const userData = {
              email: decodedToken.email,
              first_name: decodedToken.first_name,
              last_name: decodedToken.last_name
          };
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('user_type', decodedToken.type_utilisateur);

          navigate('/portail-administrateur/dashboard');
        } else {
          throw new Error('Accès non autorisé. Ce portail est réservé aux administrateurs.');
        }
      } else {
        throw new Error('Token non reçu.');
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion.');
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Panel with Background Image */}
      <div
        className="hidden lg:flex w-1/2 bg-contain bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/ministere.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-25"></div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full text-white p-8">
            {/* Contenu superposé retiré */}
        </div>
      </div>

      {/* Right Panel with Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full border border-gray-200">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Connectez-vous</h2>
                <p className="text-gray-500">Bienvenu au portail admin</p>
            </div>
            <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
                {step === 1 && (
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="admin@example.com"
                    />
                  </div>
                )}
                {step === 2 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <button type="button" onClick={() => { setStep(1); setError(''); }} className="text-sm text-indigo-600 hover:underline">Changer d'email</button>
                    </div>
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
                )}
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                {step === 1 && (
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                        Suivant
                    </button>
                )}
                {step === 2 && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                )}
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

export default AdminLoginPage;
