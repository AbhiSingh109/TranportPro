from django.urls import path
from .views import revenue_report, expense_report, outstanding_report, dashboard_stats

urlpatterns = [
    path('reports/revenue/', revenue_report, name='report-revenue'),
    path('reports/expenses/', expense_report, name='report-expenses'),
    path('reports/outstanding/', outstanding_report, name='report-outstanding'),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
]

