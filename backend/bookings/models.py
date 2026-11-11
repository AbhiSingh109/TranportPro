from django.db import models
from accounts.models import Agency
from customers.models import Customer


def generate_booking_number(agency):
    """Generate a unique sequential booking number for the agency."""
    from django.db import transaction
    with transaction.atomic():
        last = Booking.objects.filter(agency=agency).order_by('-id').select_for_update().first()
        if last and last.booking_number:
            try:
                seq = int(last.booking_number.split('-')[-1]) + 1
            except (ValueError, IndexError):
                seq = 1
        else:
            seq = 1
        return f"BK-{agency.id:04d}-{seq:06d}"


class Booking(models.Model):
    STATUS_DRAFT = 'draft'
    STATUS_CONFIRMED = 'confirmed'
    STATUS_LR_GENERATED = 'lr_generated'
    STATUS_READY = 'ready_for_dispatch'
    STATUS_ASSIGNED = 'assigned_to_trip'
    STATUS_IN_TRANSIT = 'in_transit'
    STATUS_DELIVERED = 'delivered'
    STATUS_CLOSED = 'closed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Draft'),
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_LR_GENERATED, 'LR Generated'),
        (STATUS_READY, 'Ready for Dispatch'),
        (STATUS_ASSIGNED, 'Assigned to Trip'),
        (STATUS_IN_TRANSIT, 'In Transit'),
        (STATUS_DELIVERED, 'Delivered'),
        (STATUS_CLOSED, 'Closed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    PAYMENT_PAID = 'paid'
    PAYMENT_TO_PAY = 'to_pay'
    PAYMENT_TO_BILL = 'to_be_billed'
    PAYMENT_CHOICES = [
        (PAYMENT_PAID, 'Paid'),
        (PAYMENT_TO_PAY, 'To Pay'),
        (PAYMENT_TO_BILL, 'To Be Billed'),
    ]

    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='bookings')
    booking_number = models.CharField(max_length=50, unique=True, blank=True)
    booking_date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='bookings')

    # Consignor / Consignee
    consignor_name = models.CharField(max_length=200)
    consignor_address = models.TextField(blank=True)
    consignor_phone = models.CharField(max_length=20, blank=True)
    consignee_name = models.CharField(max_length=200)
    consignee_address = models.TextField(blank=True)
    consignee_phone = models.CharField(max_length=20, blank=True)

    # Route
    origin = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)

    # Goods details
    goods_description = models.TextField()
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    packaging_type = models.CharField(max_length=100, blank=True)
    actual_weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    declared_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    invoice_reference = models.CharField(max_length=100, blank=True)
    eway_bill = models.CharField(max_length=100, blank=True)

    # Freight
    freight_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    additional_charges = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default=PAYMENT_TO_BILL)

    # LR/GR
    lr_number = models.CharField(max_length=50, blank=True)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    special_instructions = models.TextField(blank=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='bookings_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-booking_date', '-id']

    def __str__(self):
        return self.booking_number or f"Booking #{self.id}"

    def save(self, *args, **kwargs):
        if not self.booking_number:
            self.booking_number = generate_booking_number(self.agency)
        super().save(*args, **kwargs)

