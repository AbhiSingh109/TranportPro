from rest_framework import viewsets, permissions, filters
from .models import Vehicle, Driver
from .serializers import VehicleSerializer, DriverSerializer


class AgencyQuerysetMixin:
    """Automatically filter querysets to the authenticated user's agency."""
    def get_queryset(self):
        return super().get_queryset().filter(agency=self.request.user.agency)

    def perform_create(self, serializer):
        serializer.save(agency=self.request.user.agency)


class VehicleViewSet(AgencyQuerysetMixin, viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['registration_number', 'vehicle_type']
    ordering_fields = ['registration_number', 'status', 'created_at']


class DriverViewSet(AgencyQuerysetMixin, viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name', 'phone_number', 'licence_number']
    ordering_fields = ['full_name', 'employment_status', 'created_at']

