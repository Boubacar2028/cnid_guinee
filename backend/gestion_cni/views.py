from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.renderers import JSONRenderer
from django.shortcuts import get_object_or_404
from .models import Citoyen, Agent, Administrateur, ExtraitNaissance, Demande
from .serializers import (
    CitoyenSerializer, AgentSerializer, AdministrateurSerializer,
    ExtraitNaissanceSerializer, DemandeSerializer, CustomTokenObtainPairSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    renderer_classes = [JSONRenderer]

class CitoyenViewSet(viewsets.ModelViewSet):
    queryset = Citoyen.objects.all()
    serializer_class = CitoyenSerializer
    permission_classes = [permissions.IsAuthenticated]

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
            serializer.save(citoyen=self.request.user.citoyen)
        else:
            serializer.save()