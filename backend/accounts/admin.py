"""Admin registrations for accounts app."""
from django.contrib import admin
from .models import Agency, User

@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "agency", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active", "agency")
    search_fields = ("email", "first_name", "last_name")
    readonly_fields = ("date_joined",)

