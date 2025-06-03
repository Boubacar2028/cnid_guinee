import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Mail, Phone, MapPin, ExternalLink, Shield, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Section supérieure avec logo et informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo et description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-12 rounded overflow-hidden">
                <div className="w-1/3 bg-red-600"></div>
                <div className="w-1/3 bg-yellow-400"></div>
                <div className="w-1/3 bg-green-600"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">CNID Guinée</h3>
            </div>
            <p className="text-gray-600 mb-4">
              La Carte Nationale d'Identité Digitale de Guinée, votre identité sécurisée pour accéder à tous les services de l'administration.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-400 transition-colors">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="/actualite" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                  <span className="mr-2">›</span> Actualités
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                  <span className="mr-2">›</span> Nos services
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                  <span className="mr-2">›</span> FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                  <span className="mr-2">›</span> Contact
                </a>
              </li>
              <li>
                <a href="/portail-citoyens" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                  <span className="mr-2">›</span> Espace citoyen
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Ministère de l'Administration du Territoire, Kaloum, Conakry, Guinée</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600">+224 62 12 34 56</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600">contact@cnid.gouv.gn</span>
              </li>
            </ul>
          </div>

          {/* Heures d'ouverture */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Heures d'ouverture</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Lundi - Vendredi:</span>
                <span className="text-gray-800 font-medium">8h00 - 16h30</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Samedi:</span>
                <span className="text-gray-800 font-medium">9h00 - 13h00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Dimanche:</span>
                <span className="text-gray-800 font-medium">Fermé</span>
              </li>
            </ul>
            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md">
              <p className="text-sm text-green-800">Service en ligne disponible 24h/24 et 7j/7</p>
            </div>
          </div>
        </div>

        {/* Partners Section avec carousel */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Nos partenaires
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex space-x-8 animate-marquee py-4">
              {["/ecobank.png", "/simandou2040.jpg", "/orange.jpg", "/mtn.jpg", "/unc.jpg", "/jeunes.jpg", "/enfants.jpg"].map((logo, index) => (
                <div key={index} className="flex-shrink-0 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <img 
                    src={logo} 
                    alt={`Logo partenaire ${index + 1}`} 
                    className="h-16 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* Copyright */}
        <div className="text-center mt-4 text-sm text-gray-500 flex items-center justify-center">
          <p> {currentYear} République de Guinée - Tous droits réservés</p>
          <Heart size={14} className="ml-2 text-red-500" />
        </div>
      </div>

      {/* Ajouter des styles pour l'animation du carousel */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;