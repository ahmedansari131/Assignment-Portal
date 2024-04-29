from rest_framework import serializers
from authentication.serializers import UserLoginSerializer
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    createdBy = UserLoginSerializer()
    class Meta:
        model = Assignment
        fields = "__all__"
    

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
