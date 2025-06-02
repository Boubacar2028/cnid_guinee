from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        logger.info(f"Tentative d'authentification avec username={username}")
        
        # Vérifier aussi si email est fourni directement
        email = kwargs.get('email', username)
        
        try:
            # Essayer de trouver l'utilisateur par email
            user = None
            
            # Recherche par email (principal)
            try:
                user = User.objects.get(email=email)
                logger.info(f"Utilisateur trouvé par email: {email}")
            except User.DoesNotExist:
                logger.info(f"Aucun utilisateur avec email: {email}")
                
                # Si pas trouvé par email, essayer par username
                try:
                    user = User.objects.get(username=username)
                    logger.info(f"Utilisateur trouvé par username: {username}")
                except User.DoesNotExist:
                    logger.info(f"Aucun utilisateur avec username: {username}")
                    return None
            
            # Vérifier le mot de passe
            if user and user.check_password(password):
                logger.info(f"Mot de passe valide pour {user.username}")
                return user
            else:
                logger.info(f"Mot de passe invalide pour {email if user else 'utilisateur non trouvé'}")
                return None
                
        except Exception as e:
            logger.error(f"Erreur lors de l'authentification: {str(e)}")
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            logger.error(f"Utilisateur avec ID {user_id} non trouvé")
            return None