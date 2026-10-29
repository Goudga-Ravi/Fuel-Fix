from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProviderProfileViewSet, ServiceRequestViewSet

router = DefaultRouter()
router.register(r'providers', ProviderProfileViewSet, basename='provider')
router.register(r'requests', ServiceRequestViewSet, basename='request')

urlpatterns = [
    path('', include(router.urls)),
]
