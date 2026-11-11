from rest_framework import serializers
from .models import Trip, TripBooking

class TripBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripBooking
        fields = ['id', 'booking', 'added_at']
        read_only_fields = ['added_at']

class TripSerializer(serializers.ModelSerializer):
    trip_bookings = TripBookingSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('agency', 'trip_number', 'created_by', 'created_at', 'updated_at')

