from rest_framework.permissions import BasePermission


class IsAgent(BasePermission):
    """
    Allows access only to users with the type 'agent'.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.type_utilisateur == 'agent'
        )


class IsAdmin(BasePermission):
    """
    Allows access only to users with the type 'admin'.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.type_utilisateur == 'admin'
        )
