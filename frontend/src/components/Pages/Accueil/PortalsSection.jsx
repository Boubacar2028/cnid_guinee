import React, { useEffect, useRef, useState } from 'react';
import { User, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../../animations.css';

const PortalsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Effet de survol pour les cartes
  const [hoveredCard, setHoveredCard] = useState(null);

  // Données des portails
  const portals = [
    {
      title: 'Portail Citoyens',
      description: 'Effectuez votre demande de carte nationale d\'identité en ligne',
      icon: <User className="h-16 w-16" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      buttonBg: 'bg-green-500',
      buttonHover: 'hover:bg-green-600',
      delay: '0',
      path: '/portail-citoyens'
    },
    {
      title: 'Portail Agents',
      description: 'Espace réservé aux agents pour le traitement des demandes',
      icon: <Users className="h-16 w-16" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      buttonBg: 'bg-blue-500',
      buttonHover: 'hover:bg-blue-600',
      delay: '300',
      path: '/portail-agents'
    },
    {
      title: 'Portail Administrateur',
      description: 'Administration et supervision du système',
      icon: <Shield className="h-16 w-16" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
      buttonBg: 'bg-purple-500',
      buttonHover: 'hover:bg-purple-600',
      delay: '600',
      path: '/portail-administrateur',
      isSpecial: true
    },
  ];

  return (
    <section 
      id="portals"
      ref={sectionRef}
      className="py-16 bg-white transition-all duration-1000 overflow-x-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}"
    >
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne verte à gauche - visible uniquement sur desktop */}
          <div className="hidden lg:block lg:w-1/4 bg-gradient-to-b from-green-500 to-teal-600 text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6">LES PORTAILS</h2>
            <div className="h-1 w-20 bg-white mb-6"></div>
            <h3 className="text-2xl font-bold mb-4">Tous les citoyens font leur demande au portail citoyens</h3>
            <p className="text-lg">Seul les agents de l'Etat ont accès aux deux autres portails</p>
          </div>

          {/* Titre visible uniquement sur mobile et tablette */}
          <div className="lg:hidden text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">ACCÈS AUX PORTAILS</h2>
            <div className="flex items-center justify-center">
              <div className="h-0.5 bg-gray-300 flex-grow"></div>
              <div className="mx-4 text-blue-500 bg-blue-100 rounded-full p-2 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="h-0.5 bg-gray-300 flex-grow"></div>
            </div>
          </div>

          {/* Cartes des portails */}
          <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {portals.map((portal, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-lg p-8 text-center transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer group ${portal.isSpecial ? 'relative z-10' : ''} ${portal.isSpecial ? 'animate-pulse-slow' : ''}`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.7s ease-out ${portal.delay}ms`
                }}
              >
                <div className={`${portal.color} flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  {portal.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${portal.color} transition-all duration-300 group-hover:scale-105`}>{portal.title}</h3>
                <p className="text-gray-700 text-lg mb-6 transition-all duration-300 group-hover:text-gray-900">{portal.description}</p>
                {portal.isSpecial ? (
                  // Bouton spécial pour l'administrateur - plus facile à cliquer
                  <a 
                    href={portal.path}
                    className={`${portal.buttonBg} ${portal.buttonHover} text-white font-bold py-3 px-6 rounded-lg block w-full transition-all duration-300 hover:shadow-lg text-center`}
                    style={{ fontSize: '1rem' }}
                  >
                    Accéder
                  </a>
                ) : (
                  // Bouton standard pour les autres portails
                  <Link 
                    to={portal.path}
                    className={`${portal.buttonBg} ${portal.buttonHover} text-white font-bold py-4 px-8 rounded-lg inline-block w-full transition-all duration-300 hover:shadow-lg active:scale-95`}
                    role="button"
                    aria-label={`Accéder au ${portal.title}`}
                  >
                    Accéder
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortalsSection;