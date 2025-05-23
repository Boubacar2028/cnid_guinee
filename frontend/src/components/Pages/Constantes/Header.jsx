import React, { useState, useEffect, useRef } from 'react';
import { MenuIcon, X, Home, User, Search, Globe, LogOut } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { NAV_LINKS } from '../../constants';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [language, setLanguage] = useState('fr'); // fr pour français, en pour anglais
  
  // Utiliser le hook useLocation pour déterminer si l'utilisateur est dans le portail citoyen
  const location = useLocation();
  const isLoggedIn = location.pathname.includes('/portail-citoyens');
  
  const phrases = [
    "Une identité sécurisée pour chaque citoyen 🇬🇳",
    "L'administration guinéenne à l'ère du numérique",
    "Une plateforme pensée pour tous les Guinéens, où qu’ils soient",
    "Plus besoin d'être à la capitale pour exister administrativement",
    "Fièrement Guinéen, fièrement identifié"
  ];
  
  const timeoutRef = useRef(null);
  const phraseIntervalRef = useRef(null);

  // Fonction pour afficher la phrase complète immédiatement
  const animatePhrase = (phrase) => {
    // Afficher la phrase complète immédiatement au lieu de mot par mot
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
  
  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      {/* Partie supérieure */}
      <div className="bg-gray-100 text-gray-900">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Bloc gauche : Drapeau + emblème + titre */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-20">
                <div className="w-1/3 bg-red-600"></div>
                <div className="w-1/3 bg-yellow-400"></div>
                <div className="w-1/3 bg-green-600"></div>
              </div>
              <img src="/emblème.png" alt="Emblème" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="font-bold text-lg md:text-2xl">RÉPUBLIQUE DE GUINÉE</h1>
                <p className="text-xs md:text-sm">Travail - Justice - Solidarité</p>
              </div>
            </div>

            {/* Bloc central : slogan animé (visible uniquement sur grands écrans) */}
            <div className="hidden lg:flex flex-1 justify-center">
              <p className="text-base md:text-lg italic text-gray-600 min-h-[2.5rem] text-center font-medium">
                {displayedWords.join(' ')}
              </p>
            </div>

            {/* Bloc droit : Connexion/Déconnexion + Réseaux sociaux + Sélecteur de langue */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link to="/" className="text-base flex items-center gap-1 hover:text-green-700 transition-colors bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-md font-medium">
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Se déconnecter</span>
                </Link>
              ) : (
                <Link to="/portail-citoyens" className="text-base flex items-center gap-1 hover:text-green-700 transition-colors bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-md font-medium">
                  <User size={18} />
                  <span className="hidden sm:inline">Se connecter</span>
                </Link>
              )}
              <div className="flex gap-3">
                <a href="#" className="hover:text-blue-600 text-xl">
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </a>
                <a href="#" className="hover:text-blue-400 text-xl">
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </a>
              </div>
              <div className="border-l border-gray-300 pl-3">
                <button 
                  onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} 
                  className="flex items-center gap-1 text-sm hover:text-green-700 transition-colors"
                >
                  <Globe size={18} />
                  {language === 'fr' ? 'FR' : 'EN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de navigation */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo site */}
          <a href="/" className="flex items-center gap-2 text-gray-700 hover:text-green-700 text-sm">
            <Home size={18} />
            Service-Public.gn
          </a>

          {/* Barre de recherche */}
          <div className="flex-grow max-w-lg mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher sur le site"
                className="w-full pl-4 pr-10 py-1.5 border rounded text-sm focus:outline-none focus:ring focus:border-green-600"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700">
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
                    <a href={link.href} className="hover:text-green-600">{link.title}</a>
                    {link.sublinks && (
                      <div className="absolute hidden group-hover:block bg-white shadow-md mt-1 py-2 px-3 rounded text-sm z-50">
                        {link.sublinks.map((sublink, j) => (
                          <a key={j} href={sublink.href} className="block py-1 hover:text-green-700">
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
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-gray-600">
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full mb-4 px-4 py-2 border rounded"
          />
          <ul className="space-y-3 text-sm">
            {NAV_LINKS.map((link, i) => (
              <li key={i}>
                <a href={link.href} className="block hover:text-green-700">{link.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
