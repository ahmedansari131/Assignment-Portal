from django.urls import path
from . import views


urlpatterns = [
    # path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("verify-login/", views.verify_login, name="verify_login"),
    # path("verify-email/", views.verify_email, name="verify_email"),
    path("verify-teacher/<int:id>/", views.verify_user_as_teacher, name="verify_teacher"),
    path("verify-teacher-email/", views.verify_teacher_email, name="verify_teacher_email"),
    path("get-user/", views.get_user, name="get_user"),
]
