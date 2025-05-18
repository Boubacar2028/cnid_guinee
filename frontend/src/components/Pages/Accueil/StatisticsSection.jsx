import React, { useEffect, useRef, useState } from 'react';
import { FileCheck, Users, BarChart3 } from 'lucide-react';

const StatisticsSection = () => {
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

  // Données des statistiques
  const statistics = [
    {
      number: '21 480',
      description: 'Demandes traitées',
      color: 'text-red-500',
      borderColor: 'border-red-500',
      underlineColor: 'bg-red-500',
      bgColor: 'bg-red-50',
      icon: <FileCheck className="h-10 w-10" />,
      delay: '0'
    },
    {
      number: '0',
      description: 'Agents actifs',
      color: 'text-yellow-500',
      borderColor: 'border-yellow-500',
      underlineColor: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      icon: <Users className="h-10 w-10" />,
      delay: '300'
    },
    {
      number: '0',
      description: 'Citoyens enregistrés',
      color: 'text-green-600',
      borderColor: 'border-green-600',
      underlineColor: 'bg-green-600',
      bgColor: 'bg-green-50',
      icon: <BarChart3 className="h-10 w-10" />,
      delay: '600'
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-16 bg-gray-50 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4">
        {/* Titre et séparateur */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-cyan-800 mb-4">STATISTIQUES ET CHIFFRES CLES</h2>
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-cyan-800 flex-grow"></div>
            <div className="mx-4 text-orange-500 bg-orange-100 rounded-full p-2 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="h-0.5 bg-cyan-800 flex-grow"></div>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statistics.map((stat, index) => (
            <div 
              key={index} 
              className={`border-2 ${stat.borderColor} rounded-xl p-8 text-center ${stat.bgColor} shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.7s ease-out ${stat.delay}ms`
              }}
            >
              <div className={`${stat.color} flex justify-center mb-2`}>
                {stat.icon}
              </div>
              <h3 className={`text-5xl font-bold mb-3 ${stat.color}`}>{stat.number}</h3>
              <p className="text-gray-700 text-lg font-medium mb-3">{stat.description}</p>
              <div className={`w-24 h-1 mx-auto mt-2 ${stat.underlineColor} rounded-full`}></div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 italic">Les données sont mises à jour quotidiennement</p>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;