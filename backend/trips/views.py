from rest_framework import viewsets, permissions, filters, status as drf_status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Trip, TripBooking
from .serializers import TripSerializer
from bookings.models import Booking


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['trip_number', 'origin', 'destination']
    ordering_fields = ['departure_date', 'status', 'created_at']

    def get_queryset(self):
        return Trip.objects.filter(agency=self.request.user.agency).prefetch_related('trip_bookings')

    def perform_create(self, serializer):
        serializer.save(agency=self.request.user.agency, created_by=self.request.user)

    @action(detail=True, methods=['post'], url_path='dispatch')
    def dispatch_trip(self, request, pk=None):
        trip = self.get_object()
        if not trip.vehicle or not trip.driver:
            return Response(
                {'error': 'Vehicle and driver must be assigned before dispatch.'},
                status=drf_status.HTTP_400_BAD_REQUEST
            )
        if trip.status not in [Trip.STATUS_PLANNED, Trip.STATUS_ASSIGNED]:
            return Response({'error': 'Trip cannot be dispatched in its current status.'}, status=drf_status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            trip.status = Trip.STATUS_DISPATCHED
            trip.save()
            trip.vehicle.status = 'on_trip'
            trip.vehicle.save()
        return Response(TripSerializer(trip).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        trip = self.get_object()
        with transaction.atomic():
            trip.status = Trip.STATUS_COMPLETED
            trip.save()
            if trip.vehicle:
                trip.vehicle.status = 'available'
                trip.vehicle.save()
        return Response(TripSerializer(trip).data)

    @action(detail=True, methods=['post'], url_path='add-booking')
    def add_booking(self, request, pk=None):
        trip = self.get_object()
        booking_id = request.data.get('booking_id')
        try:
            booking = Booking.objects.get(id=booking_id, agency=request.user.agency)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=drf_status.HTTP_404_NOT_FOUND)
        TripBooking.objects.get_or_create(trip=trip, booking=booking)
        return Response(TripSerializer(trip).data)

