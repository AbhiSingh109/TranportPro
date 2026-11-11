from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import TrackingEvent, Delivery
from .serializers import TrackingEventSerializer, DeliverySerializer
from bookings.models import Booking


class TrackingEventViewSet(viewsets.ModelViewSet):
    queryset = TrackingEvent.objects.all()
    serializer_class = TrackingEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = TrackingEvent.objects.filter(booking__agency=self.request.user.agency)
        booking_id = self.request.query_params.get('booking')
        if booking_id:
            qs = qs.filter(booking_id=booking_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)


class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Delivery.objects.filter(booking__agency=self.request.user.agency)

    def perform_create(self, serializer):
        serializer.save(confirmed_by=self.request.user)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_tracking(request, lr_number):
    """Public endpoint: look up a booking by LR number and return tracking events."""
    booking = get_object_or_404(Booking, lr_number=lr_number)
    events = TrackingEvent.objects.filter(booking=booking).order_by('-event_time')
    data = {
        'lr_number': booking.lr_number,
        'booking_number': booking.booking_number,
        'origin': booking.origin,
        'destination': booking.destination,
        'status': booking.status,
        'events': TrackingEventSerializer(events, many=True).data,
    }
    return Response(data)

