from django.db import models
from accounts.models import Agency


class Vehicle(models.Model):
    STATUS_AVAILABLE = 'available'
    STATUS_ASSIGNED = 'assigned'
    STATUS_ON_TRIP = 'on_trip'
    STATUS_MAINTENANCE = 'maintenance'
    STATUS_INACTIVE = 'inactive'
    STATUS_CHOICES = [
        (STATUS_AVAILABLE, 'Available'),
        (STATUS_ASSIGNED, 'Assigned'),
        (STATUS_ON_TRIP, 'On Trip'),
        (STATUS_MAINTENANCE, 'Under Maintenance'),
        (STATUS_INACTIVE, 'Inactive'),
    ]

    OWNERSHIP_OWNED = 'owned'
    OWNERSHIP_LEASED = 'leased'
    OWNERSHIP_THIRD_PARTY = 'third_party'
    OWNERSHIP_CHOICES = [
        (OWNERSHIP_OWNED, 'Owned'),
        (OWNERSHIP_LEASED, 'Leased'),
        (OWNERSHIP_THIRD_PARTY, 'Third Party'),
    ]

    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='vehicles')
    registration_number = models.CharField(max_length=20)
    vehicle_type = models.CharField(max_length=100)
    capacity_tons = models.DecimalField(max_digits=8, decimal_places=2)
    ownership_type = models.CharField(max_length=20, choices=OWNERSHIP_CHOICES, default=OWNERSHIP_OWNED)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)
    insurance_expiry = models.DateField(null=True, blank=True)
    fitness_expiry = models.DateField(null=True, blank=True)
    permit_expiry = models.DateField(null=True, blank=True)
    pollution_expiry = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('agency', 'registration_number')
        ordering = ['registration_number']

    def __str__(self):
        return f"{self.registration_number} ({self.vehicle_type})"


class Driver(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_INACTIVE = 'inactive'
    STATUS_ON_LEAVE = 'on_leave'
    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Active'),
        (STATUS_INACTIVE, 'Inactive'),
        (STATUS_ON_LEAVE, 'On Leave'),
    ]

    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='drivers')
    full_name = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    licence_number = models.CharField(max_length=50)
    licence_expiry = models.DateField(null=True, blank=True)
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    employment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return self.full_name

