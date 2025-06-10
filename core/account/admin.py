from django.contrib import admin
from account.models import WaitingUser
from django.contrib.auth import get_user_model

User = get_user_model()


# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    model = User
    
@admin.register(WaitingUser)
class WaitingUserAdmin(admin.ModelAdmin):
    model = WaitingUser
    list_display = ("username", "token")