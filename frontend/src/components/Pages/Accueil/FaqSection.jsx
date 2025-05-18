import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';

const FaqSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

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

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Données des questions fréquentes
  const faqs = [
    {
      question: "Quels documents sont nécessaires pour demander une carte nationale d'identité ?",
      answer: "Pour demander une carte nationale d'identité, vous devez fournir un certificat de naissance original, un certificat de nationalité, une preuve de résidence, deux photos d'identité récentes et le formulaire de demande dûment rempli."
    },
    {
      question: "Quel est le délai d'obtention d'une carte nationale d'identité ?",
      answer: "Le délai standard pour l'obtention d'une carte nationale d'identité est de 15 jours ouvrables. Un service accéléré est disponible moyennant des frais supplémentaires, permettant d'obtenir la carte en 3 à 5 jours ouvrables."
    },
    {
      question: "Combien coûte la demande d'une carte nationale d'identité ?",
      answer: "Le coût standard pour une première demande est de 50 000 GNF. Pour un renouvellement, le coût est de 30 000 GNF. Des frais supplémentaires s'appliquent pour le service accéléré."
    },
    {
      question: "Comment puis-je vérifier l'état d'avancement de ma demande ?",
      answer: "Vous pouvez vérifier l'état d'avancement de votre demande en ligne sur notre portail en utilisant votre numéro de référence, ou en vous rendant dans le centre où vous avez déposé votre demande avec votre récépissé."
    },
    {
      question: "Que faire en cas de perte ou de vol de ma carte d'identité ?",
      answer: "En cas de perte ou de vol, vous devez d'abord déclarer la perte aux autorités de police et obtenir un certificat de perte. Ensuite, vous pouvez faire une demande de remplacement en présentant ce certificat et les mêmes documents que pour une première demande."
    },
    {
      question: "Puis-je demander une carte d'identité pour un mineur ?",
      answer: "Oui, un parent ou tuteur légal peut demander une carte d'identité pour un mineur. Des documents supplémentaires sont requis, notamment une preuve de la relation parentale ou de la tutelle légale."
    },
  ];

  return (
    <section 
      id="faq"
      ref={sectionRef}
      className={`py-12 bg-gradient-to-b from-gray-50 to-blue-50 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4">
        {/* Titre et séparateur */}
        <div className="text-center mb-10">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full mb-4 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center">
              <HelpCircle className="h-6 w-6 mr-2" />
              <h2 className="text-2xl font-bold">FOIRE AUX QUESTIONS</h2>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">Trouvez rapidement des réponses aux questions les plus fréquemment posées sur nos services.</p>
          <div className="flex items-center justify-center mt-6">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-grow max-w-md"></div>
          </div>
        </div>
        
        {/* Barre de recherche */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Rechercher une question..." 
              className="w-full px-4 py-3 pl-12 rounded-full border-2 border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-blue-500" />
          </div>
        </div>
        
        {/* Accordéon FAQ */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`mb-5 border-2 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-blue-500 shadow-xl' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease-out ${index * 100}ms`
              }}
            >
              {/* En-tête de la question */}
              <button
                onClick={() => toggleQuestion(index)}
                className={`w-full flex items-center justify-between p-5 text-left font-medium ${openIndex === index ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800' : 'bg-white text-gray-700'}`}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex items-center">
                  <div className={`mr-3 rounded-full p-2 ${openIndex === index ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-semibold">{faq.question}</span>
                </div>
                <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronDown className={`h-6 w-6 ${openIndex === index ? 'text-blue-600' : 'text-gray-400'}`} />
                </span>
              </button>
              
              {/* Contenu de la réponse */}
              <div 
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="p-5 bg-white border-t border-blue-100">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  <div className="mt-3 flex justify-end">
                    <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center">
                      <span>Plus d'informations</span>
                      <ChevronDown className="h-4 w-4 ml-1 transform rotate-270" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note en bas */}
        <div className="mt-10 text-center">
          <div className="bg-blue-100 rounded-lg p-4 inline-block shadow-sm">
            <p className="text-blue-800">Vous ne trouvez pas la réponse à votre question ?</p>
            <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 transform hover:scale-105">
              Contactez notre service client
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;