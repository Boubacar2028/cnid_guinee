import React, { useState } from 'react';
import CitoyenHeader from './CitoyenHeader';

const BiometriePage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
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
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    const today = new Date();
    // Ne pas permettre la navigation vers les semaines passées
    if (newDate >= today) {
      setCurrentWeekStart(newDate);
    }
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    // Limiter la navigation à 6 semaines dans le futur
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 42); // 6 semaines
    if (newDate <= maxDate) {
      setCurrentWeekStart(newDate);
    }
  };

  // Générer les créneaux horaires disponibles
  const generateTimeSlots = () => {
    const morningSlots = [];
    const afternoonSlots = [];
    
    // Créneaux du matin (9h - 12h)
    for (let hour = 9; hour < 12; hour++) {
      ['00', '30'].forEach(minutes => {
        morningSlots.push(`${hour}:${minutes}`);
      });
    }

    // Créneaux de l'après-midi (14h - 16h30)
    for (let hour = 14; hour < 17; hour++) {
      ['00', '30'].forEach(minutes => {
        if (hour === 16 && minutes === '30') return; // Pas de créneau à 16h30
        afternoonSlots.push(`${hour}:${minutes}`);
      });
    }

    return { morningSlots, afternoonSlots };
  };

  const { morningSlots, afternoonSlots } = generateTimeSlots();

  return (
    <>
      <CitoyenHeader />
      <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Prendre un rendez-vous</h1>
              <p className="text-gray-600 mt-2">Choisissez une date et un horaire pour votre rendez-vous biométrique</p>
            </div>

            {/* Navigation des semaines */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={goToPreviousWeek}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Semaine précédente
              </button>
              <button 
                onClick={goToNextWeek}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Semaine suivante
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendrier */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2].map((week) => {
                  const weekDates = availableDates.slice(week * 5, (week + 1) * 5);
                  if (weekDates.length === 0) return null;
                  
                  const firstDate = weekDates[0];
                  const lastDate = weekDates[weekDates.length - 1];
                  return (
                  <div key={week} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">
                      Du {firstDate.date} au {lastDate.date} {lastDate.month} {lastDate.year}
                    </h3>
                    <div className="space-y-2">
                      {weekDates.map((date, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(date.full)}
                          className={'w-full p-3 rounded-lg text-left transition-colors ' + (
                            selectedDate && selectedDate.getDate() === date.date
                              ? 'bg-blue-50 border-2 border-blue-500'
                              : 'hover:bg-white'
                          )}
                        >
                          <div className="font-medium">{date.day}</div>
                          <div className="text-sm text-gray-600">{date.date} {date.month}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Sélection de l'horaire */}
            {selectedDate && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-6">Horaires disponibles pour le {selectedDate.getDate()} {selectedDate.toLocaleString('fr-FR', { month: 'long' })}</h3>
                
                {/* Créneaux du matin */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Matin</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {morningSlots.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(time)}
                        className={'p-3 text-center rounded-lg transition-colors ' + (
                          selectedTime === time
                            ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                            : 'bg-gray-50 hover:bg-white border border-gray-200'
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Créneaux de l'après-midi */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Après-midi</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {afternoonSlots.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(time)}
                        className={'p-3 text-center rounded-lg transition-colors ' + (
                          selectedTime === time
                            ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                            : 'bg-gray-50 hover:bg-white border border-gray-200'
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bouton de validation */}
            {selectedDate && selectedTime && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">Récapitulatif du rendez-vous</h4>
                  <p className="text-blue-600">
                    Le {selectedDate.getDate()} {selectedDate.toLocaleString('fr-FR', { month: 'long' })} à {selectedTime}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Ajouter ici la logique pour valider le rendez-vous
                    alert('Rendez-vous confirmé !');
                  }}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  Confirmer le rendez-vous
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BiometriePage;
