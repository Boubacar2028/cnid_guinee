import React from 'react';
import { FileText, Upload, Check, User, Ruler, Users, PlusCircle, RefreshCw, Copy } from 'lucide-react';

// Composant pour afficher les étapes de la demande
const DemandeEtapes = ({ etape, setEtape, formData, handleChange, fichierSelectionne, setFichierSelectionne }) => {
  return (
    <>
      {etape === 1 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FileText size={20} className="mr-2 text-blue-600" />
            Type de demande
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                formData.typeDemande === 'premiere' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleChange('typeDemande', 'premiere')}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <PlusCircle size={20} className="text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Première demande</h3>
                </div>
                {formData.typeDemande === 'premiere' && <Check size={20} className="text-blue-500" />}
              </div>
              <p className="mt-1 text-sm text-gray-500 pl-7">
                Pour une première demande de carte nationale d'identité
              </p>
            </div>
            
            <div
              className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                formData.typeDemande === 'renouvellement' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleChange('typeDemande', 'renouvellement')}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <RefreshCw size={20} className="text-orange-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Renouvellement</h3>
                </div>
                {formData.typeDemande === 'renouvellement' && <Check size={20} className="text-blue-500" />}
              </div>
              <p className="mt-1 text-sm text-gray-500 pl-7">
                Pour renouveler une carte nationale d'identité expirée
              </p>
            </div>
            
            <div
              className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                formData.typeDemande === 'duplicata' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleChange('typeDemande', 'duplicata')}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Copy size={20} className="text-green-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Duplicata</h3>
                </div>
                {formData.typeDemande === 'duplicata' && <Check size={20} className="text-blue-500" />}
              </div>
              <p className="mt-1 text-sm text-gray-500 pl-7">
                En cas de perte ou de vol de votre carte d'identité
              </p>
            </div>
          </div>
        </div>
      )}
      
      {etape === 2 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <User size={20} className="mr-2 text-blue-600" />
            Informations personnelles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Votre nom de famille"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Votre prénom"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => handleChange('dateNaissance', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu de naissance <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lieuNaissance}
                onChange={(e) => handleChange('lieuNaissance', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ville/Village de naissance"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nin}
                onChange={(e) => handleChange('nin', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Numéro d'Identification Nationale"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexe <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.sexe}
                onChange={(e) => handleChange('sexe', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut de nationalité <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.statutNationalite}
                onChange={(e) => handleChange('statutNationalite', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="Naissance">Naissance</option>
                <option value="Naturalisation">Naturalisation</option>
                <option value="Mariage">Mariage</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => handleChange('profession', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Votre profession"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domicile <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.domicile}
                onChange={(e) => handleChange('domicile', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Votre adresse actuelle"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Situation matrimoniale <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.situationMatrimoniale}
                onChange={(e) => handleChange('situationMatrimoniale', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié(e)">Marié(e)</option>
                <option value="Divorcé(e)">Divorcé(e)</option>
                <option value="Veuf(ve)">Veuf(ve)</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {etape === 3 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Ruler size={20} className="mr-2 text-blue-600" />
            Signalement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille (en cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.taille}
                onChange={(e) => handleChange('taille', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: 175"
                required
                min="1"
                max="250"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teint <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.teint}
                onChange={(e) => handleChange('teint', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="Clair">Clair</option>
                <option value="Foncé">Foncé</option>
                <option value="Noir">Noir</option>
                <option value="Brun">Brun</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur des cheveux <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.couleurCheveux}
                onChange={(e) => handleChange('couleurCheveux', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="Noir">Noir</option>
                <option value="Brun">Brun</option>
                <option value="Gris">Gris</option>
                <option value="Blanc">Blanc</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signes particuliers
              </label>
              <textarea
                value={formData.signesParticuliers}
                onChange={(e) => handleChange('signesParticuliers', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Cicatrices, tatouages, ou autres signes distinctifs"
                rows="3"
              />
              <p className="text-xs text-gray-500 mt-1">Laissez ce champ vide si aucun signe particulier.</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Ces informations sont importantes pour la création de votre carte d'identité et peuvent être utilisées pour vérifier votre identité.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {etape === 4 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Users size={20} className="mr-2 text-blue-600" />
            Informations ascendantes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom du père <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.prenomPere}
                onChange={(e) => handleChange('prenomPere', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Prénom de votre père"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom de la mère <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.prenomMere}
                onChange={(e) => handleChange('prenomMere', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Prénom de votre mère"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la mère <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nomMere}
                onChange={(e) => handleChange('nomMere', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nom de famille de votre mère"
                required
              />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Ces informations sont utilisées à des fins d'identification et de vérification. Assurez-vous qu'elles correspondent aux informations figurant sur votre acte de naissance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {etape === 5 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Upload size={20} className="mr-2 text-blue-600" />
            Documents requis
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-dashed border-gray-300 p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  id="document1" 
                  onChange={(e) => setFichierSelectionne(e.target.files[0])}
                />
                <div className="text-center py-4">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Extrait de naissance sécurisé</p>
                  <p className="text-xs text-gray-400 mt-1">Glissez-déposez ou cliquez pour choisir</p>
                </div>
              </div>
              
              <div className="rounded-lg border border-dashed border-gray-300 p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="document2" />
                <div className="text-center py-4">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Certificat de résidence</p>
                  <p className="text-xs text-gray-400 mt-1">Glissez-déposez ou cliquez pour choisir</p>
                </div>
              </div>
              
              <div className="rounded-lg border border-dashed border-gray-300 p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="document3" />
                <div className="text-center py-4">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Photo d'identité récente</p>
                  <p className="text-xs text-gray-400 mt-1">Glissez-déposez ou cliquez pour choisir</p>
                </div>
              </div>
            </div>
            
            {fichierSelectionne && (
              <div className="flex items-center p-2 bg-green-50 rounded-lg border border-green-100">
                <Check size={20} className="text-green-600 mr-2" />
                <span className="text-sm text-green-700">{fichierSelectionne.name} sélectionné</span>
              </div>
            )}
            
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Tous les documents doivent être lisibles et au format JPG, PNG ou PDF. Taille maximale : 5MB par fichier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {etape === 6 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Check size={20} className="mr-2 text-blue-600" />
            Récapitulatif et validation
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Vérifiez les informations avant de soumettre</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Type de demande</p>
                <p className="font-medium">
                  {formData.typeDemande === 'premiere' ? 'Première demande' : 
                   formData.typeDemande === 'renouvellement' ? 'Renouvellement' : 'Perte ou vol'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Nom complet</p>
                <p className="font-medium">{formData.nom} {formData.prenom}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Date de naissance</p>
                <p className="font-medium">{formData.dateNaissance}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Lieu de naissance</p>
                <p className="font-medium">{formData.lieuNaissance}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">NIN</p>
                <p className="font-medium">{formData.nin}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Sexe</p>
                <p className="font-medium">{formData.sexe}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Statut de nationalité</p>
                <p className="font-medium">{formData.statutNationalite}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Profession</p>
                <p className="font-medium">{formData.profession}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Domicile</p>
                <p className="font-medium">{formData.domicile}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Situation matrimoniale</p>
                <p className="font-medium">{formData.situationMatrimoniale}</p>
              </div>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Signalement</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Taille</p>
                <p className="font-medium">{formData.taille} cm</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Teint</p>
                <p className="font-medium">{formData.teint}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Couleur des cheveux</p>
                <p className="font-medium">{formData.couleurCheveux}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Signes particuliers</p>
                <p className="font-medium">{formData.signesParticuliers || 'Aucun'}</p>
              </div>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Informations ascendantes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Prénom du père</p>
                <p className="font-medium">{formData.prenomPere}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Prénom de la mère</p>
                <p className="font-medium">{formData.prenomMere}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Nom de la mère</p>
                <p className="font-medium">{formData.nomMere}</p>
              </div>
            </div>
            
            <div className="mb-6 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Documents téléchargés</p>
              <div className="space-y-2">
                {fichierSelectionne ? (
                  <div className="flex items-center">
                    <Check size={16} className="text-green-600 mr-2" />
                    <span className="text-sm">{fichierSelectionne.name}</span>
                  </div>
                ) : (
                  <p className="text-sm text-red-500">Aucun document sélectionné</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <input type="checkbox" id="terms" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" required />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Je certifie que les informations fournies sont exactes et j'accepte les conditions d'utilisation
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemandeEtapes;
