from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/v1/", include("authentication.urls")),
    path("api/portal/v1/", include("portal.urls")),
]
