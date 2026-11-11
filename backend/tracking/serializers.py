from rest_framework import serializers
from .models import TrackingEvent, Delivery

class TrackingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingEvent
        fields = '__all__'
        read_only_fields = ('updated_by', 'created_at')

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'
        read_only_fields = ('confirmed_by', 'created_at')

