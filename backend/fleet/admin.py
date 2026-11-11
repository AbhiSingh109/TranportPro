from django.contrib import admin
from .models import Vehicle, Driver


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('registration_number', 'vehicle_type', 'status', 'agency')
    list_filter = ('status', 'ownership_type', 'agency')
    search_fields = ('registration_number',)


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone_number', 'licence_number', 'employment_status', 'agency')
    list_filter = ('employment_status', 'agency')
    search_fields = ('full_name', 'phone_number', 'licence_number')

