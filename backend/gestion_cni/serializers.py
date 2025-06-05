from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Citoyen, Agent, Administrateur, ExtraitNaissance, Demande, Paiement, Notification, Document # Ajout de Document
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


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'nom_fichier', 'type_document', 'fichier', 'date_upload']
        read_only_fields = ['id', 'date_upload']

class DemandeSerializer(serializers.ModelSerializer):
    citoyen = CitoyenSerializer(read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    libelle_type_demande = serializers.CharField(source='get_type_demande_display', read_only=True)
    libelle_statut = serializers.CharField(source='get_statut_display', read_only=True)
    date_soumission_formatee = serializers.DateTimeField(source='date_soumission', format="%d/%m/%Y", read_only=True)
    date_mise_a_jour = serializers.SerializerMethodField() # Pour "Mis à jour il y a..."
    nombre_documents = serializers.SerializerMethodField()

    class Meta:
        model = Demande
        fields = [
            'id',
            'citoyen', # Remplacer nom_demandeur par l'objet citoyen complet
            'type_demande', # Valeur brute ex: "premiere_demande"
            'libelle_type_demande', # ex: "Première demande"
            'statut', # Valeur brute ex: "en_cours"
            'libelle_statut', # ex: "En cours de traitement"
            'date_soumission', # Date brute pour calculs et tri
            'date_soumission_formatee', # ex: "15/11/2023"
            'date_traitement', # Date brute de la dernière action de traitement
            'date_mise_a_jour', # Sera date_traitement ou date_soumission pour affichage "Mis à jour il y a..."
            'motif_rejet',
            # Champs spécifiques au formulaire de demande CNI (à adapter selon votre modèle Demande)
            'nom_sur_cni',
            'prenom_sur_cni',
            'date_naissance_sur_cni',
            'lieu_naissance_sur_cni',
            'sexe_sur_cni',
            'taille_sur_cni',
            'profession_sur_cni',
            'adresse_residence_sur_cni',
            'nom_pere_sur_cni',
            'nom_mere_sur_cni',
            'numero_extrait_naissance',
            'photo_fournie', # URL du fichier image
            'signature_fournie', # URL du fichier image
            'nombre_documents', # Nombre de documents (méthode)
            'documents', # Liste des documents sérialisés
            # 'agent_traitant' # Pourrait être l'ID ou un serializer léger de l'agent
        ]
        # Ces champs sont soit calculés, soit définis par le système pour l'affichage des demandes.
        read_only_fields = (
            'id', 'citoyen', 'libelle_type_demande', 'libelle_statut',
            'date_soumission_formatee', 'date_mise_a_jour', 'nombre_documents',
            'date_soumission', 'statut', 'date_traitement', 'motif_rejet',
            'documents', 'photo_fournie', 'signature_fournie'
            # Les champs CNI sont aussi read_only une fois la demande soumise
            # et modifiables uniquement par des agents via des actions spécifiques.
            # Pour la vue citoyen, ils sont toujours read-only.
        )



    def get_nombre_documents(self, obj):
        # Assure que la relation 'documents' existe sur le modèle Demande
        return obj.documents.count()

    def get_date_mise_a_jour(self, obj):
        # La "dernière mise à jour" pertinente pour l'affichage est souvent la date de traitement.
        # Si non traitée, la date de soumission est la plus récente.
        # Le modèle Demande a date_soumission (auto_now_add) et date_traitement (DateTimeField)
        return obj.date_traitement if obj.date_traitement else obj.date_soumission

class PaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = ['id', 'demande', 'montant', 'date_paiement', 'methode', 'transaction_id', 'statut', 'numero_telephone_paiement']
        read_only_fields = ['id', 'date_paiement', 'transaction_id', 'statut']

    def create(self, validated_data):
        # Le montant pourrait être défini ici en fonction de la demande ou d'une configuration
        # Par exemple, récupérer FRAIS_CNI depuis les constantes ou un modèle Configuration
        # Pour l'instant, on pourrait le laisser être envoyé ou le fixer.
        # Ici, on suppose qu'il sera défini dans la vue ou envoyé.
        # Si le montant est fixe, on peut le définir ici:
        # from .models import Configuration # ou depuis un fichier de constantes
        # validated_data['montant'] = Configuration.get_config('FRAIS_CNI', 50000) 
        return Paiement.objects.create(**validated_data)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Ajouter les informations utilisateur supplémentaires au token
        token['type_utilisateur'] = user.type_utilisateur
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        # user_id est déjà inclus par défaut par simplejwt, donc pas besoin de l'ajouter explicitement ici si c'est le cas.
        # Si user_id n'est pas dans le token par défaut, vous pouvez l'ajouter : token['user_id'] = user.id
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


class NotificationSerializer(serializers.ModelSerializer):
    # Si vous voulez afficher l'ID de la demande plutôt que l'objet Demande entier
    demande_id = serializers.PrimaryKeyRelatedField(source='demande.id', read_only=True, allow_null=True)
    # Si vous voulez un champ plus lisible pour la date
    date_envoi_formatee = serializers.DateTimeField(source='date_envoi', format="%d-%m-%Y %H:%M", read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)


    class Meta:
        model = Notification
        fields = [
            'id', 
            'contenu', 
            'date_envoi', # Date brute si besoin
            'date_envoi_formatee', # Date formatée pour affichage
            'statut', # Statut brut
            'statut_display', # Statut lisible
            'demande_id', # ID de la demande associée
            # 'citoyen_id' # Peut être utile si vous ne filtrez pas déjà par citoyen
        ]
        read_only_fields = fields # Toutes les notifications sont en lecture seule via API pour le citoyen