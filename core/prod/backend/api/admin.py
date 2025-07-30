from django.contrib import admin
from api.models import Appointment, AppointmentHistory

# Register your models here.
class AppointmentAdmin(admin.ModelAdmin):
    model = Appointment
    list_display = ["patient", "dispensary", "date", "hour", "status", "created_at", "token"]
    list_filter = ["status", "date", "created_at", "dispensary"]
    search_fields = ["patient__username", "patient__email", "dispensary__name", "reason"]
    readonly_fields = ["token", "created_at", "updated_at"]
    date_hierarchy = "date"

class AppointmentHistoryAdmin(admin.ModelAdmin):
    model = AppointmentHistory
    list_display = ["patient", "dispensary", "date", "hour", "final_status", "completed_at", "token"]
    list_filter = ["final_status", "date", "completed_at"]
    search_fields = ["patient__username", "patient__email", "dispensary__name"]
    readonly_fields = ["token", "completed_at"]
    date_hierarchy = "date"

# Correction : Enregistrer chaque modèle avec sa classe admin correspondante
admin.site.register(Appointment, AppointmentAdmin)
admin.site.register(AppointmentHistory, AppointmentHistoryAdmin)