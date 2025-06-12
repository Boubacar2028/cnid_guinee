from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from .models import Citoyen, Agent, Administrateur, ExtraitNaissance, Demande, Paiement, Notification, Document # Ajout de Document
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

Utilisateur = get_user_model()

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'type_utilisateur', 'telephone', 'password', 'date_joined', 'last_login', 'is_active')
        read_only_fields = ('type_utilisateur', 'date_joined', 'last_login')
        extra_kwargs = {
            'password': {'write_only': True}
        }

class CitoyenSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer()
    id = serializers.IntegerField(source='pk', read_only=True)

    class Meta:
        model = Citoyen
        fields = [
            'id', 'utilisateur', 'nin', 'date_naissance', 'lieu_naissance',
            'sexe', 'nationalite', 'adresse', 'profession', 'situation_matrimoniale',
            'pere_prenom', 'pere_nom', 'mere_prenom', 'mere_nom', 'photo',
            'taille', 'teint', 'signe_particulier'
        ]
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
            'pere_prenom': {'required': False},
            'pere_nom': {'required': False},
            'mere_prenom': {'required': False},
            'mere_nom': {'required': False},
            'photo': {'required': False},
            'taille': {'required': False},
            'teint': {'required': False},
            'signe_particulier': {'required': False}
        }

    def create(self, validated_data):
        import logging
        logger = logging.getLogger(__name__)

        utilisateur_data = validated_data.pop('utilisateur')
        utilisateur_data['type_utilisateur'] = 'citoyen'

        try:
            # Utilisation de la méthode create_user qui gère le hachage du mot de passe
            utilisateur = Utilisateur.objects.create_user(**utilisateur_data)
            
            # Créer le profil citoyen associé
            citoyen = Citoyen.objects.create(utilisateur=utilisateur, **validated_data)
            
            logger.info(f"Utilisateur et Citoyen créés avec succès pour {utilisateur.username}")
            return citoyen

        except Exception as e:
            logger.error(f"Erreur critique lors de la création du citoyen/utilisateur : {str(e)}")
            # Si l'utilisateur a été créé, mais pas le citoyen, il faut le supprimer pour éviter les comptes orphelins.
            if 'utilisateur' in locals() and Utilisateur.objects.filter(pk=utilisateur.pk).exists():
                utilisateur.delete()
            raise serializers.ValidationError(f"Impossible de créer le compte : {e}")

class AgentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk', read_only=True)
    utilisateur = UtilisateurSerializer()
    demandes_traitees_count = serializers.SerializerMethodField()

    class Meta:
        model = Agent
        fields = ('id', 'utilisateur', 'matricule', 'demandes_traitees_count')

    def get_demandes_traitees_count(self, obj):
        # Cette méthode suppose que le modèle Demande a un champ 'agent_traitant'
        # avec un related_name 'demandes_traitees'.
        if hasattr(obj, 'demandes_traitees'):
            return obj.demandes_traitees.count()
        return 0

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

    def update(self, instance, validated_data):
        utilisateur_data = validated_data.pop('utilisateur', {})
        utilisateur = instance.utilisateur

        # Mettre à jour les champs de l'utilisateur.
        utilisateur.first_name = utilisateur_data.get('first_name', utilisateur.first_name)
        utilisateur.last_name = utilisateur_data.get('last_name', utilisateur.last_name)
        utilisateur.email = utilisateur_data.get('email', utilisateur.email)
        utilisateur.username = utilisateur_data.get('email', utilisateur.username) # Assurer la cohérence du username
        utilisateur.save()

        # Les champs de l'agent (comme le matricule) ne sont pas modifiables ici.
        instance.save()

        return instance

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
            'citoyen',
            'type_demande',
            'libelle_type_demande',
            'statut',
            'libelle_statut',
            'date_soumission',
            'date_soumission_formatee',
            'date_traitement',
            'date_mise_a_jour',
            'motif_rejet',
            'photo_fournie',
            'signature_fournie',
            'nombre_documents',
            'documents',
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
    libelle_methode = serializers.CharField(source='get_methode_display', read_only=True)
    libelle_statut = serializers.CharField(source='get_statut_display', read_only=True)
    date_paiement_formatee = serializers.DateTimeField(source='date_paiement', format="%d/%m/%Y %H:%M", read_only=True)
    # Pour afficher des infos sur la demande liée, comme son type
    type_demande_associee = serializers.CharField(source='demande.get_type_demande_display', read_only=True, allow_null=True)
    demande_id = serializers.PrimaryKeyRelatedField(source='demande.id', read_only=True)
    class Meta:
        model = Paiement
        fields = [
            'id', 
            'demande_id', # ID de la demande
            'type_demande_associee', # Libellé du type de la demande associée
            'montant', 
            'date_paiement', # Date brute si besoin pour tri/calcul
            'date_paiement_formatee', # Date formatée pour affichage
            'methode', # Valeur brute
            'libelle_methode', # Libellé de la méthode
            'transaction_id', 
            'statut', # Valeur brute
            'libelle_statut', # Libellé du statut
            'numero_telephone_paiement'
        ]
        read_only_fields = [
            'id', 'demande_id', 'type_demande_associee', 'date_paiement', 'date_paiement_formatee', 
            'libelle_methode', 'transaction_id', 'statut', 'libelle_statut'
        ]

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
        return token

    def validate(self, attrs):
        import logging
        logger = logging.getLogger(__name__)

        # La méthode `validate` de la classe parente gère l'authentification
        data = super().validate(attrs)
        
        # Ajouter les jetons de rafraîchissement et d'accès à la réponse
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        
        # Ajouter le type d'utilisateur à la réponse principale
        data['type_utilisateur'] = self.user.type_utilisateur

        # Ajouter les données spécifiques au profil de l'utilisateur
        user_data = {}
        if self.user.type_utilisateur == 'agent':
            try:
                agent = Agent.objects.get(utilisateur=self.user)
                user_data = AgentSerializer(agent).data
            except Agent.DoesNotExist:
                logger.error(f"Profil agent non trouvé pour l'utilisateur: {self.user.email}")
                raise serializers.ValidationError("Profil agent non trouvé pour cet utilisateur.")
        
        elif self.user.type_utilisateur == 'citoyen':
            try:
                citoyen = Citoyen.objects.get(utilisateur=self.user)
                user_data = CitoyenSerializer(citoyen).data
            except Citoyen.DoesNotExist:
                logger.error(f"Profil citoyen non trouvé pour l'utilisateur: {self.user.email}")
                raise serializers.ValidationError("Profil citoyen non trouvé pour cet utilisateur.")

        elif self.user.type_utilisateur == 'admin':
            try:
                admin = Administrateur.objects.get(utilisateur=self.user)
                user_data = AdministrateurSerializer(admin).data
            except Administrateur.DoesNotExist:
                logger.error(f"Profil administrateur non trouvé pour l'utilisateur: {self.user.email}")
                raise serializers.ValidationError("Profil administrateur non trouvé pour cet utilisateur.")
        
        # Fusionner les données de l'utilisateur (qui contiennent 'utilisateur', 'matricule', etc.)
        # avec la réponse principale.
        data.update(user_data)
        
        # Renommer la clé 'utilisateur' en 'userData' pour correspondre à ce que le frontend attend potentiellement
        if 'utilisateur' in data:
            data['userData'] = data.pop('utilisateur')

        logger.info(f"Authentification réussie pour: {self.user.email} (Type: {self.user.type_utilisateur})")
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer pour le changement de mot de passe.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({"new_password_confirm": "Les deux mots de passe ne correspondent pas."})
        return data



# Serializers pour la page Historique Admin

class HistoriqueCitoyenSerializer(serializers.ModelSerializer):
    nom_complet = serializers.SerializerMethodField()
    email = serializers.CharField(source='utilisateur.email', read_only=True)
    telephone = serializers.CharField(source='utilisateur.telephone', read_only=True)
    date_inscription = serializers.DateTimeField(source='utilisateur.date_joined', read_only=True, format="%d-%m-%Y %H:%M")
    statut = serializers.SerializerMethodField() # Sera 'Actif' ou 'Inactif'
    id = serializers.IntegerField(source='pk', read_only=True) # pk est l'ID du Citoyen

    class Meta:
        model = Citoyen
        fields = ['id', 'nom_complet', 'email', 'telephone', 'date_inscription', 'statut', 'nin']

    def get_nom_complet(self, obj):
        return obj.utilisateur.get_full_name() if obj.utilisateur else ""

    def get_statut(self, obj):
        return "Actif" if obj.utilisateur and obj.utilisateur.is_active else "Inactif"

class HistoriqueAgentSerializer(serializers.ModelSerializer):
    nom_complet = serializers.SerializerMethodField()
    email = serializers.CharField(source='utilisateur.email', read_only=True)

    date_affectation = serializers.DateTimeField(source='utilisateur.date_joined', read_only=True, format="%d-%m-%Y %H:%M")
    statut = serializers.SerializerMethodField()
    id = serializers.IntegerField(source='pk', read_only=True) # pk est l'ID de l'Agent

    class Meta:
        model = Agent
        fields = ['id', 'matricule', 'nom_complet', 'email', 'date_affectation', 'statut']

    def get_nom_complet(self, obj):
        return obj.utilisateur.get_full_name() if obj.utilisateur else ""

    def get_statut(self, obj):
        return "Actif" if obj.utilisateur and obj.utilisateur.is_active else "Inactif"

class HistoriquePaiementSerializer(serializers.ModelSerializer):
    citoyen = serializers.SerializerMethodField()
    # Remplacement par une méthode explicite pour plus de robustesse
    citoyen_id = serializers.SerializerMethodField()
    montant = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    date_paiement = serializers.DateTimeField(read_only=True, format="%d-%m-%Y %H:%M")
    type_demande = serializers.CharField(source='demande.get_type_demande_display', read_only=True)
    statut = serializers.CharField(source='get_statut_display', read_only=True)

    class Meta:
        model = Paiement
        fields = ['id', 'citoyen', 'citoyen_id', 'montant', 'date_paiement', 'type_demande', 'statut', 'transaction_id']

    def get_citoyen(self, obj):
        if obj.demande and obj.demande.citoyen and obj.demande.citoyen.utilisateur:
            return obj.demande.citoyen.utilisateur.get_full_name()
        return "N/A"

    def get_citoyen_id(self, obj):
        # Méthode explicite pour récupérer l'ID du citoyen.
        # Retourne l'ID si le chemin d'accès complet existe, sinon None.
        if obj.demande and obj.demande.citoyen:
            return obj.demande.citoyen.pk
        return None




class HistoriqueDemandeSerializer(serializers.ModelSerializer):
    demandeur = serializers.SerializerMethodField()
    # Remplacement par une méthode explicite pour plus de robustesse
    citoyen_id = serializers.SerializerMethodField()
    type_demande = serializers.CharField(source='get_type_demande_display', read_only=True)
    date_soumission = serializers.DateTimeField(read_only=True, format="%d-%m-%Y %H:%M")
    date_traitement = serializers.DateTimeField(source='date_traitement_effective', read_only=True, format="%d-%m-%Y %H:%M", allow_null=True)
    statut = serializers.CharField(source='get_statut_display', read_only=True)

    class Meta:
        model = Demande
        fields = ['id', 'demandeur', 'citoyen_id', 'type_demande', 'date_soumission', 'date_traitement', 'statut']

    def get_demandeur(self, obj):
        if obj.citoyen and obj.citoyen.utilisateur:
            return obj.citoyen.utilisateur.get_full_name()
        return "N/A"

    def get_citoyen_id(self, obj):
        # Méthode explicite pour récupérer l'ID du citoyen.
        if obj.citoyen:
            return obj.citoyen.pk
        return None


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