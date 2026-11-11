from rest_framework import serializers
from .models import Vehicle, Driver


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ('agency', 'created_at', 'updated_at')


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'
        read_only_fields = ('agency', 'created_at', 'updated_at')

