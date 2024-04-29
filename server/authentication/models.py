from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from datetime import timedelta
import random
from django.utils import timezone
from constants import Constant


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError("User must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email,
            password=password,
            name=name,
        )
        user.is_admin = True
        user.is_active = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

    MY_CHOICES = [
        (ADMIN, "Admin"),
        (TEACHER, "Teacher"),
        (STUDENT, "Student"),
    ]

    email = models.EmailField(
        verbose_name="Email",
        max_length=100,
        unique=True,
    )
    name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    role = models.CharField(max_length=10, choices=MY_CHOICES)
    refresh_token = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


class OTP(models.Model):
    otp_code = models.CharField(max_length=6)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_at = models.DateTimeField()

    @classmethod
    def generate_otp(cls, user):
        otp_code = "".join(random.choice("0123456789") for _ in range(6))
        expiry_at = timezone.now() + timedelta(minutes=5)

        otp = cls.objects.create(
            otp_code=otp_code, user=user, expiry_at=expiry_at
        )
        return otp

    @staticmethod
    def verify_otp(user, otp_code):
        otp = OTP.objects.filter(user=user).order_by("-created_at").first()

        if otp:
            if otp.otp_code != otp_code:
                return Constant.INCORRECT_OTP
            elif otp.otp_code == otp_code and otp.expiry_at > timezone.now():
                return Constant.CORRECT_OTP
            elif otp.expiry_at <= timezone.now():
                return Constant.EXPIRED_OTP
