from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ProviderProfile, ServiceRequest
from .serializers import ProviderProfileSerializer, ServiceRequestSerializer
import math

class ProviderProfileViewSet(viewsets.ModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can see all providers. Providers can only edit their own.
        return ProviderProfile.objects.all()
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def nearby(self, request):
        lat = float(request.query_params.get('lat', 0.0))
        lng = float(request.query_params.get('lng', 0.0))
        service_type = request.query_params.get('service_type', None)

        qs = ProviderProfile.objects.filter(is_available=True)
        if service_type:
            qs = qs.filter(service_type=service_type)

        providers = []
        for p in qs:
            dist = math.sqrt((p.latitude - lat)**2 + (p.longitude - lng)**2) * 111 # Approx distance in km
            providers.append((dist, p))
        
        providers.sort(key=lambda x: x[0])
        top_10 = [p[1] for p in providers[:10]]
        
        serializer = self.get_serializer(top_10, many=True)
        return Response(serializer.data)

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_provider:
            return ServiceRequest.objects.filter(provider=user)
        return ServiceRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        req = self.get_object()
        if not request.user.is_provider:
            return Response({"error": "Only providers can accept requests."}, status=status.HTTP_403_FORBIDDEN)
        if req.status != 'PENDING':
            return Response({"error": "Request is no longer pending."}, status=status.HTTP_400_BAD_REQUEST)
        
        req.provider = request.user
        req.status = 'ACCEPTED'
        req.save()
        return Response(self.get_serializer(req).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        req = self.get_object()
        if req.provider != request.user:
            return Response({"error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        
        req.status = 'COMPLETED'
        req.save()
        return Response(self.get_serializer(req).data)
