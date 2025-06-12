from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsAgent, IsAdmin
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.renderers import JSONRenderer
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.contrib.auth import update_session_auth_hash
import uuid # Pour générer des ID de transaction uniques
from .models import Citoyen, Agent, Administrateur, ExtraitNaissance, Demande, Notification, Paiement
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from django.shortcuts import get_object_or_404
from .models import Demande # Ajout de l'import Demande
from .serializers import (
    CitoyenSerializer, AgentSerializer, AdministrateurSerializer, ExtraitNaissanceSerializer, 
    DemandeSerializer, PaiementSerializer, CustomTokenObtainPairSerializer, NotificationSerializer,
    HistoriqueCitoyenSerializer, HistoriqueAgentSerializer, HistoriquePaiementSerializer, HistoriqueDemandeSerializer,
    ChangePasswordSerializer
)
from django.core.mail import send_mail
from django.conf import settings
import logging
from django.utils import timezone
from datetime import timedelta
from rest_framework.pagination import PageNumberPagination

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
            citoyen = self.request.user.citoyen
            data = self.request.data

            # Liste des champs du modèle Citoyen à mettre à jour depuis les données du formulaire
            # Note: les clés sont en snake_case car le frontend les convertit
            fields_to_update = [
                'nom', 'prenom', 'date_naissance', 'lieu_naissance', 'nin',
                'sexe', 'statut_nationalite', 'profession', 'domicile',
                'situation_matrimoniale', 'taille', 'teint', 'signes_particuliers',
                'couleur_cheveux', 'prenom_pere', 'prenom_mere', 'nom_mere'
            ]

            # Mettre à jour le profil du citoyen
            for field in fields_to_update:
                if field in data and data[field]:
                    setattr(citoyen, field, data[field])
            
            citoyen.save()

            # Créer la demande en l'associant au citoyen mis à jour
            serializer.save(citoyen=citoyen)
        else:
            # Logique existante pour les autres types d'utilisateurs
            serializer.save()

class PaiementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour lister les paiements.
    Filtre les paiements pour ne retourner que ceux appartenant aux demandes
    de l'utilisateur (citoyen) authentifié.
    Les agents et admins peuvent voir tous les paiements (pour l'instant, à affiner si besoin).
    """
    serializer_class = PaiementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'type_utilisateur'): # Vérifier si l'attribut existe
            if user.type_utilisateur == 'citoyen':
                if hasattr(user, 'citoyen'): # Vérifier si le citoyen est lié
                    # Récupère les IDs des demandes du citoyen
                    demande_ids = Demande.objects.filter(citoyen=user.citoyen).values_list('id', flat=True)
                    # Filtre les paiements par ces IDs de demande
                    return Paiement.objects.filter(demande_id__in=demande_ids).order_by('-date_paiement')
                else:
                    logger.warning(f"Utilisateur {user.username} de type citoyen n'a pas de profil Citoyen lié.")
                    return Paiement.objects.none()
            elif user.type_utilisateur in ['agent', 'admin']:
                # Les agents et admins peuvent voir tous les paiements
                # TODO: Affiner les permissions pour les agents si nécessaire (ex: seulement les paiements des demandes qu'ils traitent)
                return Paiement.objects.all().order_by('-date_paiement')
        
        logger.warning(f"Utilisateur {user.username} avec type_utilisateur non géré ou manquant.")
        return Paiement.objects.none() # Par défaut, ne retourne rien si le type n'est pas géré


# Vues spécifiques au portail Agent
# ==================================

class DemandesEnCoursListView(generics.ListAPIView):
    """
    Vue pour que les agents puissent lister toutes les demandes de CNI 
    qui sont actuellement 'en cours' de traitement.
    """
    serializer_class = DemandeSerializer
    permission_classes = [IsAuthenticated, IsAgent]

    def get_queryset(self):
        """
        Cette vue retourne une liste des demandes qui sont assignées à l'agent connecté
        et qui ont le statut 'en_cours'.
        """
        try:
            agent_profile = self.request.user.agent
            return Demande.objects.filter(agent_traitant=agent_profile, statut='en_cours')\
                                .select_related('citoyen__utilisateur')\
                                .order_by('date_soumission')
        except AttributeError:
            # Si l'utilisateur n'a pas de profil agent, ne retourne rien.
            return Demande.objects.none()

class ChangePasswordView(generics.UpdateAPIView):
    """
    Vue pour changer le mot de passe de l'utilisateur authentifié.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Vérifier l'ancien mot de passe
            if not user.check_password(serializer.validated_data.get("old_password")):
                return Response({"old_password": ["Le mot de passe actuel est incorrect."]}, status=status.HTTP_400_BAD_REQUEST)
            
            # Mettre à jour avec le nouveau mot de passe
            user.set_password(serializer.validated_data.get("new_password"))
            user.save()

            # Mettre à jour la session pour que l'utilisateur ne soit pas déconnecté
            update_session_auth_hash(request, user)
            
            return Response({"detail": "Le mot de passe a été changé avec succès."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckActiveDemandeView(APIView):
    """
    Vérifie si l'utilisateur connecté a une demande de CNI active.
    Une demande est considérée comme active si son statut n'est ni 'REJETEE' ni 'TERMINEE'.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        logger.info(f"[CheckActiveDemande] - Vérification pour l'utilisateur: {user.username} (ID: {user.id})")

        try:
            citoyen = user.citoyen
            all_demandes = Demande.objects.filter(citoyen=citoyen)
            all_demandes_details = [f"(ID: {d.id}, Statut: {d.statut})" for d in all_demandes]
            logger.info(f"[CheckActiveDemande] - Toutes les demandes trouvées pour le citoyen {citoyen.id}: {all_demandes_details if all_demandes_details else 'Aucune'}")

            # Statuts qui ne sont PAS considérés comme actifs
            inactive_statuses = ['rejetee', 'validee']
            
            has_active_demande = all_demandes.exclude(
                statut__in=inactive_statuses
            ).exists()
            
            logger.info(f"[CheckActiveDemande] - Le statut 'has_active_demande' est: {has_active_demande}")
            
            return Response({'has_active_demande': has_active_demande})

        except (Citoyen.DoesNotExist, AttributeError):
            # C'est un état critique si un 'citoyen' n'a pas de profil Citoyen.
            if user.type_utilisateur == 'citoyen':
                logger.error(f"[CheckActiveDemande] - ERREUR CRITIQUE: Aucun profil citoyen trouvé pour l'utilisateur {user.username} qui est de type 'citoyen'.")
                # On retourne True par sécurité pour empêcher la création de nouvelles demandes.
                return Response({'has_active_demande': True, 'error': 'Incohérence de données pour ce compte.'})
        
            # Pour les admins/agents, c'est un comportement normal.
            logger.info(f"[CheckActiveDemande] - Aucun profil citoyen trouvé pour l'utilisateur: {user.username} (type: {user.type_utilisateur}). Comportement normal pour un admin/agent.")
            return Response({'has_active_demande': False})
class AgentDashboardStatsView(APIView):
    """
    Fournit les statistiques pour le tableau de bord de l'agent connecté.
    Les statistiques incluent :
    - Demandes en attente (statut 'en_cours')
    - Demandes traitées (statut 'approuvé' ou 'rejeté')
    - Demandes traitées (statut 'approuve' ou 'rejete')
    - Total de citoyens dans le système
    """
    permission_classes = [IsAuthenticated, IsAgent]

    def get(self, request, *args, **kwargs):
        agent_user = request.user
        logger.info(f"Début du traitement des statistiques pour l'agent: {agent_user.username}")

        try:
            # Le champ 'agent_traitant' est une clé étrangère vers le modèle Agent, pas User.
            # Nous récupérons donc le profil Agent lié à l'utilisateur connecté.
            agent_profile = agent_user.agent
            logger.info(f"Profil agent trouvé: {agent_profile.matricule}")

            # Récupérer toutes les demandes assignées à cet agent
            demandes_agent = Demande.objects.filter(agent_traitant=agent_profile)
            
            # Calcul des statistiques
            demandes_non_traitees = demandes_agent.filter(statut='en_cours').count()
            demandes_traitees = demandes_agent.filter(Q(statut='validee') | Q(statut='rejetee')).count()
            
            # Le total de citoyens dans le système (tous les citoyens, pas seulement ceux de l'agent)
            total_citoyens = Citoyen.objects.count()

            stats = {
                'demandesNonTraitees': demandes_non_traitees,
                'demandesTraitees': demandes_traitees,
                'totalCitoyens': total_citoyens
            }
            
            logger.info(f"Statistiques calculées pour {agent_user.username}: {stats}")
            return Response(stats)

        except AttributeError:
            logger.error(f"Profil agent non trouvé pour l'utilisateur: {agent_user.username}")
            return Response({"detail": "Profil agent non trouvé pour cet utilisateur."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Erreur inattendue dans AgentDashboardStatsView pour {agent_user.username}: {e}", exc_info=True)
            return Response({"detail": "Une erreur interne est survenue lors du calcul des statistiques."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
    processed_requests_count = Demande.objects.filter(statut='validee').count()
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


# Frais de la CNI (devrait idéalement provenir d'une configuration)
FRAIS_CNI = 50000  # Montant en GNF


# Vues pour la page Historique de l'administrateur

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size'
    max_page_size = 100

class BaseHistoriqueListView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # Cette méthode est principalement pour la structure.
        # La logique de filtrage spécifique est dans chaque vue fille.
        return super().get_queryset()

class HistoriqueCitoyensView(BaseHistoriqueListView):
    serializer_class = HistoriqueCitoyenSerializer
    queryset = Citoyen.objects.select_related('utilisateur').all() # Queryset de base

    def get_queryset(self):
        queryset = Citoyen.objects.select_related('utilisateur').all() # On repart du queryset de base à chaque appel
        search_term = self.request.query_params.get('search', None)
        date_debut_str = self.request.query_params.get('date_debut', None)
        date_fin_str = self.request.query_params.get('date_fin', None)
        statut_filter = self.request.query_params.get('statut', None)

        if search_term:
            queryset = queryset.filter(
                Q(utilisateur__first_name__icontains=search_term) |
                Q(utilisateur__last_name__icontains=search_term) |
                Q(utilisateur__email__icontains=search_term) |
                Q(nin__icontains=search_term) |
                Q(utilisateur__telephone__icontains=search_term)
            )
        
        if date_debut_str:
            queryset = queryset.filter(utilisateur__date_joined__date__gte=date_debut_str)
        if date_fin_str:
            from datetime import datetime, timedelta
            date_fin_obj = datetime.strptime(date_fin_str, '%Y-%m-%d').date() + timedelta(days=1)
            queryset = queryset.filter(utilisateur__date_joined__date__lt=date_fin_obj)

        if statut_filter and statut_filter.lower() != 'tous':
            is_active_filter = statut_filter.lower() == 'actif'
            queryset = queryset.filter(utilisateur__is_active=is_active_filter)
            
        return queryset.order_by('-utilisateur__date_joined')


class HistoriqueAgentsView(BaseHistoriqueListView):
    serializer_class = HistoriqueAgentSerializer
    queryset = Agent.objects.select_related('utilisateur').all()

    def get_queryset(self):
        queryset = Agent.objects.select_related('utilisateur').all()
        search_term = self.request.query_params.get('search', None)
        date_debut_str = self.request.query_params.get('date_debut', None)
        date_fin_str = self.request.query_params.get('date_fin', None)
        statut_filter = self.request.query_params.get('statut', None)

        if search_term:
            queryset = queryset.filter(
                Q(utilisateur__first_name__icontains=search_term) |
                Q(utilisateur__last_name__icontains=search_term) |
                Q(utilisateur__email__icontains=search_term) |
                Q(matricule__icontains=search_term)
            )

        if date_debut_str:
            queryset = queryset.filter(utilisateur__date_joined__date__gte=date_debut_str)
        if date_fin_str:
            from datetime import datetime, timedelta
            date_fin_obj = datetime.strptime(date_fin_str, '%Y-%m-%d').date() + timedelta(days=1)
            queryset = queryset.filter(utilisateur__date_joined__date__lt=date_fin_obj)

        if statut_filter and statut_filter.lower() != 'tous':
            is_active_filter = statut_filter.lower() == 'actif'
            queryset = queryset.filter(utilisateur__is_active=is_active_filter)
            
        return queryset.order_by('-utilisateur__date_joined')


class HistoriquePaiementsView(BaseHistoriqueListView):
    serializer_class = HistoriquePaiementSerializer
    queryset = Paiement.objects.select_related('demande__citoyen', 'demande').all()

    def get_queryset(self):
        queryset = Paiement.objects.select_related('demande__citoyen', 'demande').all()
        search_term = self.request.query_params.get('search', None)
        date_debut_str = self.request.query_params.get('date_debut', None)
        date_fin_str = self.request.query_params.get('date_fin', None)
        statut_filter = self.request.query_params.get('statut', None)

        if search_term:
            queryset = queryset.filter(
                Q(citoyen__utilisateur__first_name__icontains=search_term) |
                Q(citoyen__utilisateur__last_name__icontains=search_term) |
                Q(citoyen__utilisateur__email__icontains=search_term) |
                Q(transaction_id__icontains=search_term) |
                Q(demande__id__icontains=search_term)
            )
        
        if date_debut_str:
            queryset = queryset.filter(date_paiement__date__gte=date_debut_str)
        if date_fin_str:
            from datetime import datetime, timedelta
            date_fin_obj = datetime.strptime(date_fin_str, '%Y-%m-%d').date() + timedelta(days=1)
            queryset = queryset.filter(date_paiement__date__lt=date_fin_obj)

        if statut_filter and statut_filter.lower() != 'tous':
            statut_mapping = {
                'en attente': 'en_attente',
                'confirmé': 'complet',      # Correction: Le statut de succès est 'complet'
                'echoué': 'echoue',
                'remboursé': 'rembourse',
            }
            backend_statut = statut_mapping.get(statut_filter.lower(), statut_filter.lower())
            queryset = queryset.filter(statut__iexact=backend_statut)
            
        return queryset.order_by('-date_paiement')


class HistoriqueDemandesView(BaseHistoriqueListView):
    serializer_class = HistoriqueDemandeSerializer
    queryset = Demande.objects.select_related('citoyen__utilisateur').all()

    def get_queryset(self):
        queryset = Demande.objects.select_related('citoyen__utilisateur').all()
        search_term = self.request.query_params.get('search', None)
        date_debut_str = self.request.query_params.get('date_debut', None)
        date_fin_str = self.request.query_params.get('date_fin', None)
        statut_filter = self.request.query_params.get('statut', None)

        if search_term:
            queryset = queryset.filter(
                Q(citoyen__utilisateur__first_name__icontains=search_term) |
                Q(citoyen__utilisateur__last_name__icontains=search_term) |
                Q(citoyen__utilisateur__email__icontains=search_term) |
                Q(id__icontains=search_term)
            )

        if date_debut_str:
            queryset = queryset.filter(date_soumission__date__gte=date_debut_str)
        if date_fin_str:
            from datetime import datetime, timedelta
            date_fin_obj = datetime.strptime(date_fin_str, '%Y-%m-%d').date() + timedelta(days=1)
            queryset = queryset.filter(date_soumission__date__lt=date_fin_obj)

        if statut_filter and statut_filter.lower() != 'tous':
            statut_mapping = {
                'en cours de traitement': 'en_cours',
                'validée': 'validee',
                'approuvée': 'validee',  # 'approuvée' est un synonyme pour 'validée'
                'rejetée': 'rejetee',
            }
            backend_statut = statut_mapping.get(statut_filter.lower(), statut_filter.lower())
            queryset = queryset.filter(statut__iexact=backend_statut)
            
        return queryset.order_by('-date_soumission')


class UserNotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            # Tenter de récupérer le profil citoyen associé à l'utilisateur
            citoyen_profile = Citoyen.objects.get(utilisateur=user)
            # Utiliser date_envoi ou date_creation selon le champ pertinent dans votre modèle Notification
            return Notification.objects.filter(citoyen=citoyen_profile).order_by('-date_envoi') 
        except Citoyen.DoesNotExist:
            # Si l'utilisateur n'a pas de profil citoyen, retourner un queryset vide
            logger.info(f"Tentative d'accès aux notifications pour l'utilisateur {user.username} sans profil citoyen.")
            return Notification.objects.none()
        except Exception as e:
            # Log l'erreur pour le débogage et retourner un queryset vide
            logger.error(f"Erreur lors de la récupération des notifications pour {user.username}: {e}")
            return Notification.objects.none()


class MarkNotificationAsReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        user = self.request.user
        try:
            citoyen_profile = Citoyen.objects.get(utilisateur=user)
            return Notification.objects.filter(citoyen=citoyen_profile)
        except Citoyen.DoesNotExist:
            # Si l'utilisateur n'a pas de profil citoyen, retourner un queryset vide
            # pour éviter que d'autres utilisateurs ne modifient les notifications.
            logger.warning(f"Tentative de marquer comme lue une notification pour {user.username} sans profil citoyen.")
            return Notification.objects.none()
        except Exception as e:
            logger.error(f"Erreur lors de la récupération du queryset pour MarkNotificationAsReadView pour {user.username}: {e}")
            return Notification.objects.none()

    # get_object est hérité et utilisera le queryset filtré ci-dessus.
    # Il lèvera une erreur 404 si l'objet n'est pas trouvé ou n'appartient pas à l'utilisateur.

    def perform_update(self, serializer):
        # La logique de mise à jour est simple : marquer la notification comme 'lue'.
        # Le serializer s'occupe de la validation si nécessaire, mais ici c'est direct.
        instance = serializer.instance # Récupère l'objet Notification à mettre à jour
        if instance.statut != 'lue':
            instance.statut = 'lue'
            instance.save(update_fields=['statut'])
        # La réponse par défaut de UpdateAPIView (l'objet sérialisé) est généralement suffisante.


class UserDemandesView(generics.ListAPIView):
    serializer_class = DemandeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            citoyen_profile = Citoyen.objects.get(utilisateur=user)
            # Récupérer les demandes et précharger les documents pour optimiser la méthode get_nombre_documents du serializer
            return Demande.objects.filter(citoyen=citoyen_profile).prefetch_related('documents').order_by('-date_soumission')
        except Citoyen.DoesNotExist:
            # Si aucun profil citoyen n'est associé à l'utilisateur,
            # retourner un queryset vide pour éviter les erreurs.
            return Demande.objects.none()
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des demandes pour {user.username}: {e}")
            return Demande.objects.none()


class DemandeDetailView(generics.RetrieveAPIView):
    queryset = Demande.objects.all()
    serializer_class = DemandeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        # Vérifier si l'utilisateur est le citoyen associé à la demande
        if hasattr(user, 'citoyen') and obj.citoyen == user.citoyen:
            return obj
        # Si l'utilisateur est un agent ou admin, il pourrait aussi y avoir accès
        # (décommenter et adapter si nécessaire pour les rôles admin/agent)
        # elif hasattr(user, 'agent') or hasattr(user, 'administrateur'):
        #     return obj
        else:
            # Si l'utilisateur n'est ni le propriétaire ni un rôle autorisé, refuser l'accès.
            raise permissions.PermissionDenied("Vous n'avez pas la permission de voir cette demande.")


class TelechargerRecuView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        user = request.user
        try:
            # S'assurer que la notification appartient au citoyen connecté
            citoyen_profile = Citoyen.objects.get(utilisateur=user)
            notification = get_object_or_404(Notification, pk=pk, citoyen=citoyen_profile)
            
            demande = notification.demande
            if not demande:
                return Response({"error": "Demande associée non trouvée."}, status=status.HTTP_404_NOT_FOUND)

            # Essayer de récupérer le paiement associé à la demande
            # S'il peut y avoir plusieurs paiements, il faudra affiner cette logique
            paiement = Paiement.objects.filter(demande=demande).order_by('-date_paiement').first()
            if not paiement:
                return Response({"error": "Paiement associé non trouvé."}, status=status.HTTP_404_NOT_FOUND)

            # Création du document PDF
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="recu_paiement_CNID-{demande.id}.pdf"'

            doc = SimpleDocTemplate(response, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
            styles = getSampleStyleSheet()
            story = []

            # Titre
            story.append(Paragraph("REÇU DE PAIEMENT", styles['h1']))
            story.append(Spacer(1, 0.25*inch))

            # Informations
            nom_complet_citoyen = f"{citoyen_profile.utilisateur.first_name or ''} {citoyen_profile.utilisateur.last_name or ''}".strip()
            montant_formate = f"{int(paiement.montant)} GNF"
            reference_demande_formatee = f"CNID-{demande.id}"
            date_paiement_formatee = paiement.date_paiement.strftime('%d-%m-%Y %H:%M')

            details = [
                f"<b>Nom du Citoyen:</b> {nom_complet_citoyen}",
                f"<b>Référence de la Demande:</b> {reference_demande_formatee}",
                f"<b>Montant Payé:</b> {montant_formate}",
                f"<b>Date de Paiement:</b> {date_paiement_formatee}",
            ]

            for detail in details:
                story.append(Paragraph(detail, styles['Normal']))
                story.append(Spacer(1, 0.1*inch))
            
            story.append(Spacer(1, 0.25*inch))
            story.append(Paragraph("Merci d'avoir utilisé notre plateforme.", styles['Normal']))
            story.append(Paragraph("— Direction Générale de la CNID", styles['Normal']))

            doc.build(story)
            return response

        except Citoyen.DoesNotExist:
            return Response({"error": "Profil citoyen non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        except Notification.DoesNotExist:
            return Response({"error": "Notification non trouvée ou non autorisée."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Erreur lors de la génération du reçu PDF pour la notification {pk}: {e}")
            return Response({"error": "Erreur lors de la génération du reçu."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Vue pour lister les demandes du citoyen connecté
# Déplacée ici pour être avant InitierPaiementView, mais l'ordre global des classes n'est pas critique
# tant que les imports sont corrects.

class InitierPaiementView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        demande_id = request.data.get('demande_id')
        methode_paiement = request.data.get('methode')
        numero_telephone = request.data.get('numero_telephone_paiement')

        if not all([demande_id, methode_paiement, numero_telephone]):
            return Response(
                {'error': 'Les champs demande_id, methode et numero_telephone_paiement sont requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            demande = get_object_or_404(Demande, id=demande_id)
        except Demande.DoesNotExist:
            return Response(
                {'error': f'Demande avec ID {demande_id} non trouvée.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Vérifier que l'utilisateur qui fait la requête est bien le citoyen associé à la demande
        if request.user != demande.citoyen.utilisateur:
            return Response(
                {'error': 'Vous n\'êtes pas autorisé à initier un paiement pour cette demande.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Vérifier si un paiement en attente ou complet existe déjà pour cette demande
        existing_paiement = Paiement.objects.filter(
            demande=demande,
            statut__in=['en_attente', 'complete']
        ).first()

        if existing_paiement:
            return Response(
                {'error': 'Un paiement est déjà en cours ou a été complété pour cette demande.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Préparer les données pour le PaiementSerializer
        paiement_data = {
            'demande': demande.id,
            'methode': methode_paiement,
            'numero_telephone_paiement': numero_telephone,
            'montant': FRAIS_CNI # Montant défini par le serveur
        }
        
        serializer = PaiementSerializer(data=paiement_data)
        if serializer.is_valid():
            # Le serializer.save() va appeler PaiementSerializer.create()
            # Le montant est maintenant dans validated_data grâce à paiement_data
            paiement = serializer.save(demande=demande)
            
            # Simuler une réponse de l'opérateur de paiement
            # Dans un vrai scénario, vous appelleriez une API externe ici
            # Ces champs sont typiquement mis à jour via un callback de la passerelle de paiement
            paiement.transaction_id = f"TRANS-{uuid.uuid4().hex[:10].upper()}"
            paiement.statut = 'en_attente' # Le statut initial après initiation
            paiement.save(update_fields=['transaction_id', 'statut']) # Sauvegarder uniquement les champs modifiés

            # --- Début de la mise à jour pour notification et email ---
            utilisateur_concerne = demande.citoyen.utilisateur
            nom_complet_citoyen = f"{utilisateur_concerne.first_name or ''} {utilisateur_concerne.last_name or ''}".strip()
            if not nom_complet_citoyen:
                nom_complet_citoyen = utilisateur_concerne.username
            
            montant_formate = f"{int(paiement.montant)} GNF" # Assure un formatage simple
            reference_demande_formatee = f"CNID-{demande.id}"
            date_paiement_formatee = paiement.date_paiement.strftime('%d-%m-%Y %H:%M')

            # 2. Envoyer l'e-mail de confirmation et créer la notification interne
            sujet_email = f"Confirmation de réception de paiement - Demande {reference_demande_formatee}"
            # Le message_email sera utilisé à la fois pour l'email et pour le contenu de la notification interne
            message_email_et_notification = f"""Bonjour {nom_complet_citoyen},

Nous vous confirmons la réception de votre paiement de {montant_formate} relatif à votre demande de carte nationale d'identité.

Votre demande est en cours de traitement. Vous recevrez une notification dès qu’un rendez-vous pour la prise d’empreintes sera disponible.

Référence de la demande : {reference_demande_formatee}
Date de paiement : {date_paiement_formatee}

Merci d'avoir utilisé notre plateforme.

— Direction Générale de la CNID
"""

            # 1. Créer la notification interne avec le contenu complet
            try:
                Notification.objects.create(
                    citoyen=demande.citoyen,
                    demande=demande,
                    contenu=message_email_et_notification, # Contenu complet pour le modal
                    statut='en_attente' 
                )
            except Exception as e:
                logger.error(f"Erreur lors de la création de la notification pour la demande {demande.id}: {e}")

            # Préparer le message pour l'email (identique ici, mais pourrait différer si besoin)
            message_email = message_email_et_notification
            if utilisateur_concerne.email:
                try:
                    send_mail(
                        sujet_email,
                        message_email,
                        settings.DEFAULT_FROM_EMAIL,
                        [utilisateur_concerne.email],
                        fail_silently=False,
                    )
                except Exception as e:
                    logger.error(f"Erreur lors de l'envoi de l'email de confirmation de paiement pour {utilisateur_concerne.email}: {e}")
                    Notification.objects.create(
                        citoyen=demande.citoyen,
                        demande=demande,
                        contenu=f"Échec de l'envoi de l'email de confirmation de paiement pour la demande ID {demande.id}. Veuillez vérifier votre adresse email ou contacter le support.",
                        statut='echoue'
                    )
            else:
                logger.warning(f"L'utilisateur {utilisateur_concerne.username} (demande {demande.id}) n'a pas d'adresse e-mail configurée pour la confirmation de paiement.")
                Notification.objects.create(
                    citoyen=demande.citoyen,
                    demande=demande,
                    contenu=f"Impossible d'envoyer l'email de confirmation de paiement pour la demande ID {demande.id}: adresse email non fournie.",
                    statut='echoue'
                )
            # --- Fin de l'ajout pour notification et email ---

            return Response(
                PaiementSerializer(paiement).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    pending_requests = Demande.objects.filter(statut='en_cours').count()
    approved_requests = Demande.objects.filter(statut='validee').count()
    rejected_requests = Demande.objects.filter(statut='rejetee').count()
    active_employees = Agent.objects.count() + Administrateur.objects.count()
    
    # Calculer la performance hebdomadaire réelle
    today = timezone.now().date()
    # weekday(): Lundi=0, Mardi=1, ..., Dimanche=6
    start_of_week = today - timedelta(days=today.weekday())
    
    weekly_approved_counts = [0] * 7
    weekly_pending_counts = [0] * 7
    
    for i in range(7):
        current_day = start_of_week + timedelta(days=i)
        
        approved_count_for_day = Demande.objects.filter(
            date_soumission__date=current_day,
            statut='validee'
        ).count()
        weekly_approved_counts[i] = approved_count_for_day
        
        pending_count_for_day = Demande.objects.filter(
            date_soumission__date=current_day,
            statut='en_cours'
        ).count()
        weekly_pending_counts[i] = pending_count_for_day
        
    weekly_approved = weekly_approved_counts
    weekly_pending = weekly_pending_counts
    
    # Calcul du rapport mensuel pour les demandes traitées de l'année en cours
    current_year = timezone.now().year
    monthly_processed_counts = [0] * 12 # Index 0 pour Janvier, ..., 11 pour Décembre

    for month_idx in range(12):
        month = month_idx + 1 # Mois de 1 à 12
        # Assurez-vous que le champ date_traitement existe et est pertinent
        # Si date_traitement peut être None, il faut le gérer ou s'assurer qu'il est bien setté lors du traitement
        count = Demande.objects.filter(
            date_traitement__year=current_year,
            date_traitement__month=month,
            statut__in=['validee', 'rejetee']
        ).count()
        monthly_processed_counts[month_idx] = count

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
            'processedRequests': monthly_processed_counts,
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