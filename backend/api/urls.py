from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StatItemViewSet, FeatureCardViewSet, ShipmentViewSet

router = DefaultRouter()
router.register(r'stats', StatItemViewSet, basename='stat')
router.register(r'features', FeatureCardViewSet, basename='feature')
router.register(r'shipments', ShipmentViewSet, basename='shipment')

urlpatterns = [
    path('', include(router.urls)),
]
