from django.urls import path
from .views import RegisterAPI, LoginAPI, UserAPI, LogoutAPI

urlpatterns = [
    path('auth/register/', RegisterAPI.as_view(), name='register'),
    path('auth/login/', LoginAPI.as_view(), name='login'),
    path('auth/user/', UserAPI.as_view(), name='user'),
    path('auth/logout/', LogoutAPI.as_view(), name='logout'),
]
