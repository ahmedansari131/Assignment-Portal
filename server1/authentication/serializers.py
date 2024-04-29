from rest_framework import serializers
from authentication.models import User


class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length = 100)
    class Meta:
        model = User
        fields = ['email', 'roles']