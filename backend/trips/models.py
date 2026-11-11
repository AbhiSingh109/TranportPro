from django.db import models
from accounts.models import Agency
from fleet.models import Vehicle, Driver
from bookings.models import Booking


class Trip(models.Model):
    STATUS_PLANNED = 'planned'
    STATUS_ASSIGNED = 'assigned'
    STATUS_DISPATCHED = 'dispatched'
    STATUS_IN_TRANSIT = 'in_transit'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_DELAYED = 'delayed'
    STATUS_CHOICES = [
        (STATUS_PLANNED, 'Planned'),
        (STATUS_ASSIGNED, 'Assigned'),
        (STATUS_DISPATCHED, 'Dispatched'),
        (STATUS_IN_TRANSIT, 'In Transit'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
        (STATUS_DELAYED, 'Delayed'),
    ]

    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='trips')
    trip_number = models.CharField(max_length=50, unique=True, blank=True)
    origin = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    departure_date = models.DateField()
    expected_arrival = models.DateField(null=True, blank=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='trips')
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name='trips')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PLANNED)
    remarks = models.TextField(blank=True)
    bookings = models.ManyToManyField(Booking, through='TripBooking', related_name='trips', blank=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='trips_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-departure_date', '-id']

    def __str__(self):
        return self.trip_number or f"Trip #{self.id}"

    def save(self, *args, **kwargs):
        if not self.trip_number:
            last = Trip.objects.filter(agency=self.agency).order_by('-id').first()
            seq = (int(last.trip_number.split('-')[-1]) + 1) if last and last.trip_number else 1
            self.trip_number = f"TR-{self.agency_id:04d}-{seq:06d}"
        super().save(*args, **kwargs)


class TripBooking(models.Model):
    """Links a Booking to a Trip (many-to-many through model)."""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='trip_bookings')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='trip_bookings')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('trip', 'booking')

