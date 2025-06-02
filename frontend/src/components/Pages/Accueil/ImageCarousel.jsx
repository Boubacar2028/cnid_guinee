import React, { useState, useEffect, useRef } from 'react';
import '../../../animations.css';

const ImageCarousel = () => {
  const images = [
    '/image4.jpg',
    '/image6.jpg',
    '/image8.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);

  // Fonction pour passer à l'image suivante avec transition
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    setTimeout(() => setIsTransitioning(false), 1000); // Correspond à la durée de transition
  };

  // Fonction pour passer à l'image précédente
  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  // Effet pour faire défiler automatiquement les images
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Change d'image toutes les 6 secondes

    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage
  }, [isTransitioning]);

  // Styles pour les animations des textes
  const titleAnimationStyle = {
    animation: 'fadeInScale 2s ease-in-out',
  };
  
  const subtitleAnimationStyle = {
    animation: 'slideInUp 1.5s ease-out 0.5s both',
  };
  
  const textAnimationStyle = {
    animation: 'pulseGlow 3s infinite',
  };
  
  

  return (
    <div 
      ref={carouselRef}
      className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden mt-[140px] md:mt-[150px] lg:mt-[160px] shadow-2xl max-w-full"
    >
      {/* Overlay de gradient pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

      {/* Images du carrousel avec transitions améliorées */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Superposition de texte et emblème uniquement sur l'image 4 (index 0) */}
          {index === 0 && currentIndex === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
              <div className="flex items-center bg-black/30 px-6 py-4 rounded-lg backdrop-blur-sm">
                <div className="text-center">
                  <h3 
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg" 
                    style={titleAnimationStyle}
                  >
                    <p>Bienvenue sur le portail</p>
                    <p>CNID Guinée</p>
                  </h3>
                  <p 
                    className="text-xl md:text-2xl mt-4 font-semibold drop-shadow-lg text-center"
                    style={subtitleAnimationStyle}
                  >
                    Plus besoin de se déplacer - La République vient à vous
                  </p>
                </div>
                <img 
                  src="/embleme.png" 
                  alt="Emblème de la Guinée" 
                  className="h-16 md:h-20 lg:h-24 ml-4 animate-rotateIcon"
                />
              </div>
            </div>
          )}
          
          {/* Texte sur l'image 6 (index 1) */}
          {index === 1 && currentIndex === 1 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
              <div className="bg-black/40 px-8 py-6 rounded-lg backdrop-blur-sm max-w-5xl">
                <p 
                  className="text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg text-center"
                  style={textAnimationStyle}
                >
                  La carte d'identité, désormais à portée de village, où que vous soyez sans quitter votre préfecture votre identité vous rejoint
                </p>
              </div>
            </div>
          )}
          
          {/* Texte sur l'image 8 (index 2) */}
          {index === 2 && currentIndex === 2 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
              <div className="bg-black/40 px-8 py-6 rounded-lg backdrop-blur-sm max-w-5xl">
                <p 
                  className="text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg text-center"
                  style={textAnimationStyle}
                >
                  Vous vivez loin ? Nous rapprochons l'administration de vous. Prenez rendez-vous pour votre biométrie, simplement et en ligne
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Boutons de navigation */}
      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none"
        disabled={isTransitioning}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none"
        disabled={isTransitioning}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicateurs de position améliorés */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 1000);
              }
            }}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentIndex 
              ? 'bg-white scale-110 shadow-lg' 
              : 'bg-white/50 hover:bg-white/70'}`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;