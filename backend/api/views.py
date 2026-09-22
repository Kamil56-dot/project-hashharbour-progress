from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import StatItem, FeatureCard, Shipment
from .serializers import StatItemSerializer, FeatureCardSerializer, ShipmentSerializer

class StatItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StatItem.objects.all()
    serializer_class = StatItemSerializer


class FeatureCardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FeatureCard.objects.all()
    serializer_class = FeatureCardSerializer


class ShipmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer

    @action(detail=False, methods=['get'])
    def track(self, request):
        tracking_no = request.query_params.get('tracking_no', None)
        if not tracking_no:
            return Response({'error': 'Tracking number parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            shipment = Shipment.objects.get(tracking_number__iexact=tracking_no.strip())
            serializer = self.get_serializer(shipment)
            return Response(serializer.data)
        except Shipment.DoesNotExist:
            return Response({'error': 'Shipment not found'}, status=status.HTTP_404_NOT_FOUND)
