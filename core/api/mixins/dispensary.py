from django.db.models import Q

class DispensaryQuerySetMixin():
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        return qs.filter(
            Q(dispensary__owner=user) | Q(dispensary__doctor__user=user)
        ).distinct()