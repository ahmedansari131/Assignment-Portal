from django.conf import settings
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
import boto3
from utils import s3_config
import difflib


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
    file_path = os.path.join(
        f"{file_name}_student_{user_id}_{assignment_id}_{time}.pdf"
    )

    s3_client = s3_config()
    try:
        s3_objects = get_s3_object()
        if s3_objects:
            for obj in s3_objects:
                if user_id == obj.split("_")[2] and assignment_id == obj.split("_")[3]:
                    return Response({"message": "Assignment already uploaded"})

        s3_client.upload_fileobj(file, os.environ.get("S3_BUCKET_NAME"), file_path)
        response_url = create_presigned_url(os.environ.get("S3_BUCKET_NAME"), file_path)

        assignment = Assignment.objects.get(id=assignment_id)
        assignment.students.add(user_id)
        assignment.save()

        return Response(
            {"message": "File uploaded successfully", "file_url": response_url}
        )
    except Exception as error:
        return Response(
            {"message": f"Error occurred while uploading the document -> {error}"}
        )


def create_presigned_url(
    object_name, expiration=3600, bucket_name=os.environ.get("S3_BUCKET_NAME")
):
    s3_client = s3_config()
    print(object_name)
    try:
        response = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": bucket_name,
                "Key": object_name,
                "ResponseContentType": "application/pdf",
            },
            ExpiresIn=expiration,
        )
    except Exception as error:
        return f"Error occurred while preparing url -> {error}"

    return response


def get_s3_object():
    s3_objects = []
    s3_client = s3_config()
    try:
        buckets_obj = s3_client.list_objects_v2(Bucket=os.environ.get("S3_BUCKET_NAME"))
        if "Contents" in buckets_obj:
            objects = buckets_obj["Contents"]
            for obj in objects:
                s3_objects.append(obj["Key"])
            return s3_objects
    except Exception as error:
        return Response(
            {"message": f"Error occurred while getting the objects -> {error}"}
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def serve_document(request):
    user_id = request.GET.get("user_id")
    assignment_id = request.GET.get("assignment_id")
    print(assignment_id, user_id)
    s3_objects = get_s3_object()
    for obj in s3_objects:
        if user_id == str(obj.split("_")[2]) and assignment_id == str(
            obj.split("_")[3]
        ):
            response_url = create_presigned_url(obj)
            return Response({"message": "Assignment found", "data": response_url})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_total_submissions(request):
    assignment_id = request.GET.get("assignment_id")
    data = []
    try:
        s3_objects = get_s3_object()
        for obj in s3_objects:
            if assignment_id == obj.split("_")[3]:
                try:
                    user = User.objects.get(id=obj.split("_")[2])
                    assignment = Assignment.objects.get(id=assignment_id)
                    assginment_serializer = AssignmentSerializer(assignment)
                    serializer = UserLoginSerializer(user)
                    response_url = create_presigned_url(obj)
                    data.append(
                        {
                            "student": serializer.data["email"],
                            "doc": response_url,
                            "assignment_title": assginment_serializer.data["title"],
                        }
                    )
                except Exception as error:
                    return Response(
                        {
                            "message": f"Error occurred while getting the users -> {error}"
                        }
                    )
        return Response({"message": "Got Assignments", "data": data})
    except Exception as error:
        return Response(
            {"message": f"Error occurred while getting all the assignments -> {error}"}
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_individual_submissions(request):
    user_id = request.GET.get("user_id")
    data = []

    try:
        submissions = Assignment.objects.filter(students=user_id)
        if not submissions:
            return Response({"message": "No submissions found"})

        serialzer = AssignmentSerializer(submissions, many=True)
        s3_objects = get_s3_object()

        for data in serialzer.data:
            for obj in s3_objects:
                if str(data["id"]) == obj.split("_")[3]:
                    data["submitted_link"] = create_presigned_url(obj)

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


def highlight_plagiarism(document_texts, similarity_matrix, threshold):
    num_docs = len(document_texts)
    highlighted_plagiarism = []

    for i in range(num_docs):
        for j in range(i + 1, num_docs):
            similarity_score = similarity_matrix[i, j]
            if similarity_score > threshold:
                # Use difflib to find the differences between the texts
                differ = difflib.SequenceMatcher(
                    None, document_texts[i], document_texts[j]
                )
                for tag, i1, i2, j1, j2 in differ.get_opcodes():
                    if tag == "equal":
                        highlighted_plagiarism.append(
                            (
                                i,
                                j,
                                similarity_score,
                                document_texts[i][i1:i2],
                                document_texts[j][j1:j2],
                            )
                        )
    return highlighted_plagiarism


def download_pdf_from_s3(bucket_name, key, destination):
    s3_client = s3_config()
    s3_client.download_file(bucket_name, key, destination)


def get_all_paths(assignment_id):
    objects = get_s3_object()
    for obj in objects:
        if assignment_id == obj.split("_")[3]:
            download_pdf_from_s3(
                os.environ.get("S3_BUCKET_NAME"),
                obj,
                os.path.join(settings.MEDIA_ROOT, "pdfs", obj),
            )
    full_path = [
        os.path.join(settings.MEDIA_ROOT, "pdfs", file_name)
        for file_name in objects
        if assignment_id == file_name.split("_")[3]
    ]
    return full_path


@api_view(["POST"])
def plagiarism(request):
    assignment_id = request.data["assignment_id"]
    pdf_files = get_all_paths(assignment_id)
    assignments = []
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

    highlighted_plagiarism = highlight_plagiarism(
        documents, similarity_matrix, threshold=0.4
    )
    print(highlighted_plagiarism)

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
                        "plagiarism": plagiarism_groups[i][2],
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
