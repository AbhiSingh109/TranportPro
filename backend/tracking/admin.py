from django.contrib import admin
from .models import TrackingEvent, Delivery

@admin.register(TrackingEvent)
class TrackingEventAdmin(admin.ModelAdmin):
    list_display = ('booking', 'status', 'event_time', 'location', 'updated_by')
    list_filter = ('status',)

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('booking', 'delivery_datetime', 'receiver_name', 'is_partial')

