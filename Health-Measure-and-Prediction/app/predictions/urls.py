from django.urls import path
from .views import ProfileView, APIRootView

urlpatterns = [
    path('', APIRootView.as_view(), name='api-root'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
