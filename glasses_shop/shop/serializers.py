from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import Service, Request, RequestService, User
from .utils import get_presigned_url
from django.conf import settings

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'price', 'image', 'status']

        def get_image(self, obj):
            if obj.image:
                return f"{settings.STATIC_URL}{obj.image}"
            return None

class RequestSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = ['id', 'status', 'created_at', 'formed_at', 'completed_at', 'services']

    def get_services(self, obj):
        return ServiceSerializer(obj.services.all(), many=True).data

class RequestServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestService
        fields = ['request', 'service']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Неверные даныне")
    
    
