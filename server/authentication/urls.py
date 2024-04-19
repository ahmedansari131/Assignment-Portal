from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("getuser/", views.getUser, name="user_details"),
    path("create-assignment/", views.createAssignment, name="create_assignment"),
    path("assignment/link/", views.assignment_link_view, name="assignment_link"),
    path("assignment/", views.get_assignments, name="get_assignment"),
    path("upload/", views.file_upload, name="file_upload"),
    path("plagiarism/", views.plagiarism, name="plagiarism"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
