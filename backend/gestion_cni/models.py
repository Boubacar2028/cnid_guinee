from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# voici le modèle utilisateur

class Utilisateur(AbstractUser):
    TYPE_CHOICES = [
        ('admin', 'Administrateur'),
        ('agent', 'Agent'),
        ('citoyen', 'Citoyen'),
    ]
    
    type_utilisateur = models.CharField(max_length=100, choices=TYPE_CHOICES)
    telephone = models.CharField(max_length=100)
    
    # Solution pour les conflits :
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groupes',
        blank=True,
        help_text='Les groupes auxquels appartient l\'utilisateur',
        related_name="utilisateur_set",  # Nom unique
        related_query_name="utilisateur",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='permissions utilisateur',
        blank=True,
        help_text='Permissions spécifiques pour cet utilisateur',
        related_name="utilisateur_set",  # Nom unique
        related_query_name="utilisateur",
    )

    def __str__(self):
        return f"{self.username} ({self.type_utilisateur})"

# voici le modèle citoyen tout comme l'admin lui il hérite de utilisateur

class Citoyen(models.Model):
    SEXE_CHOICES = [('M', 'Masculin'), ('F', 'Féminin')]
    SITUATION_CHOICES = [
        ('celibataire', 'Célibataire'),
        ('marie', 'Marié(e)'),
        ('divorce', 'Divorcé(e)'),
        ('veuf', 'Veuf/Veuve'),
    ]

    utilisateur = models.OneToOneField(
        Utilisateur,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='citoyen'
    )
    nin = models.CharField(max_length=20, unique=True, verbose_name="Numéro d'identification national", blank=True, null=True)
    date_naissance = models.DateField(blank=True, null=True)
    lieu_naissance = models.CharField(max_length=100, blank=True, default="")
    sexe = models.CharField(max_length=1, choices=SEXE_CHOICES, default="M")
    nationalite = models.CharField(max_length=50, default="Guinéenne")
    adresse = models.CharField(max_length=100, verbose_name="Domicile", blank=True, default="")  # Nom cohérent avec SQL
    profession = models.CharField(max_length=100, blank=True, default="")
    situation_matrimoniale = models.CharField(
        max_length=20,
        choices=SITUATION_CHOICES,
        blank=True,
        null=True,
        default="celibataire"
    )
    pere_prenom = models.CharField(max_length=100, verbose_name="Prénom du père", blank=True, default="")
    pere_nom = models.CharField(max_length=100, verbose_name="Nom du père", blank=True, default="")
    mere_prenom = models.CharField(max_length=100, verbose_name="Prénom de la mère", blank=True, default="")
    mere_nom = models.CharField(max_length=100, verbose_name="Nom de la mère", blank=True, default="")
    taille = models.PositiveIntegerField(blank=True, null=True, verbose_name="Taille (cm)")
    teint = models.CharField(max_length=100, blank=True, null=True, verbose_name="Teint")
    signe_particulier = models.TextField(blank=True, null=True, verbose_name="Signe particulier")
    photo = models.ImageField(upload_to='photos/', blank=True)

    class Meta:
        verbose_name = "Citoyen"
        verbose_name_plural = "Citoyens"
        ordering = ['nin']

    def __str__(self):
        return f"{self.utilisateur.get_full_name()} (NIN: {self.nin})"

# Modèle pour l'agent 
class Agent(models.Model):
    utilisateur = models.OneToOneField(
        Utilisateur,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='agent'
    )
    matricule = models.CharField(max_length=20, unique=True, blank=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.matricule:
            current_year = timezone.now().year
            prefix = f"AG{current_year}"
            last_agent = Agent.objects.filter(matricule__startswith=prefix).order_by('-matricule').first()
            
            if last_agent:
                last_seq_str = last_agent.matricule[len(prefix):]
                next_seq = int(last_seq_str) + 1
            else:
                next_seq = 1
            
            self.matricule = f"{prefix}{next_seq:02d}"
        
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Agent"
        verbose_name_plural = "Agents"
        ordering = ['matricule']

    def __str__(self):
        return f"{self.utilisateur.get_full_name()} (Matricule: {self.matricule})"

# Modèle pour l'administrateur
class Administrateur(models.Model):
    utilisateur = models.OneToOneField(
        Utilisateur,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='administrateur'
    )
    super_admin = models.BooleanField(
        default=False,
        verbose_name="Super administrateur"
    )
    
    class Meta:
        verbose_name = "Administrateur"
        verbose_name_plural = "Administrateurs"
        
    def __str__(self):
        status = "Super admin" if self.super_admin else "Admin"
        return f"{self.utilisateur.get_full_name()} ({status})"
    
# Modèle Extrait de naissance

class ExtraitNaissance(models.Model):
    citoyen = models.OneToOneField(
        'Citoyen',
        on_delete=models.CASCADE,
        related_name='extrait_naissance',
        verbose_name="Citoyen associé"
    )

    prenom =models.CharField(max_length=100, verbose_name="Prénom")
    nom =models.CharField(max_length=100, verbose_name="Nom")
    date_naissance = models.DateField(verbose_name="Date de naissance")
    lieu_naissance = models.CharField(max_length=100, verbose_name="Lieu de naissance")
    pere_nom = models.CharField(max_length=100, verbose_name="Nom père")
    mere_nom = models.CharField(max_length=100, verbose_name="Nom de la mère")
    date_emission = models.CharField(max_length=100, verbose_name="Commune d'émission")
    commune_emission = models.CharField(max_length=100, verbose_name="Commune d'émission")

    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création (enregistrement)")
    date_mise_a_jour = models.DateTimeField(auto_now=True, verbose_name="Dernière mise à jour")

    class Meta:
        verbose_name = "Extrait de naissance"
        verbose_name_plural = "Extraits de naissance"
        ordering = ['-date_emission']
        indexes = [
            models.Index(fields=['nom', 'prenom']),
            models.Index(fields=['date_naissance']),
        ]

    def __str__(self):
        return f"Extrait de {self.prenom} {self.nom} ({self.date_naissance})"
    
    @property
    def nin(self):
        return self.citoyen.nin
    
# Modèle Demande
class Demande(models.Model):
    TYPE_DEMANDE_CHOICES = [
        ('premiere', 'Première demande'),
        ('renouvellement', 'Renouvellement'),
        ('duplicata', 'Duplicata'),
    ]
    
    STATUT_CHOICES = [
        ('en_cours', 'En cours de traitement'),
        ('validee', 'Validée'),
        ('rejetee', 'Rejetée'),
    ]
    
    citoyen = models.ForeignKey(
        Citoyen, 
        on_delete=models.CASCADE,
        related_name='demandes'
    )
    extrait = models.ForeignKey(
        'ExtraitNaissance',
        on_delete=models.SET_NULL, 
        null=True,                 # Permet NULL dans la base de données
        blank=True,                # Permet au champ d'être vide dans les formulaires Django (admin)
        verbose_name="Extrait de naissance associé"
    )
    agent_traitant = models.ForeignKey(
        'Agent',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='demandes_traitees',
        verbose_name="Agent traitant"
    )
    type_demande = models.CharField(  # Nouveau champ
        max_length=20,
        choices=TYPE_DEMANDE_CHOICES,
        default='premiere'
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_cours'
    )
    date_soumission = models.DateTimeField(auto_now_add=True)
    date_traitement = models.DateTimeField(null=True, blank=True)
    motif_rejet = models.TextField(blank=True, null=True, verbose_name="Motif du rejet")

    photo_fournie = models.ImageField(upload_to='demandes_photos/', blank=True, null=True, verbose_name="Photo fournie pour la demande")
    signature_fournie = models.ImageField(upload_to='demandes_signatures/', blank=True, null=True, verbose_name="Signature fournie pour la demande")

    # Champs pour renouvellement ou duplicata
    numero_cni_precedent = models.CharField(max_length=50, blank=True, null=True, verbose_name="Numéro CNI précédente")
    date_delivrance_cni_precedent = models.DateField(blank=True, null=True, verbose_name="Date de délivrance CNI précédente")
    
    # Champs spécifiques au duplicata
    motif_duplicata = models.TextField(blank=True, null=True, verbose_name="Motif du duplicata")
    declaration_perte = models.FileField(upload_to='declarations_perte/', blank=True, null=True, verbose_name="Déclaration de perte")

    class Meta:
        ordering = ['-date_soumission']
        verbose_name = "Demande de CNI"
        verbose_name_plural = "Demandes de CNI"
        indexes = [
            models.Index(fields=['statut'], name='idx_statut'),
            models.Index(fields=['citoyen'], name='idx_demandes_citoyen'),
        ]

    def __str__(self):
        return f"Demande #{self.id} - {self.citoyen} ({self.get_type_demande_display()})"
    
# Modèle Document
class Document(models.Model):
    TYPE_DOCUMENT = [
        ('extrait', 'Extrait de naissance'),
        ('photo', 'Photo d\'identité'),
        ('residence', 'Certificat de résidence'),  # Correspond à 'certificat_residence' en SQL
    ]
    
    STATUT_VERIFICATION = [
        ('non_verifie', 'Non vérifié'),
        ('valide', 'Validé'),
        ('invalide', 'Invalide'),
    ]
    
    demande = models.ForeignKey(
        Demande,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    type_document = models.CharField(
        max_length=20,
        choices=TYPE_DOCUMENT,
        verbose_name="Type de document"
    )
    fichier = models.FileField(
        upload_to='documents/%Y/%m/%d/',  # Meilleure organisation des fichiers
        verbose_name="Fichier uploadé"
    )
    statut_verification = models.CharField(  # Remplace le Boolean
        max_length=20,
        choices=STATUT_VERIFICATION,
        default='non_verifie',
        verbose_name="Statut de vérification"
    )
    date_upload = models.DateTimeField(  # Nouveau champ
        auto_now_add=True,
        verbose_name="Date d'upload"
    )

    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"
        indexes = [
            models.Index(fields=['demande'], name='idx_document_demande'),
        ]
        ordering = ['-date_upload']

    def __str__(self):
        return f"{self.get_type_document_display()} (Demande #{self.demande.id})"

# Modèle Paiement
class Paiement(models.Model):
    METHODE_CHOICES = [
        ('orange_money', 'Orange Money'),  # Harmonisation avec SQL
        ('mobile_money', 'Mobile Money (MTN)'),  # Correspond à 'mobile_money' en SQL
    ]
    
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('complet', 'Complet'),
        ('echoue', 'Échoué'),
        ('rembourse', 'Remboursé'),
    ]
    
    demande = models.ForeignKey(  # Changé de OneToOne à ForeignKey
        Demande,
        on_delete=models.CASCADE,
        related_name='paiements'
    )
    montant = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Montant (GNF)"
    )
    date_paiement = models.DateTimeField(auto_now_add=True)
    methode = models.CharField(
        max_length=20,
        choices=METHODE_CHOICES,
        verbose_name="Méthode de paiement"
    )
    transaction_id = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="ID Transaction"
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente'
    )
    numero_telephone_paiement = models.CharField(
        max_length=20, 
        null=True, 
        blank=True, 
        verbose_name="Numéro de téléphone du paiement"
    )

    class Meta:
        verbose_name = "Paiement"
        verbose_name_plural = "Paiements"
        indexes = [
            models.Index(fields=['transaction_id'], name='idx_transaction'),
            models.Index(fields=['demande'], name='idx_paiement_demande'),
        ]
        ordering = ['-date_paiement']

    def __str__(self):
        return f"Paiement #{self.transaction_id} ({self.get_statut_display()})"

# Modèle Créneau
class Creneau(models.Model):
    STATUT_CHOICES = [
        ('disponible', 'Disponible'),
        ('reserve', 'Réservé'),
        ('complete', 'Complet'),       
        ('annule', 'Annulé'),          
    ]
    
    demande = models.ForeignKey(       
        Demande,
        on_delete=models.SET_NULL,     
        null=True,
        blank=True,
        related_name='creneaux'
    )
    date_creneau = models.DateTimeField(  
        verbose_name="Date et heure du créneau"
    )
    agent = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        limit_choices_to={'type_utilisateur': 'agent'},
        verbose_name="Agent assigné"
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='disponible'
    )

    class Meta:
        verbose_name = "Créneau"
        verbose_name_plural = "Créneaux"
        indexes = [
            models.Index(fields=['date_creneau'], name='idx_creneaux_date'),
        ]
        ordering = ['date_creneau']

    def __str__(self):
        return f"Créneau du {self.date_creneau} ({self.get_statut_display()})"

# Modèle Notification
class Notification(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente d\'envoi'),
        ('envoye', 'Envoyée'),
        ('echoue', 'Échec d\'envoi'),
        ('lue', 'Lue'),
    ]
    
    citoyen = models.ForeignKey(  # Changé pour correspondre à la table SQL
        Citoyen,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    demande = models.ForeignKey(
        Demande,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    contenu = models.TextField(  # Renommé pour correspondre au SQL
        verbose_name="Contenu de la notification"
    )
    date_envoi = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'envoi"
    )
    statut = models.CharField(  # Remplace le Boolean 'lue'
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente'
    )

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        indexes = [
            models.Index(fields=['citoyen'], name='idx_notifications_citoyen'),
        ]
        ordering = ['-date_envoi']

    def __str__(self):
        return f"Notification pour {self.citoyen} ({self.get_statut_display()})"

# Modèle Configuration
class Configuration(models.Model):
    cle = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Clé de configuration"
    )
    valeur = models.TextField(
        verbose_name="Valeur associée"
    )
    description = models.CharField(  # Changé de TextField à CharField
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Description de la configuration"
    )
    modifiable = models.BooleanField(
        default=True,
        verbose_name="Modifiable via l'interface"
    )

    class Meta:
        verbose_name = "Paramètre de configuration"
        verbose_name_plural = "Paramètres de configuration"
        ordering = ['cle']

    def __str__(self):
        return f"{self.cle} = {self.valeur[:50]}{'...' if len(self.valeur) > 50 else ''}"

    @classmethod
    def get_config(cls, cle, default=None):
        try:
            return cls.objects.get(cle=cle).valeur
        except cls.DoesNotExist:
            return default

# Modèle Historique
class Historique(models.Model):
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        verbose_name="Utilisateur",
        related_name='actions_historique'
    )
    action = models.CharField(
        max_length=50,  # Harmonisation avec la longueur SQL
        verbose_name="Action effectuée"
    )
    details = models.TextField(
        blank=True,
        null=True,
        verbose_name="Détails complémentaires"
    )
    date_action = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de l'action"
    )

    class Meta:
        verbose_name = "Entrée d'historique"
        verbose_name_plural = "Historique des actions"
        ordering = ['-date_action']  # Tri par défaut
        indexes = [
            models.Index(fields=['action'], name='idx_action'),
            models.Index(fields=['date_action'], name='idx_historiques_date'),
        ]

    def __str__(self):
        return f"{self.action} par {self.utilisateur} ({self.date_action})"


