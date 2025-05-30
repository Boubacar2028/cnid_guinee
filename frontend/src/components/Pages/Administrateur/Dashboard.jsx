import React from 'react';

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, icon, color, trend, trendText }) => {
  const bgColor = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-400',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  }[color];

  const trendColor = trend > 0 ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className={`${bgColor} rounded-lg shadow-md text-white p-4`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-white text-xl">{icon}</div>
      </div>
      <div className="mt-3 text-xs">
        <span className={trend > 0 ? 'text-white opacity-90' : 'text-white opacity-90'}>
          {trend > 0 ? '+' : ''}{trend}{trendText}
        </span>
      </div>
    </div>
  );
};

// Composant pour le graphique en donut
const DonutChart = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <span className="mr-2">📊</span> 
        Répartition des demandes
      </h3>
      
      <div className="flex justify-center py-5">
        {/* Ceci est une représentation simplifiée du donut chart */}
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full"></div>
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Ces valeurs seraient normalement calculées dynamiquement */}
            <circle r="40" cx="50" cy="50" fill="transparent" stroke="#22c55e" strokeWidth="20" strokeDasharray="188.5 251.3" />
            <circle r="40" cx="50" cy="50" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="62.8 251.3" strokeDashoffset="-188.5" />
            <circle r="40" cx="50" cy="50" fill="transparent" stroke="#ef4444" strokeWidth="20" strokeDasharray="25.1 251.3" strokeDashoffset="-125.7" />
          </svg>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 text-sm mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-1 ${item.color}`}></span>
            <span>{item.label}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour le graphique à barres
const BarChart = () => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  // Ces hauteurs seraient normalement calculées dynamiquement
  const approvedData = [12, 15, 18, 14, 22, 8, 5];
  const pendingData = [8, 6, 4, 9, 3, 12, 15];
  
  const maxValue = Math.max(...approvedData, ...pendingData) * 1.2;
  
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Performance hebdomadaire</h3>
      
      <div className="flex items-end h-44 mt-4 space-x-2 border-b border-l border-gray-200 relative">
        {/* Axe Y - graduations */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          {[0, Math.round(maxValue/3), Math.round(2*maxValue/3), Math.round(maxValue)].map((value, i) => (
            <div key={i} className="relative -translate-y-1/2" style={{top: `${100 - (value/maxValue)*100}%`}}>
              {value}
              <div className="absolute left-2 w-full border-t border-dashed border-gray-200" style={{top: '50%'}}></div>
            </div>
          ))}
        </div>
        
        {/* Barres */}
        <div className="flex-1 flex justify-between items-end pt-5 pl-6">
          {days.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-1 w-8">
              <div className="flex space-x-1 w-full">
                {/* Barre verte (approuvées) */}
                <div 
                  className="w-3 bg-green-500 rounded-t"
                  style={{height: `${(approvedData[index]/maxValue)*100}%`}}
                ></div>
                
                {/* Barre orange (en attente) */}
                <div 
                  className="w-3 bg-orange-400 rounded-t"
                  style={{height: `${(pendingData[index]/maxValue)*100}%`}}
                ></div>
              </div>
              <div className="text-xs">{day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Données pour le donut chart
  const donutData = [
    { label: 'Approuvées', value: 120, color: 'bg-green-500' },
    { label: 'En attente', value: 45, color: 'bg-orange-400' },
    { label: 'Rejetées', value: 15, color: 'bg-red-500' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble du système</p>
        </div>
        <div className="text-gray-600 text-sm">
          Dernière mise à jour: 30/05/2025
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total des demandes" 
          value="180" 
          icon="📄"
          color="blue" 
          trend={12} 
          trendText="% ce mois" 
        />
        <StatCard 
          title="En attente" 
          value="45" 
          icon="⏳"
          color="orange" 
          trend={-5} 
          trendText="% cette semaine" 
        />
        <StatCard 
          title="Approuvées" 
          value="120" 
          icon="✅"
          color="green" 
          trend={18} 
          trendText="% ce mois" 
        />
        <StatCard 
          title="Employés actifs" 
          value="11" 
          icon="👥"
          color="purple" 
          trend={1} 
          trendText=" ce mois" 
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DonutChart data={donutData} />
        <BarChart />
      </div>
      
      {/* Évolution mensuelle */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Évolution mensuelle</h3>
        <div className="h-64">
          {/* Graphique linéaire */}
          <svg className="w-full h-full" viewBox="0 0 1000 300">
            {/* Grille */}
            <g fill="none" stroke="#e5e7eb" strokeWidth="1">
              {/* Lignes horizontales */}
              {[0, 30, 60, 90, 120].map((y, i) => (
                <line key={`h-${i}`} x1="50" y1={300 - y * 2.5} x2="950" y2={300 - y * 2.5} strokeDasharray="5,5" />
              ))}
              
              {/* Lignes verticales */}
              {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'].map((_, i) => {
                const x = 50 + i * 180;
                return <line key={`v-${i}`} x1={x} y1="0" x2={x} y2="275" strokeDasharray="5,5" />;
              })}
            </g>
            
            {/* Axes X et Y */}
            <line x1="50" y1="275" x2="950" y2="275" stroke="#9ca3af" strokeWidth="1" />
            
            {/* Légende de l'axe X */}
            {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'].map((month, i) => {
              const x = 50 + i * 180;
              return (
                <text key={`month-${i}`} x={x} y="295" textAnchor="middle" fontSize="12" fill="#6b7280">
                  {month}
                </text>
              );
            })}
            
            {/* Légende de l'axe Y */}
            {[0, 30, 60, 90, 120].map((value, i) => (
              <text key={`value-${i}`} x="40" y={300 - value * 2.5} textAnchor="end" fontSize="12" fill="#6b7280">
                {value}
              </text>
            ))}
            
            {/* Courbe bleue (demandes traitées) */}
            <path 
              d="M50,150 L230,100 L410,70 L590,80 L770,50 L950,60" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2" 
            />
            
            {/* Points sur la courbe bleue */}
            <circle cx="50" cy="150" r="4" fill="#3b82f6" />
            <circle cx="230" cy="100" r="4" fill="#3b82f6" />
            <circle cx="410" cy="70" r="4" fill="#3b82f6" />
            <circle cx="590" cy="80" r="4" fill="#3b82f6" />
            <circle cx="770" cy="50" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
            <circle cx="950" cy="60" r="4" fill="#3b82f6" />
            
            {/* Courbe violette (rejets) */}
            <path 
              d="M50,250 L230,245 L410,240 L590,242 L770,245 L950,240" 
              fill="none" 
              stroke="#8b5cf6" 
              strokeWidth="2" 
            />
            
            {/* Points sur la courbe violette */}
            <circle cx="50" cy="250" r="4" fill="#8b5cf6" />
            <circle cx="230" cy="245" r="4" fill="#8b5cf6" />
            <circle cx="410" cy="240" r="4" fill="#8b5cf6" />
            <circle cx="590" cy="242" r="4" fill="#8b5cf6" />
            <circle cx="770" cy="245" r="4" fill="#8b5cf6" />
            <circle cx="950" cy="240" r="4" fill="#8b5cf6" />
          </svg>
        </div>
      </div>
      
      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rapport mensuel */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Rapport mensuel</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Demandes traitées:</span>
              <span className="font-medium">98</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Temps moyen:</span>
              <span className="font-medium">2.3 jours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Satisfaction:</span>
              <span className="font-medium text-green-500">94%</span>
            </div>
          </div>
        </div>
        
        {/* Performance agents */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Performance agents</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Meilleur agent:</span>
              <span className="font-medium">Agent A</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Demandes/jour:</span>
              <span className="font-medium">15.2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Efficacité:</span>
              <span className="font-medium text-green-500">96%</span>
            </div>
          </div>
        </div>
        
        {/* Système */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Système</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium text-green-500">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Utilisateurs actifs:</span>
              <span className="font-medium">847</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stockage utilisé:</span>
              <span className="font-medium">76%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
