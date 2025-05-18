import React, { useEffect, useRef, useState } from 'react';

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
        rootMargin: '0px',
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
        height: '250px', // Hauteur réduite pour être plus compacte
      }}
    >
      <div 
        className={`absolute inset-0 w-full transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: 'url("/image9.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Effet parallaxe
          zIndex: 0,
        }}
      />
      <div className="absolute inset-0 z-10 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 px-4">
           Portail CNID Guinée
        </h1>
        <p className="text-xl md:text-2xl text-center px-4">
          Le service de gestion des cartes nationales d'identité de la République de Guinée
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;