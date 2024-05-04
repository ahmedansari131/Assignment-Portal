from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("create-assignment/", views.createAssignment, name="create_assignment"),
    path("assignment/link/", views.assignment_link_view, name="assignment_link"),
    path("assignments/", views.get_assignments, name="get_assignment"),
    path("upload/", views.file_upload, name="file_upload"),
    path("submissions/", views.get_total_submissions, name="total_submissions"),
    path("serve-documents/", views.serve_document, name="serve_documents"),
    path("individual-submissions/", views.get_individual_submissions, name="individual_submissions"),

    path("plagiarism/", views.plagiarism, name="plagiarism"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
