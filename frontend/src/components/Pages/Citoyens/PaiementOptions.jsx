import React, { useState } from 'react';
import { CreditCard, CheckCircle, DollarSign, RefreshCw } from 'lucide-react';

const PaiementOptions = ({ onClose, onPaymentComplete }) => {
  const [methode, setMethode] = useState('');
  const [numero, setNumero] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!methode || !numero) {
      return;
    }
    
    setLoading(true);
    
    // Simuler un appel API de paiement
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Notifier le composant parent du paiement réussi après 2 secondes
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {success ? (
          <div className="p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold mt-4 mb-2">Paiement réussi !</h2>
            <p className="text-gray-600 mb-6">
              Votre paiement a été traité avec succès. Vous recevrez un message de confirmation par SMS.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Votre demande a été enregistrée. Vous serez notifié pour la suite des démarches.
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <CreditCard size={20} className="mr-2 text-blue-600" />
                  Paiement
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Choisissez votre méthode de paiement pour finaliser votre demande
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode de paiement <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      className={`p-3 border rounded-lg cursor-pointer flex items-center ${
                        methode === 'orange' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                      }`}
                      onClick={() => setMethode('orange')}
                    >
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center">
                        <img src="/orange-money.png" alt="Orange Money" className="h-full w-full object-contain" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">Orange Money</p>
                      </div>
                    </div>
                    
                    <div
                      className={`p-3 border rounded-lg cursor-pointer flex items-center ${
                        methode === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                      }`}
                      onClick={() => setMethode('mtn')}
                    >
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center">
                        <img src="/mtn-momo.png" alt="MTN Mobile Money" className="h-full w-full object-contain" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">Mobile Money</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {methode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de téléphone <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">+224</span>
                      </div>
                      <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="XX XXX XX XX"
                        className="pl-14 w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Vous recevrez une demande de confirmation sur ce numéro
                    </p>
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <DollarSign size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Montant à payer: <span className="font-bold">50 000 GNF</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={!methode || !numero || loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (!methode || !numero || loading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    'Payer maintenant'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PaiementOptions;
