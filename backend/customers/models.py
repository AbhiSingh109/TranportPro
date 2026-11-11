from django.db import models
from accounts.models import Agency


class Customer(models.Model):
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='customers')
    customer_name = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200, blank=True)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    gstin = models.CharField(max_length=15, blank=True)
    billing_address = models.TextField(blank=True)
    contact_person = models.CharField(max_length=200, blank=True)
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['customer_name']

    def __str__(self):
        return self.customer_name

