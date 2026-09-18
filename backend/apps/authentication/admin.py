from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'full_name', 'profession', 'preferred_language', 'explanation_mode', 'is_staff', 'is_active', 'created_at']
    list_filter = ['is_staff', 'is_active', 'preferred_language', 'explanation_mode']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'avatar', 'profession', 'organization')}),
        ('Preferences', {'fields': ('preferred_language', 'explanation_mode')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    search_fields = ['email', 'full_name']
    ordering = ['-created_at']
