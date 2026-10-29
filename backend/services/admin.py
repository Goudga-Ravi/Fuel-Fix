from django.contrib import admin
from .models import ProviderProfile, ServiceRequest

admin.site.register(ProviderProfile)
admin.site.register(ServiceRequest)
