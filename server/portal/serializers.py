from rest_framework import serializers
from authentication.serializers import UserLoginSerializer
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):

    created_by_email = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = "__all__"

    def get_created_by_email(self, obj):
        return obj.createdBy.email


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
