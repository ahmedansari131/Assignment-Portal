from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from authentication.views import TokenObtainPairWithoutPasswordView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/v1/", include("authentication.urls")),
    path("api/token/", TokenObtainPairWithoutPasswordView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/portal/v1/", include("portal.urls")),
]
