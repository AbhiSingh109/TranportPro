from django.db import models
from accounts.models import Agency


class Notification(models.Model):
    EVENT_BOOKING_CREATED = 'booking_created'
    EVENT_LR_GENERATED = 'lr_generated'
    EVENT_TRIP_DISPATCHED = 'trip_dispatched'
    EVENT_SHIPMENT_DELAYED = 'shipment_delayed'
    EVENT_DELIVERED = 'delivered'
    EVENT_INVOICE_GENERATED = 'invoice_generated'
    EVENT_PAYMENT_RECEIVED = 'payment_received'
    EVENT_PAYMENT_OVERDUE = 'payment_overdue'
    EVENT_DOC_EXPIRING = 'document_expiring'
    EVENT_CHOICES = [
        (EVENT_BOOKING_CREATED, 'Booking Created'),
        (EVENT_LR_GENERATED, 'LR/GR Generated'),
        (EVENT_TRIP_DISPATCHED, 'Trip Dispatched'),
        (EVENT_SHIPMENT_DELAYED, 'Shipment Delayed'),
        (EVENT_DELIVERED, 'Delivered'),
        (EVENT_INVOICE_GENERATED, 'Invoice Generated'),
        (EVENT_PAYMENT_RECEIVED, 'Payment Received'),
        (EVENT_PAYMENT_OVERDUE, 'Payment Overdue'),
        (EVENT_DOC_EXPIRING, 'Document Expiring'),
    ]

    CHANNEL_EMAIL = 'email'
    CHANNEL_WHATSAPP = 'whatsapp'
    CHANNEL_IN_APP = 'in_app'
    CHANNEL_CHOICES = [
        (CHANNEL_EMAIL, 'Email'),
        (CHANNEL_WHATSAPP, 'WhatsApp'),
        (CHANNEL_IN_APP, 'In-App'),
    ]

    STATUS_PENDING = 'pending'
    STATUS_SENT = 'sent'
    STATUS_FAILED = 'failed'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_SENT, 'Sent'),
        (STATUS_FAILED, 'Failed'),
    ]

    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='notifications')
    event = models.CharField(max_length=30, choices=EVENT_CHOICES)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default=CHANNEL_EMAIL)
    recipient = models.CharField(max_length=200)
    subject = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    error_detail = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_event_display()} → {self.recipient} [{self.status}]"

