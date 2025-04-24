from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    CitoyenViewSet,
    AgentViewSet,
    AdministrateurViewSet,
    ExtraitNaissanceViewSet,
    DemandeViewSet
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
    
    # Endpoints API
    path('', include(router.urls)),
]