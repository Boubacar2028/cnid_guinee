import React, { useEffect, useRef, useState } from 'react';
import { Info, CheckCircle, Quote, ChevronLeft, ChevronRight, MessageSquarePlus } from 'lucide-react';

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
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

  // Rotation automatique des témoignages
  useEffect(() => {
    if (isVisible) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 8000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible]);

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % testimonials.length
    );
  };

  // Données des témoignages
  const testimonials = [
    {
      id: 1,
      name: 'MAMADOU SALIOU',
      role: 'AGRICULTEUR',
      location: 'Dalaba',
      date: '15/03/2023',
      verified: true,
      image: '/agriculteur.jpg',
      color: 'bg-red-600',
      testimonial: "Je vis dans un village éloigné, et aller à la ville pour demander une carte, c'est compliqué. Mais avec ce site, j'ai pu faire ma demande sans bouger. Mon neveu m'a aidé à le faire sur son téléphone. C'est un vrai raccourci pour nous au village."
    },
    {
      id: 2,
      name: 'FANTA KABA',
      role: 'INFIRMIERE',
      location: 'Conakry',
      date: '22/04/2023',
      verified: true,
      image: '/image5.jpeg',
      color: 'bg-red-600',
      testimonial: "Je travaille de longues heures à l'hôpital, et je n'avais pas le temps de gérer mes papiers. Grâce à ce portail, j'ai pu soumettre ma demande en ligne, suivre son avancement, et prendre rendez-vous selon mes disponibilités. Bravo pour cette initiative !"
    },
    {
      id: 3,
      name: 'ABUBAKR SYLLA',
      role: 'ÉTUDIANT',
      location: 'Kankan',
      date: '10/05/2023',
      verified: true,
      image: '/image8.jpg',
      color: 'bg-red-600',
      testimonial: "Avec mes cours à l'université, je n'avais pas le temps d'aller faire la queue pour une demande de carte. Ce site m'a permis de tout faire en ligne, et j'ai juste eu à me déplacer le jour du rendez-vous. Très pratique pour nous les étudiants !"
    }
  ];

  return (
    <section 
      id="testimonials"
      ref={sectionRef}
      className={`py-12 bg-gradient-to-b from-white to-gray-50 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4">
        {/* Titre et séparateur dans un style administratif */}
        <div className="text-center mb-10">
          <div className="inline-block bg-red-600 text-white px-6 py-2 rounded-full mb-4 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center">
              <Quote className="h-6 w-6 mr-2" />
              <h2 className="text-2xl font-bold">TÉMOIGNAGES DES CITOYENS</h2>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les expériences des citoyens qui ont utilisé notre plateforme pour leurs démarches administratives.</p>
          <div className="flex items-center justify-center mt-6">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent flex-grow max-w-md"></div>
          </div>
        </div>
        
        {/* Affichage des témoignages en rotation */}
        <div className="max-w-4xl mx-auto relative bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          {/* Contrôles de navigation */}
          <button 
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md z-10 hover:bg-opacity-100 transition-all duration-300"
            aria-label="Témoignage précédent"
          >
            <ChevronLeft className="h-6 w-6 text-red-600" />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md z-10 hover:bg-opacity-100 transition-all duration-300"
            aria-label="Témoignage suivant"
          >
            <ChevronRight className="h-6 w-6 text-red-600" />
          </button>
          
          <div className="flex flex-col md:flex-row">
            {/* Image du citoyen */}
            <div className="md:w-1/3 h-64 md:h-auto relative">
              <img 
                src={testimonials[activeIndex].image} 
                alt={`Photo de ${testimonials[activeIndex].name}`} 
                className="w-full h-full object-cover"
              />
              <div className={`absolute bottom-0 left-0 right-0 ${testimonials[activeIndex].color} text-white py-2 px-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl tracking-wide">{testimonials[activeIndex].name}</h3>
                  {testimonials[activeIndex].verified && (
                    <CheckCircle className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Contenu du témoignage */}
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-red-200 mr-2" />
                  <div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">{testimonials[activeIndex].role}</span>
                      <span className="text-sm text-gray-500">• {testimonials[activeIndex].location}</span>
                    </div>
                    <div className="text-xs text-gray-400">Témoignage vérifié le {testimonials[activeIndex].date}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonials[activeIndex].testimonial}"</p>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <Info className="h-4 w-4 mr-1" />
                  <span>Témoignage recueilli après utilisation du service</span>
                </div>
                
                {/* Indicateurs de navigation (points) */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-red-600 w-5' : 'bg-gray-300'}`}
                      aria-label={`Voir témoignage ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bannière officielle */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-md max-w-3xl mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img src="/emblème.png" alt="Emblème de la Guinée" className="h-10 w-10" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Information officielle</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Ces témoignages sont recueillis dans le cadre de notre programme d'amélioration continue des services publics. Ils représentent l'expérience réelle des citoyens avec notre plateforme.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Appel à l'action */}
        <div className="text-center mt-10">
          <button className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300">
            <MessageSquarePlus className="mr-2 h-5 w-5" />
            Partagez votre expérience
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;