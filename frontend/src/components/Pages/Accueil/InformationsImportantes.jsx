import React, { useEffect, useRef, useState } from 'react';

const InformationsImportantes = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Quand l'élément devient visible à 20% ou plus
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Une fois visible, on n'a plus besoin d'observer
          observer.unobserve(entry.target);
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2, // déclenche quand 20% de l'élément est visible
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
    <div className="container mx-auto px-4 py-8 max-w-5xl" ref={sectionRef}>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Informations Importantes</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Documents Requis */}
        <div 
          className={`bg-white rounded-lg shadow-md p-6 max-w-md mx-auto w-full transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
          style={{ transitionDelay: '100ms' }}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Documents Requis</h3>
          </div>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Certificat de nationalité</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Extrait d'acte de naissance</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Certificat de résidence</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Photo d'identité récente</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Justificatif de domicile</span>
            </li>
          </ul>
        </div>

        {/* Étapes de la Demande */}
        <div 
          className={`bg-white rounded-lg shadow-md p-6 max-w-md mx-auto w-full transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
          style={{ transitionDelay: '300ms' }}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Étapes de la Demande</h3>
          </div>
          
          <ol className="space-y-4">
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium mr-3">
                1
              </div>
              <div className="flex-1 bg-blue-50 p-3 rounded-md">
                <span className="font-medium">Création du compte citoyen</span>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium mr-3">
                2
              </div>
              <div className="flex-1 bg-blue-50 p-3 rounded-md">
                <span className="font-medium">Remplissage du formulaire en ligne</span>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium mr-3">
                3
              </div>
              <div className="flex-1 bg-blue-50 p-3 rounded-md">
                <span className="font-medium">Téléchargement des documents requis</span>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium mr-3">
                4
              </div>
              <div className="flex-1 bg-blue-50 p-3 rounded-md">
                <span className="font-medium">Validation par un agent</span>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium mr-3">
                5
              </div>
              <div className="flex-1 bg-blue-50 p-3 rounded-md">
                <span className="font-medium">Prise de rendez-vous pour la biométrie</span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default InformationsImportantes;