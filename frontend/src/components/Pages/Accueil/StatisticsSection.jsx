import React, { useEffect, useRef, useState } from 'react';
import { FileCheck, Users, BarChart3, Award } from 'lucide-react';
import '../../../animations.css';

const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ demandes: 0, agents: 0, citoyens: 0, satisfaction: 0 });
  const [targetCounts, setTargetCounts] = useState({ demandes: 0, agents: 0, citoyens: 0, satisfaction: 98 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // Récupérer les statistiques depuis l'API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        
        console.log('🔍 Début de la récupération des statistiques');
        
        // Appel à l'API pour récupérer les statistiques
        console.log('🔍 Appel de l\'URL: /api/statistics/');
        
        // Essayer d'abord avec l'URL relative (proxy)
        let response;
        try {
          response = await fetch('/api/statistics/');
        } catch (error) {
          console.log('Échec avec l\'URL relative, tentative avec l\'URL complète');
          // Si ça échoue, essayer avec l'URL complète
          response = await fetch('http://localhost:8000/api/statistics/');
        }
        
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Données reçues:', data);
        
        // Mise à jour des valeurs cibles avec les données réelles
        setTargetCounts({
          demandes: data.processedRequests || 0,
          agents: data.activeAgents || 0,
          citoyens: data.registeredCitizens || 0,
          satisfaction: data.satisfactionRate || 98 // Valeur par défaut si non fournie
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
        setError('Impossible de charger les statistiques');
        // En cas d'erreur, on utilise des valeurs de démonstration
        setTargetCounts({
          demandes: 1250,
          agents: 85,
          citoyens: 15000,
          satisfaction: 98
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStatistics();
  }, []);

  // Animation de comptage pour les statistiques
  useEffect(() => {
    if (isVisible && !hasAnimated.current && !isLoading) {
      hasAnimated.current = true;
      
      const durationDemandes = 2000; // 2 secondes
      
      const stepDemandes = Math.ceil(targetCounts.demandes / (durationDemandes / 16)); // 60fps
      const stepAgents = Math.ceil(targetCounts.agents / (durationDemandes / 16));
      const stepCitoyens = Math.ceil(targetCounts.citoyens / (durationDemandes / 16));
      const stepSatisfaction = Math.ceil(targetCounts.satisfaction / (durationDemandes / 16));
      
      let currentDemandes = 0;
      let currentAgents = 0;
      let currentCitoyens = 0;
      let currentSatisfaction = 0;
      
      const interval = setInterval(() => {
        currentDemandes = Math.min(currentDemandes + stepDemandes, targetCounts.demandes);
        currentAgents = Math.min(currentAgents + stepAgents, targetCounts.agents);
        currentCitoyens = Math.min(currentCitoyens + stepCitoyens, targetCounts.citoyens);
        currentSatisfaction = Math.min(currentSatisfaction + stepSatisfaction, targetCounts.satisfaction);
        
        setCounts({
          demandes: currentDemandes,
          agents: currentAgents,
          citoyens: currentCitoyens,
          satisfaction: currentSatisfaction
        });
        
        if (currentDemandes >= targetCounts.demandes && 
            currentAgents >= targetCounts.agents && 
            currentCitoyens >= targetCounts.citoyens &&
            currentSatisfaction >= targetCounts.satisfaction) {
          clearInterval(interval);
        }
      }, 16);
      
      return () => clearInterval(interval);
    }
  }, [isVisible, isLoading, targetCounts]);

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

  // Données des statistiques
  const statistics = [
    {
      number: counts.demandes.toLocaleString('fr-FR'),
      description: 'Demandes traitées',
      color: 'text-red-700',
      borderColor: 'border-red-700',
      underlineColor: 'bg-red-700',
      bgColor: 'bg-white',
      icon: <FileCheck className="h-10 w-10" />,
      delay: '0',
      iconBg: 'bg-red-100'
    },
    {
      number: counts.agents.toLocaleString('fr-FR'),
      description: 'Agents actifs',
      color: 'text-blue-700',
      borderColor: 'border-blue-700',
      underlineColor: 'bg-blue-700',
      bgColor: 'bg-white',
      icon: <Users className="h-10 w-10" />,
      delay: '200',
      iconBg: 'bg-blue-100'
    },
    {
      number: counts.citoyens.toLocaleString('fr-FR'),
      description: 'Citoyens enregistrés',
      color: 'text-green-700',
      borderColor: 'border-green-700',
      underlineColor: 'bg-green-700',
      bgColor: 'bg-white',
      icon: <BarChart3 className="h-10 w-10" />,
      delay: '400',
      iconBg: 'bg-green-100'
    },
    {
      number: `${counts.satisfaction}%`,
      description: 'Taux de satisfaction',
      color: 'text-yellow-700',
      borderColor: 'border-yellow-700',
      underlineColor: 'bg-yellow-700',
      bgColor: 'bg-white',
      icon: <Award className="h-10 w-10" />,
      delay: '600',
      iconBg: 'bg-yellow-100'
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gray-100"
    >
      <div className="container mx-auto px-4">
        {/* Titre avec style administratif */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <h2 className="text-3xl font-bold text-gray-800 relative">
              <span className="relative z-10">STATISTIQUES NATIONALES</span>
              <span className="absolute bottom-1 left-0 w-full h-2 bg-red-600 -z-10"></span>
            </h2>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Suivez en temps réel les indicateurs clés du système national d'identification
          </p>
        </div>

        {/* Cartes de statistiques avec style administratif */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease-out ${stat.delay}ms`,
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.iconBg} rounded-full p-3 flex items-center justify-center`}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className={`${stat.color} text-4xl font-bold animate-countUp`}>
                    {stat.number}
                  </div>
                </div>
                <div className={`h-1 w-full ${stat.underlineColor} mb-3`}></div>
                <p className="text-gray-700 font-medium">{stat.description}</p>
              </div>
              <div className={`h-1 w-full ${stat.underlineColor}`}></div>
            </div>
          ))}
        </div>
        
        {/* Bannière d'information avec style administratif */}
        <div className="mt-12 bg-white border-l-4 border-blue-700 p-4 rounded-md shadow-md flex items-center" style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-out 800ms'
        }}>
          <div className="bg-blue-100 p-2 rounded-full mr-4">
            <svg className="h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Information officielle</h4>
            <p className="text-sm text-gray-600">
              {error ? 
                "Les statistiques affichées sont des données de démonstration. Connexion au serveur impossible." :
                `Les statistiques sont mises à jour quotidiennement par le Ministère de l'Administration du Territoire. Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}`
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;