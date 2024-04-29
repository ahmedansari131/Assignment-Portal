from django.core.mail import EmailMessage
import os
from rest_framework.response import Response
from django.conf import settings
from constants import Constant


def check_email_domain(email):
    domain = "@vit.edu.in"
    return email.endswith(domain)


class BaseEmail:
    def __init__(
        self,
        recepient,
        subject,
        body,
        sender=os.environ.get("ADMIN_EMAIL"),
        mail_type=None,
    ):
        self.type = mail_type
        self.sender = sender
        self.recepient = recepient
        self.subject = subject
        self.body = body

    def send_email(self):
        try:
            print("Email: ", self.sender, "Recepient: ", self.recepient)
            email = EmailMessage(
                subject=self.subject,
                body=self.body,
                from_email=self.sender,
                to=[self.recepient],
            )
            email.content_subtype = "html"
            email.send()
            return True
        except Exception as error:
            print("Error occurred while sending email", error)
            return Response({"Error occurred while sending email -> ": error})


def generate_mail_template(mail_type, otp=None, verify_link=None, reject_link=None):
    if mail_type == Constant.IS_STUDENT:
        message = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Email</title>
            
        </head>
        <body>
            <div class="container">
                <h2>Your OTP Code:</h2>
                <p>Your OTP code is: <span class="otp-code">{}</span></p>
                <p>Please use this code to verify your identity.</p>
                <p>If you didn't request this OTP, please ignore this email.</p>
                <div class="footer">
                    <p>This email was sent by Assignment Portal.</p>
                </div>
            </div>
        </body>
        </html>
        """.format(
            otp
        )

    elif mail_type == Constant.IS_TEACHING_STAFF.value:
        message = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Teacher Verification by Admin</title>
            
        </head>
        <body>
            <div class="container">
                <h2>Verify the user as Teaching Staff</h2>
                <p>Click on the below button to verify the user as <strong>teaching staff</strong></span></p>
                <a href="{}"><button>Verify</button></a>
                <a href="{}"><button>Reject</button></a>
                <p>If you don't want to verify, please ignore this email.</p>
                <div class="footer">
                    <p>This email was sent by Assignment Portal.</p>
                </div>
            </div>
        </body>
        </html>
        """.format(
            verify_link, reject_link
        )
    elif mail_type == Constant.VERIFY_EMAIL:
        message = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Email</title>
            
        </head>
        <body>
            <div class="container">
                <h2>Your OTP Code:</h2>
                <p>Your OTP code is: <span class="otp-code">{}</span></p>
                <p>Please use this code to verify your identity.</p>
                <p>If you didn't request this OTP, please ignore this email.</p>
                <div class="footer">
                    <p>This email was sent by Assignment Portal.</p>
                </div>
            </div>
        </body>
        </html>
        """.format(
            otp
        )
    return message


def set_tokens_in_cookie(response, access_token, refresh_token):
    try:
        response.set_cookie(
            key="ACCESS",
            value=access_token,
            expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
            httponly=True,
            domain="localhost",
            path="/",
        )
        response.set_cookie(
            key="REFRESH",
            value=refresh_token,
            expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
            httponly=True,
            domain="localhost",
            path="/",
        )
        return response
    except Exception as error:
        return f"Error occurred while setting the tokens in cookie -> {error}"
