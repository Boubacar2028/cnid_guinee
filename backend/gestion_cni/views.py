from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.renderers import JSONRenderer
from django.shortcuts import get_object_or_404
from django.db.models import Count
from .models import Citoyen, Agent, Administrateur, ExtraitNaissance, Demande
from .serializers import (
    CitoyenSerializer, AgentSerializer, AdministrateurSerializer,
    ExtraitNaissanceSerializer, DemandeSerializer, CustomTokenObtainPairSerializer
)
from .utils import envoyer_email_bienvenue
import logging

logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    renderer_classes = [JSONRenderer]
    
    def post(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        
        # Logs pour débogage
        logger.info(f"Tentative d'authentification - Données reçues: {request.data}")
        
        # Vérifier si l'utilisateur existe
        username = request.data.get('username')
        if username:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            try:
                user = User.objects.get(username=username)
                logger.info(f"Utilisateur trouvé avec username={username}, is_active={user.is_active}")
            except User.DoesNotExist:
                logger.info(f"Aucun utilisateur avec username={username}")
                
                # Essayer avec email
                try:
                    user = User.objects.get(email=username)
                    logger.info(f"Utilisateur trouvé avec email={username}, is_active={user.is_active}")
                except User.DoesNotExist:
                    logger.info(f"Aucun utilisateur avec email={username}")
        
        # Continuer avec le traitement normal
        return super().post(request, *args, **kwargs)

class CitoyenViewSet(viewsets.ModelViewSet):
    queryset = Citoyen.objects.all()
    serializer_class = CitoyenSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            # Pour la création (inscription), on n'exige pas d'authentification
            permission_classes = [permissions.AllowAny]
        else:
            # Pour les autres actions, l'authentification est requise
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.user.type_utilisateur in ['admin', 'agent']:
            return Citoyen.objects.all()
        return Citoyen.objects.filter(utilisateur=self.request.user)
        
    def perform_create(self, serializer):
        # Enregistrer le citoyen
        citoyen = serializer.save()
        
        # Envoyer l'email de bienvenue
        try:
            logger.info(f"Envoi d'email de bienvenue à {citoyen.utilisateur.email}")
            envoyer_email_bienvenue(citoyen.utilisateur)
            logger.info("Email de bienvenue envoyé avec succès")
        except Exception as e:
            logger.error(f"Erreur lors de l'envoi de l'email de bienvenue: {e}")
            # On ne lève pas d'exception pour ne pas bloquer la création du compte
            # même si l'envoi d'email échoue
        
        return citoyen

class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.type_utilisateur == 'admin':
            return Agent.objects.all()
        return Agent.objects.filter(utilisateur=self.request.user)

class AdministrateurViewSet(viewsets.ModelViewSet):
    queryset = Administrateur.objects.all()
    serializer_class = AdministrateurSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.type_utilisateur == 'admin':
            return Administrateur.objects.all()
        return Administrateur.objects.none()

class ExtraitNaissanceViewSet(viewsets.ModelViewSet):
    queryset = ExtraitNaissance.objects.all()
    serializer_class = ExtraitNaissanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.type_utilisateur in ['admin', 'agent']:
            return ExtraitNaissance.objects.all()
        return ExtraitNaissance.objects.filter(citoyen__utilisateur=self.request.user)

class DemandeViewSet(viewsets.ModelViewSet):
    queryset = Demande.objects.all()
    serializer_class = DemandeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.type_utilisateur == 'admin':
            return Demande.objects.all()
        elif user.type_utilisateur == 'agent':
            return Demande.objects.filter(agent_traitant=user)
        else:
            return Demande.objects.filter(citoyen__utilisateur=user)

    def perform_create(self, serializer):
        if self.request.user.type_utilisateur == 'citoyen':
            serializer.save(citoyen=self.request.user.citoyen)
        else:
            serializer.save()

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_statistics(request):
    """
    Retourne les statistiques générales du système:
    - Nombre de demandes traitées
    - Nombre d'agents actifs
    - Nombre de citoyens enregistrés
    - Taux de satisfaction
    """
    import logging
    logger = logging.getLogger(__name__)
    
    # Récupérer le nombre de citoyens enregistrés
    citizens_count = Citoyen.objects.count()
    logger.info(f"Nombre de citoyens: {citizens_count}")
    
    # Liste les citoyens pour le débogage
    citizens = Citoyen.objects.all()
    for citizen in citizens:
        logger.info(f"Citoyen trouvé: {citizen.nin} - {citizen.utilisateur.username if hasattr(citizen, 'utilisateur') else 'Sans utilisateur'}")
    
    # Utiliser le nombre réel de citoyens
    logger.info(f"Nombre réel de citoyens: {citizens_count}")
    
    # Récupérer le nombre d'agents actifs
    agents_count = Agent.objects.count()
    logger.info(f"Nombre d'agents: {agents_count}")
    
    # Récupérer le nombre de demandes traitées (statut "approuvé")
    processed_requests_count = Demande.objects.filter(statut='approuve').count()
    logger.info(f"Nombre de demandes traitées: {processed_requests_count}")
    
    # Taux de satisfaction (fixé à 98% pour l'instant)
    satisfaction_rate = 98
    
    # Construire et retourner la réponse
    response_data = {
        'processedRequests': processed_requests_count,
        'activeAgents': agents_count,
        'registeredCitizens': citizens_count,
        'satisfactionRate': satisfaction_rate
    }
    
    logger.info(f"Réponse API statistiques: {response_data}")
    return Response(response_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_dashboard(request):
    """
    Retourne les données du tableau de bord administrateur:
    - Nombre total de demandes
    - Nombre de demandes en attente
    - Nombre de demandes approuvées
    - Nombre d'employés actifs
    - Répartition des demandes
    - Performance hebdomadaire
    - Rapport mensuel
    """
    import logging
    logger = logging.getLogger(__name__)
    
    # Vérifier que l'utilisateur est un administrateur
    if request.user.type_utilisateur != 'admin':
        return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
    
    # Calculer les statistiques
    total_requests = Demande.objects.count()
    pending_requests = Demande.objects.filter(statut='en_attente').count()
    approved_requests = Demande.objects.filter(statut='approuve').count()
    rejected_requests = Demande.objects.filter(statut='rejete').count()
    active_employees = Agent.objects.count() + Administrateur.objects.count()
    
    # Générer des données fictives pour la performance hebdomadaire (à remplacer par de vraies données)
    # Format: lundi à dimanche
    weekly_approved = [5, 7, 4, 8, 10, 3, 2]
    weekly_pending = [3, 2, 6, 4, 2, 1, 0]
    
    # Réponse du tableau de bord
    dashboard_data = {
        'totalRequests': total_requests,
        'pendingRequests': pending_requests,
        'approvedRequests': approved_requests,
        'activeEmployees': active_employees,
        'requestDistribution': [
            {'label': 'Approuvées', 'value': approved_requests, 'color': 'bg-green-500'},
            {'label': 'En attente', 'value': pending_requests, 'color': 'bg-orange-400'},
            {'label': 'Rejetées', 'value': rejected_requests, 'color': 'bg-red-500'}
        ],
        'weeklyPerformance': {
            'approved': weekly_approved,
            'pending': weekly_pending
        },
        'monthlyReport': {
            'processedRequests': approved_requests + rejected_requests,
            'averageTime': '3 jours',  # Valeur fixe pour l'instant
            'satisfaction': 95  # Valeur fixe pour l'instant
        },
        'agentPerformance': {
            'bestPerformingAgent': 'Mamadou Diallo',  # Valeur fixe pour l'exemple
            'averageRequestsPerDay': 7,  # Valeur fixe pour l'exemple
            'agentEfficiency': 92  # Valeur fixe pour l'exemple
        },
        'systemInfo': {
            'systemUptime': 99.8,
            'activeUsers': 12,  # Valeur fixe pour l'exemple
            'storageUsedPercentage': 45  # Valeur fixe pour l'exemple
        }
    }
    
    logger.info(f"Réponse API dashboard admin: {dashboard_data}")
    return Response(dashboard_data)