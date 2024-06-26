from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


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
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

    MY_CHOICES = [
        (ADMIN, "Option 1"),
        (TEACHER, "Option 2"),
        (STUDENT, "Option 3"),
    ]

    email = models.EmailField(
        verbose_name="Email",
        max_length=100,
        unique=True,
    )
    name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    # is_admin = models.BooleanField(default=False)
    roles = models.CharField(max_length=10, choices=MY_CHOICES)
    otp = models.CharField(max_length=10, default=None)
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
