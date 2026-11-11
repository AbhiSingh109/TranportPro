from django.contrib import admin
from .models import Trip, TripBooking

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('trip_number', 'origin', 'destination', 'departure_date', 'vehicle', 'driver', 'status')
    list_filter = ('status', 'agency')
    search_fields = ('trip_number', 'origin', 'destination')

@admin.register(TripBooking)
class TripBookingAdmin(admin.ModelAdmin):
    list_display = ('trip', 'booking', 'added_at')

