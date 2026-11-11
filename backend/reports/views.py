from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
import datetime

from bookings.models import Booking
from billing.models import Invoice, Payment
from expenses.models import Expense
from trips.models import Trip
from fleet.models import Vehicle


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def revenue_report(request):
    agency = request.user.agency
    date_from = request.query_params.get('date_from')
    date_to = request.query_params.get('date_to')

    invoices = Invoice.objects.filter(agency=agency)
    if date_from:
        invoices = invoices.filter(invoice_date__gte=date_from)
    if date_to:
        invoices = invoices.filter(invoice_date__lte=date_to)

    payments = Payment.objects.filter(invoice__agency=agency, is_refund=False)
    if date_from:
        payments = payments.filter(payment_date__gte=date_from)
    if date_to:
        payments = payments.filter(payment_date__lte=date_to)

    return Response({
        'total_invoiced': invoices.aggregate(total=Sum('freight_amount'))['total'] or 0,
        'total_collected': payments.aggregate(total=Sum('amount'))['total'] or 0,
        'invoice_count': invoices.count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def expense_report(request):
    agency = request.user.agency
    date_from = request.query_params.get('date_from')
    date_to = request.query_params.get('date_to')

    expenses = Expense.objects.filter(agency=agency)
    if date_from:
        expenses = expenses.filter(expense_date__gte=date_from)
    if date_to:
        expenses = expenses.filter(expense_date__lte=date_to)

    by_category = expenses.values('category').annotate(total=Sum('amount'), count=Count('id'))
    return Response({
        'total_expenses': expenses.aggregate(total=Sum('amount'))['total'] or 0,
        'by_category': list(by_category),
        'expense_count': expenses.count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def outstanding_report(request):
    agency = request.user.agency
    invoices = Invoice.objects.filter(agency=agency).exclude(status=Invoice.STATUS_CANCELLED)
    data = []
    for inv in invoices:
        if inv.outstanding_amount > 0:
            data.append({
                'invoice_number': inv.invoice_number,
                'customer': inv.customer.customer_name,
                'invoice_date': inv.invoice_date,
                'due_date': inv.due_date,
                'total_amount': float(inv.total_amount),
                'amount_paid': float(inv.amount_paid),
                'outstanding_amount': float(inv.outstanding_amount),
                'status': inv.status,
            })
    return Response({'outstanding_invoices': data, 'count': len(data)})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    agency = request.user.agency
    today = timezone.localdate()
    month_start = today.replace(day=1)

    return Response({
        'bookings_today': Booking.objects.filter(agency=agency, booking_date=today).count(),
        'bookings_this_month': Booking.objects.filter(agency=agency, booking_date__gte=month_start).count(),
        'active_trips': Trip.objects.filter(agency=agency, status__in=['dispatched', 'in_transit']).count(),
        'in_transit': Booking.objects.filter(agency=agency, status='in_transit').count(),
        'pending_deliveries': Booking.objects.filter(agency=agency, status__in=['in_transit', 'assigned_to_trip']).count(),
        'completed_deliveries': Booking.objects.filter(agency=agency, status='delivered').count(),
        'active_vehicles': Vehicle.objects.filter(agency=agency, status='available').count(),
        'monthly_revenue': Payment.objects.filter(
            invoice__agency=agency, payment_date__gte=month_start, is_refund=False
        ).aggregate(total=Sum('amount'))['total'] or 0,
        'total_expenses_this_month': Expense.objects.filter(
            agency=agency, expense_date__gte=month_start
        ).aggregate(total=Sum('amount'))['total'] or 0,
    })

