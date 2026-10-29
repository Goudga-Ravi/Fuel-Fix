from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_provider = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({'Provider' if self.is_provider else 'User'})"
