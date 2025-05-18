import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', isBot: true },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const chatBoxRef = useRef(null);

  // Observer pour l'animation d'entrée
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

    if (chatBoxRef.current) {
      observer.observe(chatBoxRef.current);
    }

    return () => {
      if (chatBoxRef.current) {
        observer.unobserve(chatBoxRef.current);
      }
    };
  }, []);

  // Défilement automatique vers le bas lorsque de nouveaux messages sont ajoutés
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Ajouter le message de l'utilisateur
    const userMessage = { id: Date.now(), text: inputValue, isBot: false };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simuler une réponse du bot après un délai
    setTimeout(() => {
      const botResponses = [
        'Je vous remercie pour votre question. Notre équipe va l\'examiner et vous répondre dans les plus brefs délais.',
        'Pour cette demande spécifique, je vous invite à consulter la section FAQ qui pourrait contenir la réponse.',
        'Votre demande a été enregistrée. Un agent vous contactera prochainement.',
        'Pour plus d\'informations, vous pouvez visiter notre site web ou appeler notre service client au +224 XX XX XX XX.',
        'Cette fonctionnalité sera disponible prochainement. Merci de votre patience.',
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = { id: Date.now(), text: randomResponse, isBot: true };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      ref={chatBoxRef}
      className={`fixed bottom-20 right-6 md:right-10 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {/* Bouton pour ouvrir/fermer le chat */}
      <button 
        onClick={toggleChat}
        className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Bot className="h-6 w-6" />
        )}
      </button>

      {/* Boîte de chat */}
      <div 
        className={`bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
        style={{ width: '350px', maxHeight: '500px' }}
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-6 w-6 mr-2" />
              <h3 className="font-bold">Assistant CNID</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none transition-colors duration-300"
              aria-label="Fermer le chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs mt-1 text-blue-100">Posez vos questions sur les cartes d'identité</p>
        </div>

        {/* Corps du chat */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`max-w-3/4 rounded-lg p-3 ${message.isBot 
                  ? 'bg-blue-100 text-gray-800 rounded-tl-none' 
                  : 'bg-blue-600 text-white rounded-tr-none'}`}
              >
                <div className="flex items-start">
                  {message.isBot && <Bot className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />}
                  {!message.isBot && <User className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />}
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 rounded-lg p-3 rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulaire de saisie */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
          <div className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tapez votre question..."
              className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-300 focus:outline-none disabled:bg-blue-400"
              disabled={inputValue.trim() === '' || isTyping}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;