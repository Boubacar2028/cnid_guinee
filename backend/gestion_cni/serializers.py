from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Citoyen, Agent, Administrateur, ExtraitNaissance, Demande
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

Utilisateur = get_user_model()

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'type_utilisateur', 'telephone', 'password']
        read_only_fields = ['type_utilisateur']

class CitoyenSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer()

    class Meta:
        model = Citoyen
        fields = '__all__'
        # Rendre tous les champs optionnels dans le serializer
        extra_kwargs = {
            'nin': {'required': False},
            'date_naissance': {'required': False},
            'lieu_naissance': {'required': False},
            'sexe': {'required': False},
            'nationalite': {'required': False},
            'adresse': {'required': False},
            'profession': {'required': False},
            'situation_matrimoniale': {'required': False},
            'pere_nom': {'required': False},
            'mere_nom': {'required': False},
            'photo': {'required': False}
        }

    def create(self, validated_data):
        # Extraire les données de l'utilisateur
        utilisateur_data = validated_data.pop('utilisateur') if 'utilisateur' in validated_data else {}
        
        # Forcer le type utilisateur à 'citoyen'
        utilisateur_data['type_utilisateur'] = 'citoyen'
        
        # Log pour débogage
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Création d'un utilisateur citoyen avec les données: {utilisateur_data}")
        
        try:
            # S'assurer que l'utilisateur est actif
            utilisateur_data['is_active'] = True
            
            # Récupérer le mot de passe pour le hasher correctement
            password = utilisateur_data.pop('password', None)
            
            # Créer l'utilisateur sans le mot de passe
            utilisateur = Utilisateur(**utilisateur_data)
            
            # Définir le mot de passe en utilisant explicitement set_password
            if password:
                utilisateur.set_password(password)
            
            # Sauvegarder l'utilisateur
            utilisateur.save()
            
            # Créer un profil citoyen vide avec des valeurs par défaut
            # Générer un NIN temporaire unique basé sur l'horodatage
            import time
            temp_nin = f"TEMP-{int(time.time())}-{utilisateur.id}"
            
            citoyen = Citoyen.objects.create(
                utilisateur=utilisateur,
                nin=temp_nin,  # NIN temporaire unique
                sexe='M',     # Valeur par défaut
                nationalite="Guinéenne",  # Valeur par défaut
                situation_matrimoniale="celibataire"  # Valeur par défaut
            )
            
            logger.info(f"Citoyen créé avec succès: {citoyen.nin}")
            return citoyen
            
        except Exception as e:
            logger.error(f"Erreur lors de la création du citoyen: {str(e)}")
            # Si l'utilisateur a été créé mais pas le citoyen, supprimer l'utilisateur
            if 'utilisateur' in locals():
                utilisateur.delete()
            raise  # Relancer l'exception pour que l'API retourne l'erreur

class AgentSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer()

    class Meta:
        model = Agent
        fields = '__all__'

    def create(self, validated_data):
        utilisateur_data = validated_data.pop('utilisateur')
        utilisateur_data['type_utilisateur'] = 'agent'
        utilisateur_data['is_active'] = True
        
        # Récupérer le mot de passe pour le hasher correctement
        password = utilisateur_data.pop('password', None)
        
        # Créer l'utilisateur sans le mot de passe
        utilisateur = Utilisateur(**utilisateur_data)
        
        # Définir le mot de passe en utilisant explicitement set_password
        if password:
            utilisateur.set_password(password)
        
        # Sauvegarder l'utilisateur
        utilisateur.save()
        
        agent = Agent.objects.create(utilisateur=utilisateur, **validated_data)
        return agent

class AdministrateurSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer()

    class Meta:
        model = Administrateur
        fields = '__all__'

    def create(self, validated_data):
        utilisateur_data = validated_data.pop('utilisateur')
        utilisateur_data['type_utilisateur'] = 'admin'
        utilisateur_data['is_active'] = True
        
        # Récupérer le mot de passe pour le hasher correctement
        password = utilisateur_data.pop('password', None)
        
        # Créer l'utilisateur sans le mot de passe
        utilisateur = Utilisateur(**utilisateur_data)
        
        # Définir le mot de passe en utilisant explicitement set_password
        if password:
            utilisateur.set_password(password)
        
        # Sauvegarder l'utilisateur
        utilisateur.save()
        
        administrateur = Administrateur.objects.create(utilisateur=utilisateur, **validated_data)
        return administrateur

class ExtraitNaissanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraitNaissance
        fields = '__all__'

class DemandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Demande
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['type_utilisateur'] = user.type_utilisateur  # Dans le token
        return token

    def validate(self, attrs):
        # Assurons-nous que le username soit bien l'email
        import logging
        logger = logging.getLogger(__name__)
        
        username = attrs.get('username', '')
        logger.info(f"Tentative d'authentification avec: {username}")
        
        # Nous laissons le backend d'authentification EmailBackend faire son travail
        # Ce backend est configuré dans settings.py et recherche l'utilisateur par email
        try:
            data = super().validate(attrs)
            
            # Ajouter des informations utiles dans la réponse
            data['username'] = self.user.username
            data['email'] = self.user.email
            data['type_utilisateur'] = self.user.type_utilisateur
            data['user_id'] = self.user.id
            
            logger.info(f"Authentification réussie pour: {self.user.email} (Type: {self.user.type_utilisateur})")
            return data
        except Exception as e:
            logger.error(f"Erreur d'authentification: {str(e)}")
            raise