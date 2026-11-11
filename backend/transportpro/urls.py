"""URL configuration for transportpro project."""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Authentication endpoints
    path('api/v1/auth/', include('accounts.auth_urls')),
    # App endpoints
    path('api/v1/', include('accounts.urls')),
    path('api/v1/', include('agencies.urls')),
    path('api/v1/', include('customers.urls')),
    path('api/v1/', include('fleet.urls')),
    path('api/v1/', include('bookings.urls')),
    path('api/v1/', include('trips.urls')),
    path('api/v1/', include('tracking.urls')),
    path('api/v1/', include('billing.urls')),
    path('api/v1/', include('expenses.urls')),
    path('api/v1/', include('reports.urls')),
    path('api/v1/', include('notifications.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
