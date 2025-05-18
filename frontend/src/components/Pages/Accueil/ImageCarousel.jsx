import React, { useState, useEffect } from 'react';

const ImageCarousel = () => {
  const images = [
    '/image4.jpg',
    '/image6.jpg',
    '/image8.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Fonction pour passer à l'image suivante
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Effet pour faire défiler automatiquement les images
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage
  }, []);

  // Styles pour les animations des textes
  const animationStyle = {
    animation: 'fadeInScale 2s ease-in-out infinite alternate',
  };
  
  

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden mt-[140px] md:mt-[150px] lg:mt-[160px]">
      {/* Les animations CSS sont définies dans index.css */}

      {/* Images du carrousel */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Superposition de texte et emblème uniquement sur l'image 4 (index 0) */}
          {index === 0 && currentIndex === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="flex items-center">
                <h3 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg" 
                  style={animationStyle}
                >
                 <p>Bienvenue sur le portail</p>
                 <p>CNID Guinée</p>
                </h3>
                <img 
                  src="/emblème.png" 
                  alt="Emblème de la Guinée" 
                  className="h-16 md:h-20 lg:h-20 ml-4"
                />
              </div>
              <p 
                className="text-1xl md:text-2xl lg:text-1xl mt-4 font-semibold drop-shadow-lg text-center"
                
              >
                plus besoin de se déplacer La République vient à vous
              </p>
            </div>
          )}
          
          {/* Texte sur l'image 6 (index 1) */}
          {index === 1 && currentIndex === 1 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <p 
                className="text-1xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg text-center px-4 max-w-5xl"
                
              >
                La carte d'identité, désormais à portée de village, où que vous soyez sans quitter votre préfecture votre identité vous rejoint
              </p>
            </div>
          )}
          
          {/* Texte sur l'image 8 (index 2) */}
          {index === 2 && currentIndex === 2 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <p 
                className="text-1xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg text-center px-4 max-w-5xl"
              >
                 Vous vivez loin ? Nous rapprochons l'administration de vous. Prenez rendez-vous pour votre biométrie, simplement et en ligne
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Indicateurs de position */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;