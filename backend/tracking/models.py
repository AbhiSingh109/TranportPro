from django.db import models
from bookings.models import Booking


class TrackingEvent(models.Model):
    STATUS_BOOKED = 'booked'
    STATUS_LOADED = 'loaded'
    STATUS_DISPATCHED = 'dispatched'
    STATUS_IN_TRANSIT = 'in_transit'
    STATUS_ARRIVED = 'arrived_at_destination'
    STATUS_OUT_FOR_DELIVERY = 'out_for_delivery'
    STATUS_DELIVERED = 'delivered'
    STATUS_DELAYED = 'delayed'
    STATUS_EXCEPTION = 'exception'
    STATUS_CHOICES = [
        (STATUS_BOOKED, 'Booked'),
        (STATUS_LOADED, 'Loaded'),
        (STATUS_DISPATCHED, 'Dispatched'),
        (STATUS_IN_TRANSIT, 'In Transit'),
        (STATUS_ARRIVED, 'Arrived at Destination'),
        (STATUS_OUT_FOR_DELIVERY, 'Out for Delivery'),
        (STATUS_DELIVERED, 'Delivered'),
        (STATUS_DELAYED, 'Delayed'),
        (STATUS_EXCEPTION, 'Exception'),
    ]

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='tracking_events')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES)
    event_time = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    remarks = models.TextField(blank=True)
    updated_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='tracking_updates')
    attachment = models.FileField(upload_to='tracking/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-event_time']

    def __str__(self):
        return f"{self.booking} — {self.get_status_display()} @ {self.event_time}"


class Delivery(models.Model):
    """Proof of delivery record."""
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='delivery')
    delivery_datetime = models.DateTimeField()
    receiver_name = models.CharField(max_length=200)
    receiver_contact = models.CharField(max_length=20, blank=True)
    delivered_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_remarks = models.TextField(blank=True)
    receiver_signature = models.ImageField(upload_to='signatures/', null=True, blank=True)
    delivery_photo = models.ImageField(upload_to='delivery_photos/', null=True, blank=True)
    is_partial = models.BooleanField(default=False)
    confirmed_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='deliveries_confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Delivery for {self.booking}"

