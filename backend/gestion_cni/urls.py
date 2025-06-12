from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    CitoyenViewSet,
    AgentViewSet,
    AdministrateurViewSet,
    ExtraitNaissanceViewSet,
    DemandeViewSet,
    PaiementViewSet,
    get_statistics,
    admin_dashboard,
    InitierPaiementView, 
    UserNotificationsView,
    MarkNotificationAsReadView,
    TelechargerRecuView,
    UserDemandesView,
    DemandeDetailView, # Ajout de DemandeDetailView
    DemandesEnCoursListView,

    # Vues pour l'historique
    HistoriqueCitoyensView,
    HistoriqueAgentsView,
    HistoriquePaiementsView,
    HistoriqueDemandesView,
    ChangePasswordView,
    CheckActiveDemandeView,
    AgentDashboardStatsView
)

router = DefaultRouter()
router.register(r'citoyens', CitoyenViewSet)
router.register(r'agents', AgentViewSet)
router.register(r'administrateurs', AdministrateurViewSet)
router.register(r'extraits', ExtraitNaissanceViewSet)
router.register(r'demandes', DemandeViewSet)
router.register(r'paiements', PaiementViewSet, basename='paiement')

urlpatterns = [
    # Endpoints d'authentification
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Endpoints statistiques
    path('statistics/', get_statistics, name='statistics'),
    
    # Endpoint dashboard administrateur
    path('admin/dashboard/', admin_dashboard, name='admin-dashboard'),

    # Endpoint pour initier un paiement
    path('initier-paiement/', InitierPaiementView.as_view(), name='initier_paiement'),

    # Endpoint pour vérifier si une demande est active pour un utilisateur
    path('check-active-demande/', CheckActiveDemandeView.as_view(), name='check_active_demande'),

    # Endpoint pour les notifications de l'utilisateur
    path('notifications/', UserNotificationsView.as_view(), name='user_notifications'),
    path('notifications/<int:pk>/mark-as-read/', MarkNotificationAsReadView.as_view(), name='notification_mark_as_read'),
    path('notifications/<int:pk>/telecharger-recu/', TelechargerRecuView.as_view(), name='notification_telecharger_recu'),
    path('mes-demandes/', UserDemandesView.as_view(), name='user_demandes_list'),
    path('demandes/<int:pk>/', DemandeDetailView.as_view(), name='demande-detail'),

    # Endpoint pour les agents
    path('agent/demandes-en-cours/', DemandesEnCoursListView.as_view(), name='agent_demandes_en_cours'),
    path('agent/dashboard-stats/', AgentDashboardStatsView.as_view(), name='agent_dashboard_stats'),
    


    # Endpoints pour l'historique de l'administrateur
    path('admin/historique/citoyens/', HistoriqueCitoyensView.as_view(), name='historique_citoyens'),
    path('admin/historique/agents/', HistoriqueAgentsView.as_view(), name='historique_agents'),
    path('admin/historique/paiements/', HistoriquePaiementsView.as_view(), name='historique_paiements'),
    path('admin/historique/demandes/', HistoriqueDemandesView.as_view(), name='historique_demandes'),

    # Endpoints API
    path('', include(router.urls)),
]