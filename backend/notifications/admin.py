from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('event', 'channel', 'recipient', 'status', 'created_at', 'agency')
    list_filter = ('status', 'channel', 'event')

