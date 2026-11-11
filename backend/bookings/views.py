from rest_framework import viewsets, permissions, filters, status as drf_status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['booking_number', 'consignor_name', 'consignee_name', 'origin', 'destination']
    ordering_fields = ['booking_date', 'status', 'created_at']

    def get_queryset(self):
        qs = Booking.objects.filter(agency=self.request.user.agency)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def perform_create(self, serializer):
        serializer.save(agency=self.request.user.agency, created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        if booking.status != Booking.STATUS_DRAFT:
            return Response({'error': 'Only draft bookings can be confirmed.'}, status=drf_status.HTTP_400_BAD_REQUEST)
        booking.status = Booking.STATUS_CONFIRMED
        booking.save()
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status in [Booking.STATUS_DELIVERED, Booking.STATUS_CLOSED]:
            return Response({'error': 'Cannot cancel a delivered or closed booking.'}, status=drf_status.HTTP_400_BAD_REQUEST)
        booking.status = Booking.STATUS_CANCELLED
        booking.save()
        return Response(BookingSerializer(booking).data)

