import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  // État pour suivre quel témoignage est survolé
  const [hoveredTestimonial, setHoveredTestimonial] = useState(null);

  // Données des témoignages
  const testimonials = [
    {
      id: 1,
      name: 'MAMADOU SALIOU',
      role: 'AGRICULTEUR',
      title: 'Témoignage de Mamadou Saliou, Agriculteur à Dalaba',
      image: '/agriculteur.jpg',
      color: 'bg-red-400',
      size: 'col-span-1 row-span-2',
      position: 'bottom-0 left-0',
      testimonial: "Je vis dans un village éloigné, et aller à la ville pour demander une carte, c’est compliqué. Mais avec ce site, j’ai pu faire ma demande sans bouger. Mon neveu m’a aidé à le faire sur son téléphone. C’est un vrai raccourci pour nous au village."
    },
    {
      id: 2,
      name: 'FANTA KABA',
      role: 'INFIRMIERE',
      title: 'FANTA KABA, INFIRMIERE',
      image: '/image5.jpeg',
      color: 'bg-red-500',
      size: 'col-span-1 row-span-1',
      position: 'top-0 left-0',
      testimonial: "Je travaille de longues heures à l’hôpital, et je n’avais pas le temps de gérer mes papiers. Grâce à ce portail, j’ai pu soumettre ma demande en ligne, suivre son avancement, et prendre rendez-vous selon mes disponibilités. Bravo pour cette initiative !"
    },
    {
      id: 3,
      name: 'ABUBAKR SYLLA',
      role: 'ÉTUDIANT',
      title: '',
      image: '/image8.jpg',
      color: 'bg-red-400',
      size: 'col-span-1 row-span-1',
      position: 'bottom-0 left-0',
      testimonial: "Avec mes cours à l’université, je n’avais pas le temps d’aller faire la queue pour une demande de carte. Ce site m’a permis de tout faire en ligne, et j’ai juste eu à me déplacer le jour du rendez-vous. Très pratique pour nous les étudiants !"
    }
  ];

  return (
    <section 
      id="testimonials"
      ref={sectionRef}
      className={`py-8 bg-white transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4">
        {/* Titre et séparateur */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">DÉCOUVREZ LES TÉMOIGNAGES DE DIFFÉRENTS CITOYENS</h2>
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-gray-300 flex-grow"></div>
            <div className="mx-4 text-red-500 bg-red-100 rounded-full p-2 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="h-0.5 bg-gray-300 flex-grow"></div>
          </div>
        </div>
        
        {/* Grille de témoignages asymétrique */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className={`relative overflow-hidden ${testimonial.size} h-80 cursor-pointer group`}
              onMouseEnter={() => setHoveredTestimonial(testimonial.id)}
              onMouseLeave={() => setHoveredTestimonial(null)}
            >
              {/* Image de fond */}
              <img 
                src={testimonial.image} 
                alt={`Photo de ${testimonial.name}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Titre en haut si présent */}
              {testimonial.title && (
                <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-xs p-2 max-w-[80%]">
                  {testimonial.title}
                </div>
              )}
              
              {/* Bannière avec le nom */}
              <div className={`absolute ${testimonial.position} left-0 right-0 ${testimonial.color} text-white py-2 px-4`}>
                <h3 className="font-bold text-xl tracking-wide">{testimonial.name}</h3>
              </div>
              
              {/* Rôle en bas à droite */}
              <div className="absolute bottom-0 right-0 bg-white text-black text-xs p-2 flex items-center">
                {testimonial.role}
                <Info className="h-3 w-3 ml-1 text-blue-500" />
              </div>
              
              {/* Tooltip qui apparaît au survol */}
              {hoveredTestimonial === testimonial.id && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 transition-opacity duration-300 z-10">
                  <div className="bg-white rounded-lg p-4 max-w-xs shadow-lg">
                    <h4 className="font-bold text-lg text-gray-900 mb-2">{testimonial.name}</h4>
                    <p className="text-gray-700 text-sm">{testimonial.testimonial}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;