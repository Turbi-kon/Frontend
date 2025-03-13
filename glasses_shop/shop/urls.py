from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ServiceListView, ServiceDetailView,
    RequestListView, RequestDetailView,
    AddServiceToRequestView, LoginView, CompleteRequestView,
    RegisterView, DraftView, perform_async_task,
    glasses_list, glasses_detail,
)

urlpatterns = [
    path('api/services/', ServiceListView.as_view(), name='service-list'),
    path('api/services/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('api/requests/', RequestListView.as_view(), name='request-list'),
    path('api/requests/<int:pk>/', RequestDetailView.as_view(), name='request-detail'),
    path('api/requests/<int:request_id>/add-service/<int:service_id>/', AddServiceToRequestView.as_view(), name='add-service-to-request'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/requests/<int:pk>/complete/', CompleteRequestView.as_view(), name='complete_request'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/draft/submit/', DraftView.as_view(), name='submit_draft'),
    path('perform-async-task/<int:request_id>/', perform_async_task, name='perform_async_task'),


    path('', glasses_list, name='glasses-list'),
    path('glasses/<int:pk>/', glasses_detail, name='glasses-detail'),
]