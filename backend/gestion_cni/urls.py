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
    get_statistics,
    admin_dashboard,
    InitierPaiementView, 
    UserNotificationsView,
    MarkNotificationAsReadView,
    TelechargerRecuView,
    UserDemandesView,
    DemandeDetailView # Ajout de DemandeDetailView
)

router = DefaultRouter()
router.register(r'citoyens', CitoyenViewSet)
router.register(r'agents', AgentViewSet)
router.register(r'administrateurs', AdministrateurViewSet)
router.register(r'extraits', ExtraitNaissanceViewSet)
router.register(r'demandes', DemandeViewSet)

urlpatterns = [
    # Endpoints d'authentification
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Endpoints statistiques
    path('statistics/', get_statistics, name='statistics'),
    
    # Endpoint dashboard administrateur
    path('admin/dashboard/', admin_dashboard, name='admin-dashboard'),

    # Endpoint pour initier un paiement
    path('initier-paiement/', InitierPaiementView.as_view(), name='initier_paiement'),

    # Endpoint pour les notifications de l'utilisateur
    path('notifications/', UserNotificationsView.as_view(), name='user_notifications'),
    path('notifications/<int:pk>/mark-as-read/', MarkNotificationAsReadView.as_view(), name='notification_mark_as_read'),
    path('notifications/<int:pk>/telecharger-recu/', TelechargerRecuView.as_view(), name='notification_telecharger_recu'),
    path('mes-demandes/', UserDemandesView.as_view(), name='user_demandes_list'),
    path('demandes/<int:pk>/', DemandeDetailView.as_view(), name='demande-detail'),
    
    # Endpoints API
    path('', include(router.urls)),
]