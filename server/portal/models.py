from django.db import models
from authentication.models import User

class Assignment(models.Model):
    title = models.CharField(max_length=50)
    # dueDate = models.DateTimeField()
    # points = models.IntegerField(null=True)
    # pdf_file = models.FileField
    subject = models.CharField(max_length=30, null=True)
    link = models.URLField(null=True)
    students = models.ManyToManyField(User, related_name="assignments", blank=True)
    createdBy = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateField(auto_now=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.createdBy.role == "teacher":
            super().save(*args, **kwargs)
        else:
            raise ValueError("Only teachers can create assignments.")
