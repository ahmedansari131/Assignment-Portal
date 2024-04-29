from django.conf import settings
from django.http import FileResponse
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import *
from .models import *
from django.core.files.storage import default_storage
import os
from django.utils.text import slugify
from constants import Constant
from rest_framework.permissions import IsAuthenticated
from urllib.parse import unquote
import random
import math
import datetime
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createAssignment(request):
    data = request.data
    serializer = AssignmentSerializer(data=data)

    if serializer.is_valid():
        assignment = serializer.save()
        assignment_id = assignment.id
        link = f'{os.environ.get("CLIENT_URL")}/submissions/{assignment_id}/'
        assignment.link = link
        assignment.save()
        data = serializer.data
        data["link"] = link
        return Response({"message": Constant.ASSIGNMENT_CREATED.value, "data": data})
    else:
        return Response({"message": serializer.errors})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assignment_link_view(request):
    id = request.GET.get("id")
    if id is None:
        return Response({"error": "ID parameter is missing"})
    data = request.data
    student = data["user"]
    print(student)
    print("Assignment id: ", id)
    try:
        assignment = Assignment.objects.get(id=id)
        print(assignment.students)
        assignment.students.add(student)
        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data)
    except Exception as error:
        print("Error occurred", error)
        return Response({"error": str(error)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_assignments(request):
    user_id = request.GET.get("user_id")
    if user_id is None:
        return Response({"error": "User_id parameter is missing"})
    try:
        assignments = Assignment.objects.filter(createdBy=user_id)
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(
            {"message": Constant.GOT_ASSIGNMENT.value, "data": serializer.data}
        )
    except Exception as error:
        print("Error occurred while getting the assignments")
        return Response({"message": str(error)})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def file_upload(request):
    user_id = request.GET.get("user_id")
    assignment_id = request.GET.get("assignment_id")
    print(assignment_id)
    file = request.data["file"]
    timestamp = timezone.localtime(timezone.now())

    year = timestamp.strftime("%Y")
    month = timestamp.strftime("%m")
    day = timestamp.strftime("%d")
    hour = str(timestamp.hour)
    minute = str(timestamp.minute)
    second = str(timestamp.second)
    time = year + month + day + hour + minute + second

    file_name = slugify(file.name)
    file_name = file_name[:-3]
    print("File name ->", file_name)
    file_path = os.path.join(
        "pdfs", f"{file_name}_student_{user_id}_{assignment_id}_{time}.pdf"
    )

    if default_storage.exists(file_path):
        return Response({"message": "File already exist"})

    file_path = default_storage.save(file_path, file)
    try:
        if file_path:
            assignment = Assignment.objects.get(id=assignment_id)
            assignment.students.add(user_id)
            return Response(
                {"status": "File uploaded successfully", "file_path": file_path}
            )
        else:
            return Response({"message": "Error occurred"})
    except Exception as error:
        return Response(
            {"message": f"Error occurred while uploading the document -> {error}"}
        )


@api_view(["GET"])
def get_student_submissions(request):
    assignment_id = request.GET.get("assignment_id")
    try:
        assignment = Assignment.objects.get(id=assignment_id)
        user_ids = assignment.students.all()
        users = User.objects.filter(id__in=user_ids)
        serialized_users = UserLoginSerializer(users, many=True)
        assignment = Assignment.objects.filter(id=assignment_id)
        serialized_assignments = AssignmentSerializer(assignment, many=True)

        serialized_users.data[0]["assignments"] = serialized_assignments.data
        data = serialized_users.data

        root_directory = default_storage.location
        directory = "pdfs"
        files = default_storage.listdir(directory)[1]

        for user_data in serialized_users.data:
            for file_name in files:
                if file_name.split("_")[3] == assignment_id:
                    user_data["document"] = os.path.join(
                        root_directory, directory, file_name
                    )

        return Response(
            {"message": Constant.ALL_SUBMISSIONS.value, "data": serialized_users.data}
        )

    except Exception as error:
        return Response(
            {"message": f"Error occurred while getting the submissions: {error}"}
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def serve_document(request):
    file_path = request.data
    print(file_path)
    decoded_file_path = unquote(file_path["file_path"]).replace("file:///", "")
    print(decoded_file_path)
    if os.path.exists(decoded_file_path):
        return FileResponse(
            open(decoded_file_path, "rb"), content_type="application/pdf"
        )
    else:
        return Response({"message": "File not found"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_individual_submissions(request):
    user_id = request.GET.get("user_id")

    try:
        submissions = Assignment.objects.filter(students=user_id)
        if not submissions:
            return Response({"message": "No submissions found"})

        serialzer = AssignmentSerializer(submissions, many=True)
        return Response({"message": "Submission found", "data": serialzer.data})

    except Exception as error:
        return Response(
            {"message": f"Error occurred while getting the submissions {error}"}
        )


def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, "rb") as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text


def compare_documents(documents):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)
    return cosine_similarity(tfidf_matrix, tfidf_matrix)


def detect_plagiarism(similarity_matrix, threshold, filenames):  # Added filenames
    num_docs = similarity_matrix.shape[0]
    plagiarism_cases = []
    analyzed_documents = []

    for i in range(num_docs):
        for j in range(i + 1, num_docs):
            similarity_score = similarity_matrix[i, j]
            analyzed_documents.append([filenames[i], filenames[j], similarity_score])
            if similarity_score > threshold:
                plagiarism_cases.append((filenames[i], filenames[j], similarity_score))
    return plagiarism_cases, analyzed_documents


def get_all_paths(directory):
    file_names = default_storage.listdir(directory)[1]
    full_paths = [
        default_storage.path(directory + file_name) for file_name in file_names
    ]

    return full_paths


@api_view(["POST"])
def plagiarism(request):
    pdf_files = get_all_paths("pdfs/")
    assignments = []
    assignment_id = request.data["assignment_id"]
    analyzed_documents_response = []
    plagiarized_documents_response = []

    for filename in pdf_files:
        if str(os.path.basename(filename).split("_")[3]) == str(assignment_id):
            assignments.append(filename)

    documents = [extract_text_from_pdf(pdf_file) for pdf_file in assignments]
    similarity_matrix = compare_documents(documents)
    plagiarism_cases, analyzed_documents = detect_plagiarism(
        similarity_matrix, threshold=0.4, filenames=assignments
    )

    for i in range(len(analyzed_documents)):
        for j in range(len(analyzed_documents[i])):
            if isinstance(analyzed_documents[i][j], float):
                continue
            student_id_1 = os.path.basename(analyzed_documents[i][j].split("_")[2])
            if not isinstance(analyzed_documents[i][j + 1], float):
                student_id_2 = os.path.basename(
                    analyzed_documents[i][j + 1].split("_")[2]
                )
            else:
                continue
            student_1 = User.objects.get(id=student_id_1)
            student_2 = User.objects.get(id=student_id_2)

            if analyzed_documents[i][2] < 0.4:
                analyzed_documents_response.append(
                    {
                        "student_one": student_1.email,
                        "student_two": student_2.email,
                        "plagiarism": analyzed_documents[i][2],
                    }
                )

    # Group plagiarism cases by similarity score
    plagiarism_groups = []
    for case in plagiarism_cases:
        doc1, doc2, similarity_score = case
        plagiarism_groups.append([doc1, doc2, similarity_score])

    BOLD = "\033[1m"
    RESET = "\033[0m"

    # print("Plagiarism group -> ", plagiarism_groups)

    for i in range(len(plagiarism_groups)):
        for j in range(len(plagiarism_groups[i])):
            if isinstance(plagiarism_groups[i][j], float):
                continue

            if not isinstance(plagiarism_groups[i][j + 1], float):
                timestamp1 = os.path.basename(
                    plagiarism_groups[i][j].split("_")[4].replace(".pdf", "")
                )
                timestamp2 = os.path.basename(
                    plagiarism_groups[i][j + 1].split("_")[4].replace(".pdf", "")
                )
                original_doc = (
                    plagiarism_groups[i][j]
                    if timestamp1 < timestamp2
                    else plagiarism_groups[i][j + 1]
                )
                plagiarised_doc = (
                    plagiarism_groups[i][j + 1]
                    if original_doc == plagiarism_groups[i][j]
                    else plagiarism_groups[i][j]
                )

                authentic_student_id = os.path.basename(original_doc.split("_")[2])
                plagiarized_student_id = os.path.basename(plagiarised_doc.split("_")[2])

                authentic_student = User.objects.get(id=authentic_student_id)
                plagiarized_student = User.objects.get(id=plagiarized_student_id)

                plagiarized_documents_response.append(
                    {
                        "authentic": [authentic_student.email],
                        "plagiarized": [plagiarized_student.email],
                        "plagiarism": plagiarism_groups[i][2]
                    }
                )

            else:
                continue
    return Response(
        {
            "message": "Operation successful",
            "data": [
                plagiarized_documents_response,
                analyzed_documents_response,
            ],
        }
    )
