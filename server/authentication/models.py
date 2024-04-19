from django.db import models

class User(models.Model):
    email = models.EmailField()
    displayName = models.CharField(max_length=50)
    photoURL = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.email
    
class Assignment(models.Model):
    name = models.CharField(max_length=50)
    dueDate = models.DateTimeField()
    marks = models.IntegerField(null=True)
    link = models.URLField(null=True)
    students = models.ManyToManyField(User, related_name="assignments", null=True)
    createdBy = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateField(auto_now=True)

    def __str__(self):
        return self.name