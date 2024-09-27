from django.urls import include, path
from . import views
from .views import PasswordResetView, reset_password_confirm, send_password_reset_email
from .views import PasswordResetConfirmView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes, name='routes'),
    path('send-reset-password/', send_password_reset_email, name='send-reset-password'),
    path('reset-password-confirm/<uidb64>/<token>/', reset_password_confirm, name='reset-password-confirm'),
    # path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
        path('admin/', views.admin_view, name='admin_view'),  # Admin route
    path('employee/', views.employee_view, name='employee_view'),  # Employee route
    path('user/', views.user_view, name='user_view'),  # User route
        path('approve-user/<int:user_id>/', views.approve_user, name='approve_user'),


]
