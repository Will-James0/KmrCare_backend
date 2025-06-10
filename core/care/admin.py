from django.contrib import admin
from .models import Doctor, Dispensary

# Register your models here.

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    model = Doctor
    
@admin.register(Dispensary)
class DispensaryAdmin(admin.ModelAdmin):
    model = Dispensary
    list_display = ["name", "token"]