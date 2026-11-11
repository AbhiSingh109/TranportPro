from rest_framework import viewsets, permissions
from .models import User, Agency
from .serializers import UserSerializer, AgencySerializer

class AgencyViewSet(viewsets.ModelViewSet):
    queryset = Agency.objects.all()
    serializer_class = AgencySerializer
    permission_classes = [permissions.IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('agency').all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

