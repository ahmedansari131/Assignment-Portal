from django.core.mail import EmailMessage, send_mail
import os
import random
from rest_framework.response import Response


def check_email_domain(email):
    domain = "@vit.edu.in"
    return email.endswith(domain)


def send_email(data):
    print("In send email function")
    try:
        print("In try")
        email = EmailMessage(
            subject=data["subject"],
            body=generate_otp_mail_template(data["otp"]),
            from_email=os.environ.get("EMAIL_FROM"),
            to=[data["to_email"]],
        )
        email.content_subtype = "html"
        email.send()
    except Exception as error:
        print("Error occurred while sending email", error)
        return Response({"message": error})


def generate_otp():
    return "".join(random.choice("0123456789") for _ in range(6))


def generate_otp_mail_template(otp):
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
                <p>This email was sent by YourApp.</p>
            </div>
        </div>
    </body>
    </html>
    """.format(
        otp
    )
    return message
