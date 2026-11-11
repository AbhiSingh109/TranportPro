from django.db import models
from accounts.models import Agency
from fleet.models import Vehicle
from trips.models import Trip


class Expense(models.Model):
    CAT_FUEL = 'fuel'
    CAT_TOLL = 'toll'
    CAT_DRIVER_ALLOWANCE = 'driver_allowance'
    CAT_LOADING = 'loading'
    CAT_UNLOADING = 'unloading'
    CAT_REPAIR = 'vehicle_repair'
    CAT_MAINTENANCE = 'maintenance'
    CAT_PARKING = 'parking'
    CAT_OTHER = 'other'
    CATEGORY_CHOICES = [
        (CAT_FUEL, 'Fuel'),
        (CAT_TOLL, 'Toll'),
        (CAT_DRIVER_ALLOWANCE, 'Driver Allowance'),
        (CAT_LOADING, 'Loading'),
        (CAT_UNLOADING, 'Unloading'),
        (CAT_REPAIR, 'Vehicle Repair'),
        (CAT_MAINTENANCE, 'Maintenance'),
        (CAT_PARKING, 'Parking'),
        (CAT_OTHER, 'Other'),
    ]

    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='expenses')
    expense_date = models.DateField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    trip = models.ForeignKey(Trip, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    receipt = models.FileField(upload_to='receipts/', null=True, blank=True)
    recorded_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='expenses_recorded')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-expense_date']

    def __str__(self):
        return f"{self.get_category_display()} — {self.amount} on {self.expense_date}"

