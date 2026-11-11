"""Accounts app URL router."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AgencyViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'agencies', AgencyViewSet, basename='agency')

urlpatterns = [
    path('', include(router.urls)),
]

