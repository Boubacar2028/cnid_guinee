import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

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
  // Préparation des données pour Chart.js
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: [
          '#22c55e', // vert pour approuvées
          '#f59e0b', // orange pour en attente
          '#ef4444', // rouge pour rejetées
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
          '#ffffff',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Options pour le graphique
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <span className="mr-2">📊</span> 
        Répartition des demandes
      </h3>
      
      <div className="h-64 flex justify-center py-2">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

// Composant pour le graphique à barres
const BarChart = ({ weeklyData }) => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  const approvedData = weeklyData.approved;
  const pendingData = weeklyData.pending;
  
  // Préparation des données pour Chart.js
  const chartData = {
    labels: days,
    datasets: [
      {
        label: 'Approuvées',
        data: approvedData,
        backgroundColor: '#22c55e',
        borderColor: '#16a34a',
        borderWidth: 1,
      },
      {
        label: 'En attente',
        data: pendingData,
        backgroundColor: '#f59e0b',
        borderColor: '#d97706',
        borderWidth: 1,
      },
    ],
  };

  // Options pour le graphique
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
        },
      },
    },
  };
  
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Performance hebdomadaire</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    activeEmployees: 0,
    requestDistribution: [
      { label: 'Approuvées', value: 0, color: 'bg-green-500' },
      { label: 'En attente', value: 0, color: 'bg-orange-400' },
      { label: 'Rejetées', value: 0, color: 'bg-red-500' }
    ],
    weeklyPerformance: {
      approved: [0, 0, 0, 0, 0, 0, 0],
      pending: [0, 0, 0, 0, 0, 0, 0]
    },
    monthlyReport: {
      processedRequests: 0,
      averageTime: '0 jours',
      satisfaction: 0
    },
    agentPerformance: {
      bestAgent: '',
      requestsPerDay: 0,
      efficiency: 0
    },
    systemInfo: {
      uptime: 0,
      activeUsers: 0,
      storageUsed: 0
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Récupération des données du tableau de bord');
      // Utilisation de l'URL correcte
      const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Mise à jour des données du tableau de bord
        setDashboardData({
          totalRequests: data.totalRequests || 0,
          pendingRequests: data.pendingRequests || 0,
          approvedRequests: data.approvedRequests || 0,
          activeEmployees: data.activeEmployees || 0,
          requestDistribution: [
            { label: 'Approuvées', value: data.approvedRequestsPercentage || 0, color: 'bg-green-500' },
            { label: 'En attente', value: data.pendingRequestsPercentage || 0, color: 'bg-orange-400' },
            { label: 'Rejetées', value: data.rejectedRequestsPercentage || 0, color: 'bg-red-500' }
          ],
          weeklyPerformance: {
            approved: data.weeklyApprovedRequests || [0, 0, 0, 0, 0, 0, 0],
            pending: data.weeklyPendingRequests || [0, 0, 0, 0, 0, 0, 0]
          },
          monthlyReport: {
            processedRequests: data.monthlyProcessedRequests || 0,
            averageTime: data.averageProcessingTime || '0 jours',
            satisfaction: data.satisfactionRate || 0
          },
          agentPerformance: {
            bestAgent: data.bestPerformingAgent || '',
            requestsPerDay: data.averageRequestsPerDay || 0,
            efficiency: data.agentEfficiency || 0
          },
          systemInfo: {
            uptime: data.systemUptime || 99.9,
            activeUsers: data.activeUsers || 0,
            storageUsed: data.storageUsedPercentage || 0
          }
        });
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des données du tableau de bord:', err);
        setError('Impossible de charger les données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
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

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <StatCard 
          title="Total demandes" 
          value={dashboardData.totalRequests.toString()} 
          icon="📊" 
          color="blue" 
          trend={7.8} 
          trendText="% depuis le mois dernier" 
        />
        <StatCard 
          title="En attente" 
          value={dashboardData.pendingRequests.toString()} 
          icon="⏳" 
          color="orange" 
          trend={2.5} 
          trendText="% depuis la semaine dernière" 
        />
        <StatCard 
          title="Approuvées" 
          value={dashboardData.approvedRequests.toString()} 
          icon="✅" 
          color="green" 
          trend={3.1} 
          trendText="% depuis hier" 
        />
        <StatCard 
          title="Employés actifs" 
          value={dashboardData.activeEmployees.toString()} 
          icon="👥" 
          color="purple" 
          trend={-1.2} 
          trendText="% depuis la semaine dernière" 
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DonutChart data={dashboardData.requestDistribution} />
        <BarChart weeklyData={dashboardData.weeklyPerformance} />
      </div>
      
      {/* Évolution mensuelle */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Évolution mensuelle</h3>
        <div className="h-64">
          {/* Graphique linéaire avec Chart.js */}
          <Line 
            data={{
              labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
              datasets: [
                {
                  label: 'Demandes traitées',
                  data: [60, 80, 92, 88, 100, 96],
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.3,
                  fill: false,
                  pointBackgroundColor: '#3b82f6',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 2,
                  pointRadius: 4,
                },
                {
                  label: 'Demandes rejetées',
                  data: [20, 22, 24, 23, 22, 24],
                  borderColor: '#8b5cf6',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  tension: 0.3,
                  fill: false,
                  pointBackgroundColor: '#8b5cf6',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 2,
                  pointRadius: 4,
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  align: 'end',
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: '#f3f4f6',
                  },
                  ticks: {
                    stepSize: 30,
                  }
                },
              },
            }}
          />
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
              <span className="font-medium">{dashboardData.monthlyReport.processedRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Temps moyen:</span>
              <span className="font-medium">{dashboardData.monthlyReport.averageTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Satisfaction:</span>
              <span className="font-medium text-green-500">{dashboardData.monthlyReport.satisfaction}%</span>
            </div>
          </div>
        </div>
        
        {/* Performance agents */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Performance agents</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Meilleur agent:</span>
              <span className="font-medium">{dashboardData.agentPerformance.bestAgent || 'Aucun'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Demandes/jour:</span>
              <span className="font-medium">{dashboardData.agentPerformance.requestsPerDay}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Efficacité:</span>
              <span className="font-medium text-green-500">{dashboardData.agentPerformance.efficiency}%</span>
            </div>
          </div>
        </div>
        
        {/* Système */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Système</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium text-green-500">{dashboardData.systemInfo.uptime}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Utilisateurs actifs:</span>
              <span className="font-medium">{dashboardData.systemInfo.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stockage utilisé:</span>
              <span className="font-medium">{dashboardData.systemInfo.storageUsed}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
