import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
try {
  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);
} catch (error) {
  console.error("Erreur lors de l'enregistrement des composants Chart.js:", error);
}

const StatCard = ({ title, value, icon, color, trend, trendText }) => {
  const bgColorClass = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-400',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  }[color] || 'bg-gray-500';
  const trendVal = parseFloat(trend) || 0;
  return (
    <div className={`${bgColorClass} rounded-lg shadow-md text-white p-4`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <p className="text-3xl font-bold mt-2">{String(value)}</p>
        </div>
        <div className="text-white text-xl">{icon}</div>
      </div>
      <div className="mt-3 text-xs">
        <span className={'text-white opacity-90'}>
          {(trendVal > 0 ? '+' : '') + trendVal + (trendText || '')}
        </span>
      </div>
    </div>
  );
};

// --- Composant DonutChart ---
const DonutChart = ({ chartData, chartOptions }) => {
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0 || chartData.datasets[0].data.every(val => val === 0)) {
    return <p className="text-gray-400 h-64 flex justify-center items-center">Pas de données de répartition disponibles pour le graphique.</p>;
  }
  return (
    <div className="h-64 w-full flex justify-center items-center"> {/* Conteneur avec hauteur définie */} 
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};
// --- Fin du Composant DonutChart ---

// --- Composant BarChartComponent ---
const BarChartComponent = ({ chartData, chartOptions }) => {
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0 || chartData.datasets.every(dataset => dataset.data.every(val => val === 0))) {
    return <p className="text-gray-400 h-64 flex justify-center items-center">Pas de données de performance hebdomadaire disponibles.</p>;
  }
  return (
    <div className="h-64 w-full flex justify-center items-center">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};
// --- Fin du Composant BarChartComponent ---

// --- Composant LineChartComponent ---
const LineChartComponent = ({ chartData, chartOptions }) => {
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0 || chartData.datasets.every(dataset => dataset.data.every(val => val === 0))) {
    return <p className="text-gray-400 h-64 flex justify-center items-center">Pas de données de performance mensuelle disponibles.</p>;
  }
  return (
    <div className="h-64 w-full flex justify-center items-center">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};
// --- Fin du Composant LineChartComponent ---

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRequests: 0, pendingRequests: 0, approvedRequests: 0, activeEmployees: 0,
    requestDistribution: [], weeklyPerformance: { approved: Array(7).fill(0), pending: Array(7).fill(0) },
    monthlyReport: { processedRequests: Array(12).fill(0), averageTime: '', satisfaction: 0 },
    agentPerformance: { bestAgent: 'N/A', requestsPerDay: 0, efficiency: 0 },
    systemInfo: { uptime: 0, activeUsers: 0, storageUsed: 0 }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null); // Réinitialiser l'erreur précédente
                const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Token non trouvé. Veuillez vous reconnecter.');
          // navigate('/portail-administrateur/login');
          setLoading(false);
          return;
        }

        console.log(`Fetching data from: ${API_URL}/api/admin_dashboard/`);
        const response = await fetch(`${API_URL}/api/admin/dashboard/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          let errorDetailMessage = `Erreur ${response.status}: ${response.statusText || 'Erreur inconnue'}`;
          const responseContentType = response.headers.get("content-type");
          console.log('Response content type (error):', responseContentType);

          try {
            const errorText = await response.text();
            console.error(`Réponse d'erreur brute du serveur (status ${response.status}):\n`, errorText);
            
            if (responseContentType && responseContentType.includes("application/json")) {
              const errorJson = JSON.parse(errorText);
              errorDetailMessage = errorJson.detail || errorJson.message || JSON.stringify(errorJson).substring(0, 200);
            } else if (responseContentType && responseContentType.includes("text/html")) {
               errorDetailMessage = `Erreur ${response.status}: Le serveur a renvoyé une page HTML d'erreur. Vérifiez la console Network pour les détails.`;
            } else {
              errorDetailMessage = errorText.substring(0, 300) || `Erreur ${response.status} sans message détaillé.`;
            }
          } catch (e) {
            console.error('Impossible de lire ou parser le corps de la réponse d\'erreur:', e);
            errorDetailMessage = `Erreur ${response.status}. Impossible de lire les détails de l'erreur du serveur.`;
          }
          
          if (response.status === 401) {
            setError('Session expirée ou invalide. Veuillez vous reconnecter. (' + errorDetailMessage + ')');
            // navigate('/portail-administrateur/login');
          } else {
            throw new Error(errorDetailMessage);
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
            console.log('DEBUG: Données brutes de API (data.requestDistribution):', data.requestDistribution);
        console.log('Data received from backend:', data);
        
        // Si data.requestDistribution est déjà le tableau formaté [{label: 'X', value: Y}, ...]
        // alors nous pouvons l'utiliser directement. Sinon, il faudra adapter.
        // D'après les logs, il semble que ce soit déjà le cas.
        const distributionForDonut = Array.isArray(data.requestDistribution) ? data.requestDistribution : [
          { label: 'Validée', value: 0 }, // Valeurs par défaut si la structure n'est pas celle attendue
          { label: 'En cours', value: 0 },
          { label: 'Rejetée', value: 0 },
        ];
        console.log('DEBUG: distributionForDonut après tentative de récupération directe:', distributionForDonut);

        setDashboardData({
          totalRequests: data.total_requests || 0,
          pendingRequests: data.pending_requests || 0,
          approvedRequests: data.approved_requests || 0,
          activeEmployees: data.active_employees || 0,
          requestDistribution: distributionForDonut,
          weeklyPerformance: data.weeklyPerformance || { approved: Array(7).fill(0), pending: Array(7).fill(0) },
          monthlyReport: data.monthlyReport || { processedRequests: Array(12).fill(0), averageTime: '', satisfaction: 0 },
          agentPerformance: data.agent_performance || { bestAgent: 'N/A', requestsPerDay: 0, efficiency: 0 },
          systemInfo: data.system_info || { uptime: 0, activeUsers: 0, storageUsed: 0 },
        });
        console.log('DEBUG: dashboardData.requestDistribution après setDashboardData:', distributionForDonut);
        setError(null);
      } catch (err) {
        console.error('Erreur globale dans fetchDashboardData:', err);
        console.error('Message d\'erreur original:', err.message);
        if (err.stack) {
          console.error('Stack trace:', err.stack);
        }
        setError(err.message || 'Une erreur majeure est survenue lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_URL]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Chargement des données du tableau de bord...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-500">Erreur: {error}</p></div>;
  }

  // Le log suivant est maintenant redondant car les valeurs sont loggées individuellement ci-dessus
  // console.log('DEBUG: Données pour DonutChart (donutChartConfig.datasets[0].data):', [
  //   dashboardData.requestDistribution.find(item => item.label === 'En cours')?.value || 0,
  //   dashboardData.requestDistribution.find(item => item.label === 'Validée')?.value || 0,
  //   dashboardData.requestDistribution.find(item => item.label === 'Rejetée')?.value || 0,
  // ]);
  const enCoursData = dashboardData.requestDistribution.find(item => item.label === 'En attente');
  const valideeData = dashboardData.requestDistribution.find(item => item.label === 'Approuvées');
  const rejeteeData = dashboardData.requestDistribution.find(item => item.label === 'Rejetée');

  console.log('DEBUG Donut - dashboardData.requestDistribution:', JSON.stringify(dashboardData.requestDistribution));
  console.log('DEBUG Donut - enCoursData:', enCoursData, 'Value:', enCoursData?.value);
  console.log('DEBUG Donut - valideeData:', valideeData, 'Value:', valideeData?.value);
  console.log('DEBUG Donut - rejeteeData:', rejeteeData, 'Value:', rejeteeData?.value);

  const donutChartConfig = {
    labels: ['En attente', 'Approuvées', 'Rejetées'], // Assurez-vous que l'ordre correspond à celui des données ci-dessous
    datasets: [
      {
        label: 'Répartition des demandes',
        data: [
          // L'ordre ici doit correspondre à l'ordre des labels ci-dessus
          dashboardData.requestDistribution.find(item => item.label === 'En attente')?.value || 0,
          dashboardData.requestDistribution.find(item => item.label === 'Approuvées')?.value || 0,
          dashboardData.requestDistribution.find(item => item.label === 'Rejetées')?.value || 0,
        ],
        backgroundColor: [
          '#F97316', // Orange (En attente)
          '#22C55E', // Vert (Approuvées)
          '#EF4444', // Rouge (Rejetées)
        ],
        borderColor: [
          '#FFFFFF', // Blanc pour séparer les segments
          '#FFFFFF',
          '#FFFFFF',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']; // Ou récupérez dynamiquement si besoin

  const barChartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Approuvées',
        data: dashboardData.weeklyPerformance?.approved || Array(7).fill(0),
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Vert
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'En attente',
        data: dashboardData.weeklyPerformance?.pending || Array(7).fill(0),
        backgroundColor: 'rgba(249, 115, 22, 0.6)', // Orange
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false, // Titre déjà présent au-dessus du graphique
        text: 'Performance Hebdomadaire',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ou ajustez selon les valeurs attendues
        }
      },
    },
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 25,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed;
            }
            return label;
          }
        }
      }
    },
    cutout: '60%',
  };

  const lineChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Demandes traitées',
        data: dashboardData.monthlyReport && Array.isArray(dashboardData.monthlyReport.processedRequests) && dashboardData.monthlyReport.processedRequests.length === 12 ? dashboardData.monthlyReport.processedRequests : Array(12).fill(0),
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Vert
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false, // Titre déjà présent au-dessus du graphique
        text: 'Performance Mensuelle',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ou ajustez selon les valeurs attendues
        }
      },
    },
  };

  const statsCardsData = [
    { title: 'Total Demandes', value: dashboardData.totalRequests, icon: '📄', color: 'blue', trend: dashboardData.totalRequests > 100 ? 5 : 1 , trendText: '% vs mois dernier' },
    { title: 'Demandes en Attente', value: dashboardData.pendingRequests, icon: '⏳', color: 'orange', trend: dashboardData.pendingRequests > 10 ? -2 : 0, trendText: '% vs semaine dernière' },
    { title: 'Demandes Approuvées', value: dashboardData.approvedRequests, icon: '✅', color: 'green', trend: dashboardData.approvedRequests > 50 ? 10 : 2, trendText: '% vs mois dernier' },
    { title: 'Employés Actifs', value: dashboardData.activeEmployees, icon: '👥', color: 'purple', trend: dashboardData.activeEmployees > 5 ? 1 : 0, trendText: ' nouvel employé' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord Administrateur</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCardsData.map(card => (
          <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} color={card.color} trend={card.trend} trendText={card.trendText} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold flex items-center mb-4"><span className="mr-2">📊</span> Répartition des demandes</h3>
          <DonutChart chartData={donutChartConfig} chartOptions={donutChartOptions} />
        </div>
        <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Performance hebdomadaire</h3>
          <BarChartComponent chartData={barChartData} chartOptions={barChartOptions} />
        </div>
      </div>

      {/* Graphique Linéaire Performance Mensuelle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Performance Mensuelle (Demandes traitées)</h3>
          <LineChartComponent chartData={lineChartData} chartOptions={lineChartOptions} />
        </div>
      </div>

      {/* Cartes d'informations textuelles (Rapport Mensuel, Performance Agent, Infos Système) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Rapport Mensuel</h3>
          <p>Demandes traitées: <span className="font-semibold">{dashboardData.monthlyReport && Array.isArray(dashboardData.monthlyReport.processedRequests) && dashboardData.monthlyReport.processedRequests.length === 12 ? dashboardData.monthlyReport.processedRequests.reduce((a, b) => a + b, 0) : 0}</span></p>
          <p>Temps moyen de traitement: <span className="font-semibold">{dashboardData.monthlyReport.averageTime}</span></p>
          <p>Taux de satisfaction: <span className="font-semibold">{dashboardData.monthlyReport.satisfaction}%</span></p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Performance des Agents</h3>
          <p>Meilleur agent: <span className="font-semibold">{dashboardData.agentPerformance.bestAgent}</span></p>
          <p>Demandes/jour (moy): <span className="font-semibold">{dashboardData.agentPerformance.requestsPerDay}</span></p>
          <p>Efficacité globale: <span className="font-semibold">{dashboardData.agentPerformance.efficiency}%</span></p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Informations Système</h3>
          <p>Disponibilité (Uptime): <span className="font-semibold">{dashboardData.systemInfo.uptime}%</span></p>
          <p>Utilisateurs actifs: <span className="font-semibold">{dashboardData.systemInfo.activeUsers}</span></p>
          <p>Stockage utilisé: <span className="font-semibold">{dashboardData.systemInfo.storageUsed} GB</span></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;