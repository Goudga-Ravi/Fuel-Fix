from django.db import models
from django.conf import settings

SERVICE_CHOICES = (
    ('MECHANIC', 'Mechanic'),
    ('FUEL', 'Fuel Delivery'),
    ('EMERGENCY', 'Roadside Assistance'),
)

class ProviderProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='provider_profile')
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES, default='MECHANIC')
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.get_service_type_display()}"

class ServiceRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='requests')
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    latitude = models.FloatField(help_text="User's latitude location when requesting", default=0.0)
    longitude = models.FloatField(help_text="User's longitude location when requesting", default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request #{self.id} - {self.get_service_type_display()} ({self.status})"
