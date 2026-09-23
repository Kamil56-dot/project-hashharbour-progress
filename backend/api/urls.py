from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import StatItemViewSet, FeatureCardViewSet, ShipmentViewSet
from .auth_views import EmailTokenObtainPairView

router = DefaultRouter()
router.register(r'stats', StatItemViewSet, basename='stat')
router.register(r'features', FeatureCardViewSet, basename='feature')
router.register(r'shipments', ShipmentViewSet, basename='shipment')

urlpatterns = [
    path('auth/login/', EmailTokenObtainPairView.as_view(), name='auth_login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
