from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from authentication.utils import check_email_domain, send_email, generate_otp
from enum import Enum


class Role(Enum):
    STUDENT = "Student"
    TEACHER = "Teacher"


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        email = serializer.data.get("email")
        role = serializer.data.get("roles")
        if check_email_domain(email):
            if role.lower() == Role.STUDENT.value.lower():
                try:
                    user = User.objects.get(email=email)
                    if user:
                        if user.is_active:
                            return Response({"message": "User already exist"})
                        else:
                            return Response({"message": "User is not verified"})
                    else:
                        serializer.save()
                        otp = generate_otp()
                        try:
                            email_data = {
                                "subject": "OTP for email verification",
                                "to_email": email,
                                "otp": otp,
                            }
                            send_email(email_data)
                        except Exception as error:
                            return Response(
                                {
                                    "message": f"Error occurred while sending mail for verification -> {error}"
                                }
                            )
                        return Response({"message": "OTP is sent to your email"})
                except Exception as error:
                    print("Error occurred while saving the user", error)
                    return Response(
                        {"message": f"Error occurred while saving the user -> {error}"}
                    )
            if role.lower() == Role.TEACHER.value.lower():
                send_email()
        else:
            pass
        return Response({"email": email})

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
