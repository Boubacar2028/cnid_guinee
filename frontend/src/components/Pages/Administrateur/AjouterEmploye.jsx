import React, { useState } from 'react';

const InputField = ({ id, label, type, placeholder, value, onChange, icon }) => (
  <div className="relative">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <input
        type={type}
        id={id}
        name={id}
        className="block w-full pl-10 p-2.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  </div>
);

const AjouterEmploye = ({ onClose, onEmployeAjoute }) => {
  const [formData, setFormData] = useState({
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSend = {
        utilisateur: {
            ...formData,
            username: formData.email, // Utiliser l'email comme username
        },
        // Le matricule est généré par le backend, donc on ne l'envoie pas
    };

    try {
        const token = localStorage.getItem('access_token'); // Récupérer le token
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const response = await fetch(`${apiUrl}/api/agents/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
             },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Construire un message d'erreur plus clair
            let errorMessage = "Une erreur est survenue.";
            if (errorData.detail) {
                errorMessage = errorData.detail;
            } else {
                errorMessage = Object.entries(errorData)
                    .map(([field, messages]) => {
                        const message = Array.isArray(messages) ? messages.join(' ') : messages;
                        return `${field}: ${message}`;
                    })
                    .join('\n');
            }
            throw new Error(errorMessage);
        }

        const newEmploye = await response.json();
        console.log('Employé ajouté avec succès:', newEmploye);
        alert('Employé ajouté avec succès !');
        if(onEmployeAjoute) {
            onEmployeAjoute(newEmploye); // Passer le nouvel employé au composant parent
        }
        onClose(); // Fermer le formulaire

    } catch (err) {
        setError(err.message);
        console.error('Erreur lors de la soumission du formulaire:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto my-10 border border-gray-200">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Créer un nouveau compte employé</h1>
        <p className="text-gray-600 mt-2">Veuillez remplir les informations ci-dessous pour ajouter un nouvel agent.</p>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erreur !</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Section Informations Utilisateur */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-6">Informations de l'utilisateur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <InputField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} icon={<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
            <InputField id="password" label="Mot de passe" type="password" value={formData.password} onChange={handleChange} icon={<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
            <InputField id="first_name" label="Prénom" type="text" value={formData.first_name} onChange={handleChange} icon={<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
            <InputField id="last_name" label="Nom de famille" type="text" value={formData.last_name} onChange={handleChange} icon={<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
            <InputField id="telephone" label="Téléphone" type="text" value={formData.telephone} onChange={handleChange} icon={<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end pt-6 gap-4 border-t mt-8">
          <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed">
            <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {loading ? 'Ajout en cours...' : "Ajouter l'employé"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterEmploye;
