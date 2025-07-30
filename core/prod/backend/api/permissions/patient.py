from rest_framework.permissions import BasePermission


class IsOwnRequest(BasePermission):
    
    
    def has_object_permission(self, request, view, obj):
        return obj.patient == request.user