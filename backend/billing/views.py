from rest_framework import viewsets, permissions, filters
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['invoice_number', 'customer__customer_name']
    ordering_fields = ['invoice_date', 'status', 'created_at']

    def get_queryset(self):
        qs = Invoice.objects.filter(agency=self.request.user.agency).prefetch_related('payments')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def perform_create(self, serializer):
        serializer.save(agency=self.request.user.agency, created_by=self.request.user)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(invoice__agency=self.request.user.agency)

    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)

