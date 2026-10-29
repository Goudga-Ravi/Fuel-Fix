from rest_framework import serializers
from .models import ProviderProfile, ServiceRequest
from users.serializers import UserSerializer

class ProviderProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    class Meta:
        model = ProviderProfile
        fields = '__all__'
        read_only_fields = ('user',)

class ServiceRequestSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    provider_details = UserSerializer(source='provider', read_only=True)
    provider_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = ServiceRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at', 'updated_at')
