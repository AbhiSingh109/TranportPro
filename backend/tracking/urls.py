from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrackingEventViewSet, DeliveryViewSet, public_tracking

router = DefaultRouter()
router.register(r'tracking', TrackingEventViewSet, basename='tracking')
router.register(r'deliveries', DeliveryViewSet, basename='delivery')

urlpatterns = [
    path('', include(router.urls)),
    path('public/tracking/<str:lr_number>/', public_tracking, name='public-tracking'),
]

