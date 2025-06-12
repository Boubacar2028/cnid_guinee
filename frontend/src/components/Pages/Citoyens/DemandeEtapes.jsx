import React from 'react';
import { FileText, Upload, Check, User, Ruler, Users, PlusCircle, RefreshCw, Copy, ChevronRight, ChevronLeft, AlertCircle, Info } from 'lucide-react';

// Composant pour afficher les étapes de la demande
const DemandeEtapes = ({ 
  etape, 
  formData, 
  handleChange, 
  documents, 
  handleFileChange,
  validationErrors,
  handleNext,
  handlePrevious
}) => {
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
                className={`w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 ${validationErrors.etape2?.nom ? 'border-red-500' : ''}`}
                placeholder="Votre nom de famille"
                required
              />
              {validationErrors.etape2?.nom && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.etape2.nom}</p>
              )}
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
                <Info className="h-5 w-5 text-blue-500" />
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
                <Info className="h-5 w-5 text-yellow-500" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Extrait de naissance */}
              <div className={`rounded-lg border border-dashed p-4 transition-colors cursor-pointer relative ${documents.extraitNaissance ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-100'}`}>
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => handleFileChange('extraitNaissance', e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div className="text-center py-4">
                  {documents.extraitNaissance ? <Check className="mx-auto h-10 w-10 text-green-500" /> : <Upload className="mx-auto h-10 w-10 text-gray-400" />}
                  <p className="mt-2 text-sm text-gray-600">Extrait de naissance</p>
                  {documents.extraitNaissance ? 
                    <p className="text-xs text-green-600 mt-1 truncate">{documents.extraitNaissance.name}</p> : 
                    <p className="text-xs text-gray-400 mt-1">Cliquez pour choisir</p>}
                </div>
              </div>
              
              {/* Certificat de résidence */}
              <div className={`rounded-lg border border-dashed p-4 transition-colors cursor-pointer relative ${documents.certificatResidence ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-100'}`}>
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => handleFileChange('certificatResidence', e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div className="text-center py-4">
                  {documents.certificatResidence ? <Check className="mx-auto h-10 w-10 text-green-500" /> : <Upload className="mx-auto h-10 w-10 text-gray-400" />}
                  <p className="mt-2 text-sm text-gray-600">Certificat de résidence</p>
                  {documents.certificatResidence ? 
                    <p className="text-xs text-green-600 mt-1 truncate">{documents.certificatResidence.name}</p> : 
                    <p className="text-xs text-gray-400 mt-1">Cliquez pour choisir</p>}
                </div>
              </div>
              
              {/* Photo d'identité */}
              <div className={`rounded-lg border border-dashed p-4 transition-colors cursor-pointer relative ${documents.photoIdentite ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-100'}`}>
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => handleFileChange('photoIdentite', e.target.files[0])}
                  accept=".jpg,.jpeg,.png"
                />
                <div className="text-center py-4">
                  {documents.photoIdentite ? <Check className="mx-auto h-10 w-10 text-green-500" /> : <Upload className="mx-auto h-10 w-10 text-gray-400" />}
                  <p className="mt-2 text-sm text-gray-600">Photo d'identité</p>
                  {documents.photoIdentite ? 
                    <p className="text-xs text-green-600 mt-1 truncate">{documents.photoIdentite.name}</p> : 
                    <p className="text-xs text-gray-400 mt-1">Cliquez pour choisir</p>}
                </div>
              </div>
            </div>
            
            {validationErrors.etape5?.documents && (
              <p className="text-sm text-red-500 text-center mt-4">{validationErrors.etape5.documents}</p>
            )}
            
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
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
                   formData.typeDemande === 'renouvellement' ? 'Renouvellement' : 'Duplicata'}
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
                {Object.entries(documents).map(([key, file]) => (
                  file ? (
                    <div key={key} className="flex items-center">
                      <Check size={16} className="text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{file.name}</span>
                    </div>
                  ) : null
                ))}
                {Object.values(documents).every(file => !file) && (
                  <p className="text-sm text-red-500">Aucun document n'a été téléversé.</p>
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
