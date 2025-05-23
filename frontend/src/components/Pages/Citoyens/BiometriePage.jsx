import React, { useState, useEffect } from 'react';
import CitoyenHeader from './CitoyenHeader';
import MapView from '../../Common/MapView';

const BiometriePage = () => {
  const [selectedCommune, setSelectedCommune] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Afficher l'alerte de carte lorsque l'utilisateur sélectionne un créneau horaire
  useEffect(() => {
    if (selectedDate && selectedTime && selectedCommune) {
      setShowMapAlert(true);
    }
  }, [selectedDate, selectedTime, selectedCommune]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0); // Index de la semaine actuellement affichée
  
  // Liste des communes disponibles pour la biométrie avec leurs coordonnées GPS
  const communes = [
    { id: "ratoma", name: "Ratoma", address: "Commissariat central de Nongo, à coté du stade", position: [9.621584287382367, -13.628781276449926] },
    { id: "ratoma2", name: "Ratoma", address: "Mairie de Ratoma, à Taouyah", position: [9.581608951397286, -13.658828711332744] },
    { id: "matoto", name: "Matoto", address: "Mairie de Matoto", position: [9.602229751801728, -13.601724365742529] }
  ];
  
  // État pour afficher l'alerte de carte
  const [showMapAlert, setShowMapAlert] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    // Trouver le prochain lundi
    const day = today.getDay();
    const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + diff);
    return nextMonday;
  });

  // Générer les dates disponibles (6 semaines à partir de la date actuelle)
  const generateDates = (startDate) => {
    const dates = [];
    const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
    const today = new Date();
    
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 5; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (week * 7) + day);
        
        // Ne pas inclure les dates passées
        if (date < today) continue;
        
        dates.push({
          day: weekDays[day],
          date: date.getDate(),
          month: date.toLocaleString('fr-FR', { month: 'long' }),
          year: date.getFullYear(),
          full: date
        });
      }
    }
    return dates;
  };

  const availableDates = generateDates(currentWeekStart);

  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    } else {
      const newDate = new Date(currentWeekStart);
      newDate.setDate(currentWeekStart.getDate() - 7);
      const today = new Date();
      // Ne pas permettre la navigation vers les semaines passées
      if (newDate >= today) {
        setCurrentWeekStart(newDate);
      }
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < 2) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    } else {
      const newDate = new Date(currentWeekStart);
      newDate.setDate(currentWeekStart.getDate() + 7);
      // Limiter la navigation à 6 semaines dans le futur
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 42); // 6 semaines
      if (newDate <= maxDate) {
        setCurrentWeekStart(newDate);
        setCurrentWeekIndex(0);
      }
    }
  };

  // Générer les créneaux horaires disponibles
  const generateTimeSlots = () => {
    const slots = [];
    
    // Créneaux du matin (8h30 - 13h30)
    for (let hour = 8; hour <= 13; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // On commence à 8h30
        if (hour === 8 && minute < 30) continue;
        
        // Format des minutes avec un zéro devant si nécessaire
        const formattedMinute = minute === 0 ? '00' : minute.toString();
        slots.push(`${hour}:${formattedMinute}`);
        
        // S'arrêter à 13h30
        if (hour === 13 && minute === 30) break;
      }
    }
    
    // Créneaux de l'après-midi (14h00 - 17h00)
    for (let hour = 14; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // S'arrêter à 17h00 précises
        if (hour === 17 && minute > 0) break;
        
        // Format des minutes avec un zéro devant si nécessaire
        const formattedMinute = minute === 0 ? '00' : minute.toString();
        slots.push(`${hour}:${formattedMinute}`);
      }
    }

    return slots;
  };

  const availableTimeSlots = generateTimeSlots();

  return (
    <>
      <CitoyenHeader />
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-full lg:max-w-7xl xl:max-w-screen-2xl">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Prendre un rendez-vous</h1>
              <p className="text-gray-600 mt-2">Choisissez une date et un horaire pour votre rendez-vous biométrique</p>
              
              {/* Sélection de la commune */}
              <div className="mt-4">
                <label htmlFor="commune-select" className="block text-sm font-medium text-gray-700 mb-1">Sélectionnez votre centre de biométrie</label>
                <select 
                  id="commune-select"
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">-- Choisissez une commune --</option>
                  {communes.map(commune => (
                    <option key={commune.id} value={commune.id}>{commune.name} - {commune.address}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Navigation des semaines */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={goToPreviousWeek}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Semaine précédente
              </button>
              <button 
                onClick={goToNextWeek}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Semaine suivante
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendrier */}
            <div className="mb-8">
              <div className="w-full max-w-3xl mx-auto">
                {/* Semaine actuelle */}
                {(() => {
                    const weekDates = availableDates.slice(currentWeekIndex * 5, (currentWeekIndex + 1) * 5);
                    if (weekDates.length === 0) return null;
                    
                    const firstDate = weekDates[0];
                    return (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4 text-center">
                          Semaine du {firstDate.date} {firstDate.month} {firstDate.year}
                        </h3>
                        <div className="grid grid-cols-5 gap-2 md:gap-4">
                          {weekDates.map((date, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedDate(date.full)}
                              className={'p-3 md:p-4 rounded-lg text-center transition-colors ' + (
                                selectedDate && selectedDate.getDate() === date.date
                                  ? 'bg-blue-50 border-2 border-blue-500'
                                  : index === 4 ? 'bg-green-50 border border-green-200 hover:bg-white' : 'hover:bg-white border border-gray-200'
                              )}
                            >
                              <div className="font-medium text-sm md:text-base">{date.day}</div>
                              <div className="text-lg font-bold mt-1 md:text-xl">{date.date}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                })()}
              </div>
            </div>

            {/* Sélection de l'horaire */}
            {selectedDate && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium mb-6 text-blue-700">Horaires disponibles pour le {selectedDate.getDate()} {selectedDate.toLocaleString('fr-FR', { month: 'long' })}</h3>
                
                <h4 className="text-base font-medium text-gray-600 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Horaires disponibles
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableTimeSlots.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(time)}
                      className={'p-3 text-center rounded-lg transition-colors ' + (
                        selectedTime === time
                          ? 'bg-blue-50 border-2 border-blue-500 text-blue-700 font-medium'
                          : 'bg-gray-50 hover:bg-white border border-gray-200'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}




            
            {/* Bouton de validation */}
            {selectedDate && selectedTime && selectedCommune && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Récapitulatif du rendez-vous</h4>
                    <p className="text-blue-600">
                      <span className="block"><strong>Centre :</strong> {communes.find(c => c.id === selectedCommune)?.name}</span>
                      <span className="block"><strong>Date :</strong> Le {selectedDate.getDate()} {selectedDate.toLocaleString('fr-FR', { month: 'long' })}</span>
                      <span className="block"><strong>Heure :</strong> {selectedTime}</span>
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={() => {
                        // Ajouter ici la logique pour valider le rendez-vous
                        alert(`Rendez-vous confirmé au centre de ${communes.find(c => c.id === selectedCommune)?.name} le ${selectedDate.getDate()} ${selectedDate.toLocaleString('fr-FR', { month: 'long' })} à ${selectedTime} !`);
                      }}
                      className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                    >
                      Confirmer le rendez-vous
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Carte des centres de biométrie - Positionée après la confirmation */}
          {selectedDate && selectedTime && selectedCommune && (
            <div className="mt-8 mb-8 bg-white rounded-lg shadow-lg p-6 md:p-8 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Itinéraire vers le centre de biométrie</h2>
              <p className="text-gray-600 mb-4 max-w-4xl">Voici l'emplacement du centre où vous devez vous rendre pour votre rendez-vous. Utilisez les contrôles pour alterner entre vue satellite et plan, et cliquez sur "Itinéraire" pour obtenir des directions.</p>
              <div className="h-72 md:h-96 lg:h-[30rem] w-full overflow-hidden rounded-lg shadow-lg border border-gray-200">
                <MapView 
                  centers={communes} 
                  selectedCenterId={selectedCommune} 
                  onCenterClick={(centerId) => setSelectedCommune(centerId)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 italic">Astuce : Cliquez sur les marqueurs pour voir les détails des centres. Le bouton "Itinéraire" vous permettra d'accéder à Google Maps.</p>
            </div>
          )}

          {/* Informations sur les données biométriques */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cadre légal */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Explication sur les données biométrique</h2>
              <p className="text-gray-600">
                La collecte et le traitement des données biométriques sont encadrés par le Règlement Général sur la Protection des Données  et la loi informatique
                et Libertés. Ces données sont considérées comme sensibles et bénéficient d'une protection renforcée.
              </p>
            </div>

            {/* Données collectées */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Quelles données biométriques sont collectées ?</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Empreintes digitales des huit doigts</li>
                <li>Photo numérique du visage aux normes biométriques</li>
                <li>Signature numérisée</li>
              </ul>
              <p className="mt-3 text-gray-600">
                Ces données sont stockées de manière sécurisée dans la puce électronique de votre carte d'identité et dans une base de données sécurisée de l'État.
              </p>
            </div>

            {/* Protection et sécurité */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Protection et sécurité des données</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Les données biométriques sont chiffrées selon les standards les plus élevés et ne peuvent être consultées que par les autorités habilitées.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>L'accès aux données est strictement contrôlé et tracé. Toute consultation fait l'objet d'un enregistrement.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Les données sont conservées pendant la durée de validité de la carte, plus une période de 10 ans.</span>
                </li>
              </ul>
            </div>

            {/* Vos droits */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Vos droits concernant vos données biométriques</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Droit d'accès : vous pouvez demander quelles données sont détenues vous concernant.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Droit de rectification : en cas d'erreur, vous pouvez demander la correction de vos données.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span>Droit d'opposition : dans certains cas spécifiques, vous pouvez vous opposer au traitement de vos données.</span>
                </li>
              </ul>
            </div>

            {/* Message important */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6 lg:col-span-2">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    La collecte des données biométriques est obligatoire pour l'établissement d'une carte nationale d'identité Guinéenne. Ces données sont essentielles pour garantir la sécurité et
                    l'authenticité du document.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BiometriePage;
