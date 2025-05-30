import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, FileText, AlertCircle, X, Phone } from 'lucide-react';

const FaqSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      answer: "Pour demander une carte nationale d'identité, vous devez fournir un certificat de naissance original, un certificat de nationalité, une preuve de résidence, deux photos d'identité récentes et le formulaire de demande dûment rempli.",
      category: "Documents"
    },
    {
      question: "Quel est le délai d'obtention d'une carte nationale d'identité ?",
      answer: "Le délai standard pour l'obtention d'une carte nationale d'identité est de 15 jours ouvrables. Un service accéléré est disponible moyennant des frais supplémentaires, permettant d'obtenir la carte en 3 à 5 jours ouvrables.",
      category: "Délais"
    },
    {
      question: "Combien coûte la demande d'une carte nationale d'identité ?",
      answer: "Le coût standard pour une première demande est de 50 000 GNF. Pour un renouvellement, le coût est de 30 000 GNF. Des frais supplémentaires s'appliquent pour le service accéléré.",
      category: "Tarifs"
    },
    {
      question: "Comment puis-je vérifier l'état d'avancement de ma demande ?",
      answer: "Vous pouvez vérifier l'état d'avancement de votre demande en ligne sur notre portail en utilisant votre numéro de référence, ou en vous rendant dans le centre où vous avez déposé votre demande avec votre récépissé.",
      category: "Suivi"
    },
    {
      question: "Que faire en cas de perte ou de vol de ma carte d'identité ?",
      answer: "En cas de perte ou de vol, vous devez d'abord déclarer la perte aux autorités de police et obtenir un certificat de perte. Ensuite, vous pouvez faire une demande de remplacement en présentant ce certificat et les mêmes documents que pour une première demande.",
      category: "Procédures"
    },
    {
      question: "Puis-je demander une carte d'identité pour un mineur ?",
      answer: "Oui, un parent ou tuteur légal peut demander une carte d'identité pour un mineur. Des documents supplémentaires sont requis, notamment une preuve de la relation parentale ou de la tutelle légale.",
      category: "Cas spécifiques"
    },
  ];

  // Filtrer les FAQs en fonction du terme de recherche
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section 
      id="faq"
      ref={sectionRef}
      className={`py-12 bg-gradient-to-b from-gray-50 to-blue-50 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4">
        {/* Titre et séparateur avec style administratif */}
        <div className="text-center mb-10">
          <div className="inline-block bg-blue-700 text-white px-6 py-3 rounded-md mb-4 transform hover:scale-105 transition-transform duration-300 shadow-md">
            <div className="flex items-center justify-center">
              <FileText className="h-6 w-6 mr-2" />
              <h2 className="text-2xl font-bold">FOIRE AUX QUESTIONS OFFICIELLES</h2>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">Consultez les informations officielles concernant la carte nationale d'identité et les procédures administratives associées.</p>
          <div className="flex items-center justify-center mt-6">
            <div className="h-1 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 flex-grow max-w-md"></div>
          </div>
        </div>
        
        {/* Barre de recherche améliorée */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Rechercher une question ou un mot-clé..." 
              className="w-full px-4 py-3 pl-12 rounded-md border-2 border-blue-300 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-blue-700" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button className="bg-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors">
            Toutes les questions
          </button>
          {Array.from(new Set(faqs.map(faq => faq.category))).map((category, index) => (
            <button 
              key={index}
              className="bg-white text-blue-700 border border-blue-300 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Accordéon FAQ amélioré */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div 
                key={index}
                className={`mb-5 border-2 rounded-lg overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-blue-700 shadow-xl' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease-out ${index * 100}ms`
                }}
              >
                {/* En-tête de la question avec style administratif */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className={`w-full flex items-center justify-between p-5 text-left font-medium ${openIndex === index ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900' : 'bg-white text-gray-700'}`}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center">
                    <div className={`mr-3 rounded-full p-2 ${openIndex === index ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold">{faq.question}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{faq.category}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown className={`h-6 w-6 ${openIndex === index ? 'text-blue-700' : 'text-gray-400'}`} />
                  </span>
                </button>
                
                {/* Contenu de la réponse amélioré */}
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
                >
                  <div className="p-5 bg-white border-t border-blue-100">
                    <div className="flex">
                      <div className="border-l-4 border-blue-700 pl-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <span>Dernière mise à jour: 15 Juin 2023</span>
                      </div>
                      <button className="text-sm text-blue-700 hover:text-blue-900 transition-colors duration-300 flex items-center bg-blue-50 px-3 py-1 rounded-full">
                        <span>Documentation officielle</span>
                        <ChevronDown className="h-4 w-4 ml-1 transform -rotate-90" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <AlertCircle className="h-12 w-12 mx-auto text-blue-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600">Aucune question ne correspond à votre recherche. Essayez d'autres termes ou consultez toutes les questions.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
              >
                Voir toutes les questions
              </button>
            </div>
          )}
        </div>
        <div className="mt-10 text-center overflow-x-hidden">
          <div className="bg-blue-50 border-l-4 border-blue-700 rounded-lg p-5 inline-block shadow-md max-w-2xl">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <AlertCircle className="h-6 w-6 text-blue-700" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-blue-900 mb-1">Information officielle</h4>
                <p className="text-blue-800 text-sm mb-3">Vous ne trouvez pas la réponse à votre question ?</p>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Contacter le service client
                  </button>
                  <button className="bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Consulter la documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;