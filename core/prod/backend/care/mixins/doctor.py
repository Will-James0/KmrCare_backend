from django.db.models import Q


class UserQuerySetMixin():
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        return qs.filter(
            Q(user=user) | Q(dispensary__owner=user)
        ).distinct()