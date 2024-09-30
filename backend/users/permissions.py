from rest_framework.permissions import BasePermission
from .models import Role

class IsSuperuser(BasePermission):
    """
    Allows access only to superusers.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser

class IsAdmin(BasePermission):
    """
    Allows access only to active admin users (Branch Admin).
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated, active, and has the admin role
        return request.user.is_authenticated and request.user.is_active and request.user.role == Role.ADMIN

class IsSupervisor(BasePermission):
    """
    Allows access only to supervisors.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.SUPERVISOR and request.user.is_active

class IsStudent(BasePermission):
    """
    Allows access only to students.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.STUDENT and request.user.is_active

class IsAdminOrSupervisor(BasePermission):
    """
    Allows access to both admins and supervisors.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.role in [Role.ADMIN, Role.SUPERVISOR] and request.user.is_active
        )
