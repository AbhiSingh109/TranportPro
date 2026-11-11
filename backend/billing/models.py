from django.db import models
from decimal import Decimal
from accounts.models import Agency
from customers.models import Customer
from bookings.models import Booking


class Invoice(models.Model):
    STATUS_UNPAID = 'unpaid'
    STATUS_PARTIAL = 'partially_paid'
    STATUS_PAID = 'paid'
    STATUS_OVERDUE = 'overdue'
    STATUS_CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (STATUS_UNPAID, 'Unpaid'),
        (STATUS_PARTIAL, 'Partially Paid'),
        (STATUS_PAID, 'Paid'),
        (STATUS_OVERDUE, 'Overdue'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=50, unique=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='invoices')
    bookings = models.ManyToManyField(Booking, related_name='invoices', blank=True)
    invoice_date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    freight_amount = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    loading_charges = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    unloading_charges = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    additional_charges = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0'))  # e.g. 5.00 = 5%
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_UNPAID)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='invoices_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-invoice_date', '-id']

    def __str__(self):
        return self.invoice_number or f"Invoice #{self.id}"

    @property
    def subtotal(self):
        return self.freight_amount + self.loading_charges + self.unloading_charges + self.additional_charges

    @property
    def gst_amount(self):
        return (self.subtotal * self.gst_rate / Decimal('100')).quantize(Decimal('0.01'))

    @property
    def total_amount(self):
        return self.subtotal + self.gst_amount

    @property
    def amount_paid(self):
        return sum(p.amount for p in self.payments.filter(is_refund=False))

    @property
    def outstanding_amount(self):
        return self.total_amount - Decimal(str(self.amount_paid))

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            last = Invoice.objects.filter(agency=self.agency).order_by('-id').first()
            seq = (int(last.invoice_number.split('-')[-1]) + 1) if last and last.invoice_number else 1
            self.invoice_number = f"INV-{self.agency_id:04d}-{seq:06d}"
        super().save(*args, **kwargs)


class Payment(models.Model):
    MODE_CASH = 'cash'
    MODE_BANK = 'bank_transfer'
    MODE_UPI = 'upi'
    MODE_CHEQUE = 'cheque'
    MODE_OTHER = 'other'
    MODE_CHOICES = [
        (MODE_CASH, 'Cash'),
        (MODE_BANK, 'Bank Transfer'),
        (MODE_UPI, 'UPI'),
        (MODE_CHEQUE, 'Cheque'),
        (MODE_OTHER, 'Other'),
    ]

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateField()
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=MODE_CHOICES, default=MODE_CASH)
    reference_number = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    is_refund = models.BooleanField(default=False)
    recorded_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='payments_recorded')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-payment_date']

    def __str__(self):
        prefix = 'Refund' if self.is_refund else 'Payment'
        return f"{prefix} {self.amount} for {self.invoice}"

