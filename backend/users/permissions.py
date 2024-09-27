from rest_framework.permissions import BasePermission, IsAuthenticated

from .models import Role

class IsNormalUser(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return request.user.role == Role.USER
        return IsAuthenticated().has_permission(request, view)