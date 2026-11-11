from django.contrib import admin
from .models import Invoice, Payment

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'customer', 'invoice_date', 'status', 'agency')
    list_filter = ('status', 'agency')
    search_fields = ('invoice_number', 'customer__customer_name')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'payment_date', 'amount', 'payment_mode', 'is_refund')
    list_filter = ('payment_mode', 'is_refund')

