import os
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from .models import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from authentication.utils import (
    check_email_domain,
    set_tokens_in_cookie,
    BaseEmail,
    generate_mail_template,
)
from django.contrib.auth.backends import BaseBackend
from rest_framework_simplejwt.views import TokenViewBase
from constants import Constant


class TokenObtainPairWithoutPasswordView(TokenViewBase):
    serializer_class = TokenObtainPairWithoutPasswordSerializer


class AuthenticationWithoutPassword(BaseBackend):
    def authenticate(self, request, email=None):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


def get_tokens_for_user(user, role, email):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = role

    access_token = refresh.access_token
    access_token.payload["role"] = role
    access_token.payload["email"] = email

    return {
        "refresh": str(refresh),
        "access": str(access_token),
    }


@api_view(["POST"])
def register(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        email = serializer.validated_data.get("email")
        role = serializer.validated_data.get("role")

        if check_email_domain(email):
            try:
                user_query = User.objects.filter(email=email)

                if user_query.exists():
                    return Response({"message": Constant.USER_EXIST.value})

                user_save_response = serializer.save()

                if user_save_response:
                    user_id = str(user_save_response.id)
                    otp = OTP.generate_otp(user=user_save_response)
                    verification_email = BaseEmail(
                        recepient=email,
                        subject="Email Verification | Assignment Portal",
                        body=generate_mail_template(
                            mail_type=Constant.VERIFY_EMAIL, otp=otp.otp_code
                        ),
                    )
                    email_response = verification_email.send_email()
                    if email_response and serializer.is_valid(raise_exception=True):
                        return Response(
                            {"message": Constant.OTP_SENT.value, "user_id": user_id}
                        )

            except Exception as error:
                return Response({"message": f"Error occurred {error}"})
        else:
            return Response({"message": "Enter the Vidyalankar's Email Id"})


@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        email = serializer.validated_data.get("email")
        role = serializer.validated_data.get("role")
        if check_email_domain(email):
            user_query = User.objects.filter(email=email)
            if user_query.exists():
                user = User.objects.get(email=email)
                if user.role.lower() == role.lower():
                    user_id = str(user.id)
                    email_sent_response = send_login_email(user)
                    if email_sent_response:
                        return Response(
                            {
                                "message": Constant.VERIFY_EMAIL.value,
                                "user_id": user_id,
                                "role": user.role,
                            }
                        )
                else:
                    return Response({"message": Constant.USER_DOES_NOT_EXIST.value})
            else:
                if serializer.is_valid(raise_exception=True):
                    user = serializer.save()
                    user_id = str(user.id)
                    email_sent_response = send_login_email(user)
                    if email_sent_response:
                        return Response(
                            {
                                "message": Constant.VERIFY_EMAIL.value,
                                "user_id": user_id,
                                "role": str(user.role),
                                "is_registering": True,
                            }
                        )

                    return Response({"message": Constant.USER_DOES_NOT_EXIST.value})
        else:
            return Response({"message": "Enter Vidyalankar's Email Id"})

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def send_login_email(user):
    otp = OTP.generate_otp(user)
    user_verification = BaseEmail(
        subject="OTP for Login to Assignment Portal",
        recepient=user.email,
        body=generate_mail_template(mail_type=Constant.IS_STUDENT, otp=otp.otp_code),
        mail_type=Constant.IS_STUDENT,
    )
    user_verification_response = user_verification.send_email()
    if user_verification_response:
        return True
    else:
        return False


@api_view(["POST"])
def verify_email(request):
    user_id = request.data.get("user_id")
    otp_code = request.data.get("otp")

    if not user_id:
        return Response({"message": "Invalid request"})

    try:
        user = User.objects.get(id=user_id)
        verification_response = OTP.verify_otp(user, otp_code)
        if verification_response == Constant.CORRECT_OTP:
            user.is_active = True
            user.save()
            return Response({"message": "User is verified"})
        elif verification_response == Constant.INCORRECT_OTP:
            return Response({"message": "OTP does not match"})
        elif verification_response == Constant.EXPIRED_OTP:
            otp = OTP.generate_otp(user)
            email_verification = BaseEmail(
                subject="OTP for email verification",
                recepient=user.email,
                body=generate_mail_template(
                    mail_type=Constant.IS_STUDENT, otp=otp.otp_code
                ),
                mail_type=Constant.IS_STUDENT,
            )
            response = email_verification.send_email()
            if response:
                return Response(
                    {"message": "OTP is expired. Please check your mail for new OTP"}
                )

    except Exception as error:
        return Response(
            {"message": f"Error occcurred while verifying the email -> {error}"}
        )


@api_view(["POST"])
def verify_teacher_email(request):
    user_id = request.data.get("user_id")
    otp_code = request.data.get("otp")

    try:
        user = User.objects.get(id=user_id)
    except Exception as error:
        return Response({"message": f"Error occurred {error}"})
    verification_response = OTP.verify_otp(user, otp_code)

    if verification_response == Constant.CORRECT_OTP:
        email_verification = BaseEmail(
            subject="Verify user identity",
            sender=user.email,
            recepient=os.environ.get("ADMIN_EMAIL"),
            body=generate_mail_template(
                mail_type=Constant.IS_TEACHING_STAFF.value,
                verify_link=f'{os.environ.get("SERVER_URL")}/api/auth/v1/verify-teacher/{user_id}/',
                reject_link=f'{os.environ.get("SERVER_URL")}/api/auth/v1/verify-teacher/{user_id}/?status=reject',
            ),
        )
        response = email_verification.send_email()
        if response:
            return Response({"message": Constant.WILL_BE_NOTIFIED.value})

    elif verification_response == Constant.INCORRECT_OTP:
        return Response({"message": Constant.INCORRECT_OTP.value})
    elif verification_response == Constant.EXPIRED_OTP:
        otp = OTP.generate_otp(user)
        email_verification = BaseEmail(
            subject="OTP for email verification",
            recepient=user.email,
            body=generate_mail_template(
                mail_type=Constant.VERIFY_EMAIL, otp=otp.otp_code
            ),
            mail_type=Constant.VERIFY_EMAIL,
        )
        response = email_verification.send_email()
        if response:
            return Response({"message": Constant.EXPIRED_OTP.value})

    return Response({"message": ""})


@api_view(["GET"])
def verify_user_as_teacher(request, id):
    status = request.GET.get("status")
    try:
        user = User.objects.get(id=id)

        if status == "reject":
            email_response = BaseEmail(
                subject="Teacher Verification",
                recepient=user.email,
                body="You are rejected by the admin for getting the teacher's account access",
            )

            response = email_response.send_email()
            user.delete()
            return Response({"message": "Email sent"})
        if user:
            user.is_active = True
            user.save()

            email_response = BaseEmail(
                subject="Teacher Verification",
                recepient=user.email,
                body="You are now verified as teacher and can login to your account.",
            )

            response = email_response.send_email()
            if response:
                return Response({"message": "Email sent"})
        else:
            return Response({"message": "User is not registered"})
    except Exception as error:
        return Response({"message": f"Error occurred {error}"})


@api_view(["POST"])
def verify_login(request):
    user_id = request.data.get("user_id")
    otp = request.data.get("otp")

    try:
        user = User.objects.get(id=user_id)
        verification_response = OTP.verify_otp(user, otp)

        if verification_response == Constant.CORRECT_OTP:
            response = Response({"message": Constant.CORRECT_OTP.value})
            tokens = get_tokens_for_user(user, user.role, user.email)
            set_tokens_in_cookie(response, tokens.get("access"), tokens.get("refresh"))
            user.refresh_token = tokens.get("refresh")
            user.save()
            return Response(
                {
                    "message": Constant.USER_LOGGEDIN.value,
                    "Access_Token": tokens.get("access"),
                    "Refresh_Token": tokens.get("refresh"),
                }
            )

        elif verification_response == Constant.INCORRECT_OTP:
            return Response({"message": Constant.INCORRECT_OTP.value})

        elif verification_response == Constant.EXPIRED_OTP:
            otp = OTP.generate_otp(user)
            email_verification = BaseEmail(
                subject="OTP for email verification",
                recepient=user.email,
                body=generate_mail_template(
                    mail_type=Constant.IS_STUDENT, otp=otp.otp_code
                ),
                mail_type=Constant.IS_STUDENT,
            )
            response = email_verification.send_email()
            if response:
                return Response({"message": Constant.EXPIRED_OTP.value})

    except Exception as error:
        return Response({"message": f"Error occurred {error}"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user(request):
    print(request.user)
    data = request.user
    return Response({"message": data.email})
