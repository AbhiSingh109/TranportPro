"""Serializers for accounts app."""
from rest_framework import serializers
from .models import Agency, User

class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ['id', 'name', 'address', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    agency = AgencySerializer(read_only=True)
    agency_id = serializers.PrimaryKeyRelatedField(
        queryset=Agency.objects.all(), write_only=True, source='agency'
    )

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'agency', 'agency_id',
            'is_active', 'is_staff', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'agency']

