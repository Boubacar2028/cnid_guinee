import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f5f5f5] pt-8 pb-4">
      <div className="container mx-auto px-4">
        {/* Partners Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Nos partenaires</h2>
          <div className="flex justify-between items-center">
            {/* Ecobank logo on the left */}
            <div className="flex items-center justify-center">
              <img 
                src="/ecobank.png" 
                alt="Ecobank logo" 
                className="max-h-24 object-contain"
              />
            </div>
            
            {/* Simandou, Orange and MTN logos on the right */}
            <div className="flex gap-8 items-center">
              <div className="flex items-center justify-center">
                <img 
                  src="/simandou2040.jpg" 
                  alt="Simandou logo" 
                  className="max-h-24 object-contain"
                />
              </div>
              <div className="flex items-center justify-center">
                <img 
                  src="/orange.jpg" 
                  alt="Orange logo" 
                  className="max-h-24 object-contain"
                />
              </div>
              <div className="flex items-center justify-center">
                <img 
                  src="/mtn.jpg" 
                  alt="MTN logo" 
                  className="max-h-24 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* Footer Links */}
        <div className="pt-2">
          <nav className="flex flex-wrap justify-center text-sm text-gray-600">
            <a href="/plan-du-site" className="hover:text-gray-900 transition-colors">Plan du site</a>
            <span className="mx-2 text-gray-400">|</span>
            <a href="/accessibilite" className="hover:text-gray-900 transition-colors">Accessibilité : totalement conforme</a>
            <span className="mx-2 text-gray-400">|</span>
            <a href="/services-en-ligne" className="hover:text-gray-900 transition-colors">Accessibilité des services en ligne</a>
            <span className="mx-2 text-gray-400">|</span>
            <a href="/mentions-legales" className="hover:text-gray-900 transition-colors">Mentions légales</a>
            <span className="mx-2 text-gray-400">|</span>
            <a href="/donnees-personnelles" className="hover:text-gray-900 transition-colors">Données personnelles et sécurité</a>
            <span className="mx-2 text-gray-400">|</span>
            <a href="/conditions" className="hover:text-gray-900 transition-colors">Conditions générales d'utilisation</a>
            <span className="mx-2 text-gray-400">|</span>
            <a href="/cookies" className="hover:text-gray-900 transition-colors">Gestion des cookies</a>
          </nav>
        </div>

        {/* License Notice */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Sauf mention contraire, tous les contenus de ce site sont sous{' '}
            <a 
              href="https://www.etalab.gouv.fr/licence-ouverte-open-licence/" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              licence etalab-2.0
            </a>
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>© 2025 République de Guinée - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
