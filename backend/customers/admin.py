from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'company_name', 'phone_number', 'is_active', 'agency')
    search_fields = ('customer_name', 'company_name', 'phone_number')
    list_filter = ('is_active', 'agency')

