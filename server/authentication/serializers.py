from .models import User, Assignment
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class AssignmentSerializer(serializers.ModelSerializer):
    createdBy = UserSerializer()
    class Meta:
        model = Assignment
        fields = "__all__"
    

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
