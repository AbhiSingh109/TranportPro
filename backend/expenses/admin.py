from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('expense_date', 'category', 'amount', 'vehicle', 'trip', 'agency')
    list_filter = ('category', 'agency')
    search_fields = ('description',)

