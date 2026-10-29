from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('is_provider', 'phone_number')}),
    )
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_provider']

admin.site.register(User, CustomUserAdmin)
