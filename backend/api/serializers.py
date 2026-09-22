from rest_framework import serializers
from .models import StatItem, FeatureCard, Shipment

class StatItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatItem
        fields = '__all__'


class FeatureCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureCard
        fields = '__all__'


class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'
