# backend/gestion_cni/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class CustomUserAdmin(UserAdmin):
    model = Utilisateur
    list_display = ('username', 'email', 'type_utilisateur', 'telephone', 'is_staff')
    list_filter = ('type_utilisateur', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informations personnelles', {'fields': ('email', 'telephone', 'type_utilisateur')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates importantes', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'telephone', 'type_utilisateur', 'password1', 'password2'),
        }),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)

@admin.register(Citoyen)
class CitoyenAdmin(admin.ModelAdmin):
    list_display = ('nin', 'utilisateur', 'sexe', 'date_naissance', 'adresse')
    list_filter = ('sexe', 'situation_matrimoniale')
    search_fields = ('nin', 'utilisateur__username', 'pere_nom', 'mere_nom')
    raw_id_fields = ('utilisateur',)
    fieldsets = (
        (None, {'fields': ('utilisateur', 'nin')}),
        ('Informations biographiques', {
            'fields': ('date_naissance', 'lieu_naissance', 'sexe', 'nationalite', 'situation_matrimoniale')
        }),
        ('Informations familiales', {'fields': ('pere_nom', 'mere_nom')}),
        ('Détails supplémentaires', {'fields': ('profession', 'adresse', 'photo')}),
    )

@admin.register(ExtraitNaissance)
class ExtraitNaissanceAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'date_naissance', 'lieu_naissance', 'citoyen')
    search_fields = ('nom', 'prenom', 'citoyen__nin')
    list_filter = ('lieu_naissance',)
    raw_id_fields = ('citoyen',)

@admin.register(Demande)
class DemandeAdmin(admin.ModelAdmin):
    list_display = ('id', 'citoyen', 'type_demande', 'statut', 'date_soumission', 'agent_traitant')
    list_filter = ('statut', 'type_demande')
    search_fields = ('citoyen__nin', 'extrait__nom', 'extrait__prenom')
    raw_id_fields = ('citoyen', 'extrait', 'agent_traitant')
    date_hierarchy = 'date_soumission'
    actions = ['marquer_comme_validee', 'marquer_comme_rejetee']

    def marquer_comme_validee(self, request, queryset):
        queryset.update(statut='validee')
    marquer_comme_validee.short_description = "Marquer comme validée"

    def marquer_comme_rejetee(self, request, queryset):
        queryset.update(statut='rejetee')
    marquer_comme_rejetee.short_description = "Marquer comme rejetée"

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'demande', 'type_document', 'statut_verification', 'date_upload')
    list_filter = ('type_document', 'statut_verification')
    search_fields = ('demande__citoyen__nin',)
    raw_id_fields = ('demande',)

@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = ('id', 'demande', 'montant', 'methode', 'statut', 'date_paiement')
    list_filter = ('methode', 'statut')
    search_fields = ('demande__citoyen__nin', 'transaction_id')
    raw_id_fields = ('demande',)
    date_hierarchy = 'date_paiement'

@admin.register(Creneau)
class CreneauAdmin(admin.ModelAdmin):
    list_display = ('id', 'date_creneau', 'agent', 'demande', 'statut')
    list_filter = ('statut', 'agent')
    raw_id_fields = ('agent', 'demande')
    date_hierarchy = 'date_creneau'

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'citoyen', 'date_envoi', 'statut')
    list_filter = ('statut',)
    search_fields = ('citoyen__nin',)
    raw_id_fields = ('citoyen', 'demande')
    date_hierarchy = 'date_envoi'

@admin.register(Configuration)
class ConfigurationAdmin(admin.ModelAdmin):
    list_display = ('cle', 'valeur', 'modifiable')
    search_fields = ('cle',)
    list_editable = ('valeur',)

@admin.register(Historique)
class HistoriqueAdmin(admin.ModelAdmin):
    list_display = ('id', 'utilisateur', 'action', 'date_action')
    list_filter = ('action',)
    search_fields = ('utilisateur__username',)
    raw_id_fields = ('utilisateur',)
    date_hierarchy = 'date_action'

# Enregistrement des modèles qui nécessitent une configuration spéciale
admin.site.register(Utilisateur, CustomUserAdmin)
admin.site.register(Agent)
admin.site.register(Administrateur)