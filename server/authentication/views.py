from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from django.core.files.storage import default_storage
import os
from django.utils.text import slugify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2


@api_view(["POST"])
def getUser(request):
    user = None
    data = request.data
    email = data.get("email")
    print("DATA:", data, email)
    try:
        user = User.objects.get(email=email)
    except Exception as error:
        print("Error occured while getting the user", error)
    print("Email:", user)
    if user:
        return Response({"message": "User already exist", "userId": user.id})
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"data": serializer.data})
    else:
        return Response({"Error": serializer.errors})


@api_view(["POST"])
def createAssignment(request):
    data = request.data
    serializer = AssignmentSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        data = serializer.data
        assignment_id = data["id"]
        data["link"] = f"http://127.0.0.1:8000/api/v1/assignment/link/{assignment_id}/"
        print(data)
        return Response({"message": "Assignment created successfully", "data": data})
    else:
        return Response({"message": serializer.errors})


@api_view(["POST"])
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
def get_assignments(request):
    user_id = request.GET.get("user_id")
    if user_id is None:
        return Response({"error": "User_id parameter is missing"})
    try:
        assignments = Assignment.objects.filter(students=user_id)
        serializer = AssignmentSerializer(assignments, many=True)
        return Response({"data": serializer.data})
    except Exception as error:
        print("Error occurred while getting the assignments")
        return Response({"message": str(error)})


@api_view(["POST"])
def file_upload(request):
    user_id = request.GET.get("user_id")
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
    file_path = os.path.join("pdfs", f"{file_name}-student-{user_id}-{time}.pdf")

    if default_storage.exists(file_path):
        return Response({"message": "File already exist"})

    file_path = default_storage.save(file_path, file)
    return Response({"status": "File uploaded successfully", "file_path": file_path})


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

    similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)

    return similarity_matrix


def detect_plagiarism(similarity_matrix, threshold):
    num_docs = similarity_matrix.shape[0]
    plagiarism_cases = []

    for i in range(num_docs):
        for j in range(i + 1, num_docs):
            similarity_score = similarity_matrix[i, j]
            if similarity_score > threshold:
                plagiarism_cases.append((i, j, similarity_score))

    return plagiarism_cases


def get_all_paths(directory):
    file_names = default_storage.listdir(directory)[
        1
    ]
    full_paths = [
        default_storage.path(directory + file_name) for file_name in file_names
    ]

    return full_paths


@api_view(["POST"])
def plagiarism(request):

    pdf_files = get_all_paths("pdfs/")
    documents = [extract_text_from_pdf(pdf_file) for pdf_file in pdf_files]

    similarity_matrix = compare_documents(documents)
    plagiarism_cases = detect_plagiarism(similarity_matrix, threshold=0.35)

    BOLD = "\033[1m"
    RESET = "\033[0m"

    for case in plagiarism_cases:
        doc1_index, doc2_index, similarity_score = case
        print(
            f"Documents {BOLD + os.path.basename(pdf_files[doc1_index]).split('.')[0].upper() + RESET} and {BOLD + os.path.basename(pdf_files[doc2_index]).split('.')[0].upper() + RESET} are similar with a similarity score of {similarity_score * 100}"
        )

    return Response({"message": "Success", "data": pdf_files})
