import React, { useState, useEffect, useRef } from 'react';
import { X, Home, User, Search, Globe, LogOut, Menu, Bell, ChevronDown, Shield } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { NAV_LINKS } from '../../constants';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [language, setLanguage] = useState('fr');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Utiliser le hook useLocation pour déterminer si l'utilisateur est dans le portail citoyen
  const location = useLocation();
  const isLoggedIn = location.pathname.includes('/portail-citoyens');
  
  const phrases = [
    "Une identité sécurisée pour chaque citoyen 🇬🇳",
    "L'administration guinéenne à l'ère du numérique",
    "Une plateforme pensée pour tous les Guinéens, où qu'ils soient",
    "Plus besoin d'être à la capitale pour exister administrativement",
    "Fièrement Guinéen, fièrement identifié"
  ];
  
  const timeoutRef = useRef(null);
  const phraseIntervalRef = useRef(null);

  // Fonction pour afficher la phrase complète immédiatement
  const animatePhrase = (phrase) => {
    setDisplayedWords(phrase.split(' '));
    setIsAnimating(false);
  };
  
  // Effet pour changer de phrase toutes les 7 secondes
  useEffect(() => {
    // Animer la première phrase au chargement
    animatePhrase(phrases[currentPhraseIndex]);
    
    // Configurer l'intervalle pour changer de phrase
    phraseIntervalRef.current = setInterval(() => {
      const nextIndex = (currentPhraseIndex + 1) % phrases.length;
      setCurrentPhraseIndex(nextIndex);
      animatePhrase(phrases[nextIndex]);
    }, 7000); // 7 secondes par phrase
    
    // Nettoyage
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(phraseIntervalRef.current);
    };
  }, [currentPhraseIndex]);

  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
      {/* Partie supérieure */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Bloc gauche : Drapeau + emblème + titre */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-20 rounded-md overflow-hidden shadow-sm">
                <div className="w-1/3 bg-red-600"></div>
                <div className="w-1/3 bg-yellow-400"></div>
                <div className="w-1/3 bg-green-600"></div>
              </div>
              <div className="bg-white p-1 rounded-full shadow-sm">
                <img src="/emblème.png" alt="Emblème" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h1 className="font-bold text-lg md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">RÉPUBLIQUE DE GUINÉE</h1>
                <p className="text-xs md:text-sm text-gray-600">Travail - Justice - Solidarité</p>
              </div>
            </div>

            {/* Bloc central : slogan animé (visible uniquement sur grands écrans) */}
            <div className="hidden lg:flex flex-1 justify-center">
              <div className="relative overflow-hidden h-8">
                <p className="text-base md:text-lg italic text-gray-600 text-center font-medium absolute inset-0 flex items-center justify-center">
                  {displayedWords.join(' ')}
                </p>
              </div>
            </div>

            {/* Bloc droit : Connexion/Déconnexion + Réseaux sociaux + Sélecteur de langue */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link to="/" className="text-base flex items-center gap-1 hover:text-red-600 transition-colors bg-white hover:bg-gray-100 px-3 py-1.5 rounded-md font-medium shadow-sm border border-gray-200">
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Se déconnecter</span>
                </Link>
              ) : (
                <Link to="/portail-citoyens" className="text-base flex items-center gap-1 hover:text-green-600 transition-colors bg-white hover:bg-gray-100 px-3 py-1.5 rounded-md font-medium shadow-sm border border-gray-200">
                  <User size={18} />
                  <span className="hidden sm:inline">Se connecter</span>
                </Link>
              )}
              <div className="flex gap-3">
                <a href="#" className="hover:text-blue-600 text-xl transition-transform hover:scale-110">
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </a>
                <a href="#" className="hover:text-blue-400 text-xl transition-transform hover:scale-110">
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </a>
                <a href="#" className="hover:text-pink-600 text-xl transition-transform hover:scale-110">
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </a>
              </div>
              <div className="border-l border-gray-300 pl-3">
                <button 
                  onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} 
                  className="flex items-center gap-1 text-sm hover:text-green-600 transition-colors bg-white rounded-full p-1.5 shadow-sm"
                >
                  <Globe size={16} />
                  <span className="font-medium">{language === 'fr' ? 'FR' : 'EN'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de navigation */}
      <div className={`bg-white border-t border-gray-200 transition-all duration-300 ${isScrolled ? 'py-1' : 'py-2'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo site */}
          <a href="/" className="flex items-center gap-2 text-gray-700 hover:text-green-600 text-sm font-medium">
            <Shield size={18} className="text-green-600" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">Service-Public.gn</span>
          </a>

          {/* Barre de recherche */}
          <div className="flex-grow max-w-lg mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher sur le site"
                className="w-full pl-4 pr-10 py-1.5 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Menu principal (desktop) */}
          <div className="hidden lg:block">
            <nav>
              <ul className="flex items-center space-x-6 text-sm">
                {NAV_LINKS.map((link, i) => (
                  <li key={i} className="relative group">
                    <a 
                      href={link.href} 
                      className="flex items-center hover:text-green-600 py-2 border-b-2 border-transparent hover:border-green-600 transition-all duration-300"
                    >
                      {link.title}
                      {link.sublinks && <ChevronDown size={14} className="ml-1" />}
                    </a>
                    {link.sublinks && (
                      <div className="absolute hidden group-hover:block bg-white shadow-lg mt-1 py-2 px-3 rounded-md text-sm z-50 min-w-[200px] border-t-2 border-green-600">
                        {link.sublinks.map((sublink, j) => (
                          <a 
                            key={j} 
                            href={sublink.href} 
                            className="block py-2 px-3 hover:bg-gray-50 hover:text-green-600 rounded-md transition-colors"
                          >
                            {sublink.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Bouton menu mobile */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-green-600 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            {/* Barre de recherche mobile */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher sur le site"
                  className="w-full pl-4 pr-10 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600">
                  <Search size={18} />
                </button>
              </div>
            </div>
            
            {/* Navigation mobile */}
            <nav>
              <ul className="space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.href} 
                      className="block py-2 px-3 hover:bg-gray-50 hover:text-green-600 rounded-md transition-colors font-medium"
                    >
                      {link.title}
                    </a>
                    {link.sublinks && (
                      <ul className="pl-6 space-y-1 mt-1">
                        {link.sublinks.map((sublink, j) => (
                          <li key={j}>
                            <a 
                              href={sublink.href} 
                              className="block py-1.5 px-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600 rounded-md transition-colors"
                            >
                              {sublink.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;