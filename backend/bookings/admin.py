from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_number', 'booking_date', 'customer', 'origin', 'destination', 'status', 'payment_type')
    list_filter = ('status', 'payment_type', 'agency')
    search_fields = ('booking_number', 'consignor_name', 'consignee_name', 'lr_number')
    readonly_fields = ('booking_number', 'created_at', 'updated_at')

