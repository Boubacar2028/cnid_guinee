from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Citoyen, Agent, Administrateur, ExtraitNaissance, Demande
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

Utilisateur = get_user_model()

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'type_utilisateur', 'telephone']
        read_only_fields = ['type_utilisateur']

class CitoyenSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer()

    class Meta:
        model = Citoyen
        fields = '__all__'

    def create(self, validated_data):
        utilisateur_data = validated_data.pop('utilisateur')
        utilisateur_data['type_utilisateur'] = 'citoyen'
        utilisateur = Utilisateur.objects.create_user(**utilisateur_data)
        citoyen = Citoyen.objects.create(utilisateur=utilisateur, **validated_data)
        return citoyen

class AgentSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer()

    class Meta:
        model = Agent
        fields = '__all__'

    def create(self, validated_data):
        utilisateur_data = validated_data.pop('utilisateur')
        utilisateur_data['type_utilisateur'] = 'agent'
        utilisateur = Utilisateur.objects.create_user(**utilisateur_data)
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
        utilisateur = Utilisateur.objects.create_user(**utilisateur_data)
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
        data = super().validate(attrs)
        data['username'] = self.user.username  # Dans la réponse
        return data