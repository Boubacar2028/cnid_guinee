import React, { useEffect, useRef, useState } from 'react';
import '../../../animations.css';

const WelcomeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Quand l'élément devient visible ou non
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // viewport
        rootMargin: '-50px',
        threshold: 0.1, // déclenche quand 10% de l'élément est visible
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

  return (
    <div 
      ref={sectionRef}
      className="relative w-full"
      style={{
        height: '300px', // Hauteur légèrement augmentée pour plus d'impact
      }}
    >
      <div 
        className={`absolute inset-0 w-full transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        style={{
          backgroundImage: 'url("/image9.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Effet parallaxe
          zIndex: 0,
          filter: 'brightness(0.9) contrast(1.1)',
        }}
      />
      {/* Overlay avec dégradé pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-5"></div>
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
        <div className="max-w-4xl mx-auto text-center px-6 py-8 rounded-lg backdrop-blur-sm bg-black/20 border border-white/10 shadow-2xl transform transition-all duration-1000 ease-out"
             style={{
               opacity: isVisible ? 1 : 0,
               transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
             }}>
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-red-600 rounded-full flex items-center justify-center mr-4 animate-pulse">
              <img src="/emblème.png" alt="Emblème" className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
              Portail CNID Guinée
            </h1>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mx-auto my-4 rounded-full"></div>
          <p className="text-xl md:text-2xl text-center mt-4 animate-slideUp">
            Le service de gestion des cartes nationales d'identité de la République de Guinée
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-lg transition-all duration-300 hover:scale-105 animate-buttonPulse flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Découvrir
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-md shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;