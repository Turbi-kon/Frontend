from django.shortcuts import render, redirect, get_object_or_404
from django.db import connection
from django.core.cache import cache
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth import authenticate, login, logout
from .models import Service, Request, RequestService, Draft
from .serializers import ServiceSerializer, RequestSerializer, UserSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from .permissions import IsModerator
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
import requests
import json

from django.http import HttpResponse


CREATOR_ID = 1
MODERATOR_ID = 2


class ServiceListView(APIView):
    def get(self, request):
        name_query = request.query_params.get('name', '')  
        max_price = request.query_params.get('maxPrice', None)  
        min_price = request.query_params.get('minPrice', None)  


        services = Service.objects.all()


        if name_query:
            services = services.filter(name__icontains=name_query)


        if max_price is not None:
            try:
                max_price = float(max_price)
                services = services.filter(price__lte=max_price)
            except ValueError:
                pass

        if min_price is not None:
            try:
                min_price = float(min_price)
                services = services.filter(price__gte=min_price)
            except ValueError:
                pass

        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

class ServiceDetailView(APIView):
    def get(self, request, pk):
        service = get_object_or_404(Service, pk=pk)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    def put(self, request, pk):
        service = get_object_or_404(Service, pk=pk)
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        service = get_object_or_404(Service, pk=pk)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        

class RequestListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"User: {request.user}, Role: {request.user.role}")
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)
        
        if request.user.role == 'moderator':
            requests = Request.objects.all()
        else:
            requests = Request.objects.filter(creator=request.user)
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)

@method_decorator(csrf_exempt, name='dispatch')   
class CompleteRequestView(APIView):
    permission_classes = [IsAuthenticated, IsModerator]

    def put(self, request, pk):
        req = Request.objects.get(pk=pk)
        req.status = 'completed'
        req.save()
        return Response({'message': 'Заявка завершена'})

class RequestDetailView(APIView):
    def get(self, request, pk):
        req = get_object_or_404(Request, pk=pk)
        serializer = RequestSerializer(req)
        return Response(serializer.data)

    def put(self, request, pk):
        req = get_object_or_404(Request, pk=pk)
        if req.status == 'draft' and request.data.get('action') == 'form':
            req.status = 'formed'
            req.formed_at = timezone.now()
            req.save()
            return Response({'message': 'Заявка успешно создана'})
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

class AddServiceToRequestView(APIView):
    def post(self, request, request_id, service_id):
        req = Request.objects.get_or_create(
            id=request_id,
            defaults={
                'status': 'draft',
                'creator_id': CREATOR_ID,
                'created_at': timezone.now()
            }
        )[0]
        service = get_object_or_404(Service, pk=service_id)
        RequestService.objects.create(request=req, service=service)
        return Response({'message': 'Услуга добавлена в заявку'})



class RequestDeleteView(APIView):
    def delete(self, request, pk):
        req = get_object_or_404(Request, pk=pk)
        req.status = 'deleted'
        req.save()
        return Response({'message': 'Заявка успешно удаленна'})
    
class RemoveServiceFromRequestView(APIView):
    def delete(self, request, pk):
        request_service = get_object_or_404(RequestService, pk=pk)
        request_service.delete()
        return Response({'message': 'Услуга удалена из заявки'})
    
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data['password'])
            user.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={200: "{'refresh': 'token', 'access': 'token'}"}
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        print(f"User {user.username} succsesfully authorized with token {str(refresh.access_token)}")
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    


class DraftView(View):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Подтверждение черновика: создаёт заявку с услугами из конструктора
        """
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)

        if not user:
            return JsonResponse({'error': 'Не удалось аутентифицировать пользователя'}, status=403)

        try:
            data = json.loads(request.body)
            services = data.get('services', [])
            if not services:
                return JsonResponse({'error': 'Нет услуг в черновике'}, status=400)

            # Создаем заявку (черновик)
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO shop_request (creator_id, status, created_at)
                    VALUES (%s, 'draft', NOW())
                    RETURNING id
                """, [user.id])
                request_id = cursor.fetchone()[0]

            # Добавляем услуги в заявку
            with connection.cursor() as cursor:
                for service in services:
                    cursor.execute("""
                        INSERT INTO shop_requestservice (request_id, service_id, quantity)
                        VALUES (%s, %s, %s)
                    """, [request_id, service['id'], service['quantity']])

            return JsonResponse({'message': 'Черновик создан!', 'request_id': request_id})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


    
def glasses_list(request):
    api_url = "http://localhost:8000/api/services/"
    
    query = request.GET.get('query', '')
    
    if query:
        api_url += f"?name={query}"
    
    response = requests.get(api_url)
    
    if response.status_code == 200:
        services = response.json()
    else:
        services = []
    
    return render(request, 'shop/glasses_list.html', {
        'services': services,
        'query': query
    })

def glasses_detail(request, pk):
    api_url = f"http://localhost:8000/api/services/{pk}/"
    response = requests.get(api_url)
    if response.status_code == 200:
        service = response.json()
    else:
        service = None
    return render(request, 'shop/glasses_detail.html', {'service': service})

ASYNC_SERVICE_URL = 'http://localhost:8082/perform-task'  # URL асинхронного сервиса


SECRET_KEY = '11223344'

@csrf_exempt
def perform_async_task(request, request_id):
    if request.method == 'POST':
        # Проверка авторизационного ключа
        auth_key = request.headers.get('Authorization')
        if auth_key != SECRET_KEY:
            return JsonResponse({"error": "Unauthorized"}, status=403)

        # Получаем заявку из БД
        req = get_object_or_404(Request, id=request_id)

        # Запрос к асинхронному сервису
        response = requests.post(ASYNC_SERVICE_URL)
        
        if response.status_code == 200:
            result = response.json()
            success = result.get("success", False)

            # Обновляем статус заявки в зависимости от результата
            if success:
                req.status = 'formed'  # Если успешно, заявка завершена
            else:
                req.status = 'rejected'   # Если ошибка, заявка отклонена
            
            req.save()  # Сохраняем изменения

            return JsonResponse({"message": "Request updated", "status": req.status}, status=200)
        
        return JsonResponse({"error": "Failed to get response from async service"}, status=500)

    return JsonResponse({"error": "Invalid method"}, status=400)