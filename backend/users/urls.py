from django.urls import path
from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView



# OpenAPI/Swagger configuration for API documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Your API Title",
        default_version='v1',
        description="API documentation",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@yourapi.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # # Use Class-based View (CBV) for user registration
    # path('register/', views.RegisterView.as_view(), name='auth_register'),

    # Function-based View (FBV) for user registration (optional, for more control)
    path('api/register/', views.register_user, name='register_user'),

    # Password reset paths
    path('send-reset-password/', views.send_password_reset_email, name='send-reset-password'),
    path('reset-password-confirm/<uidb64>/<token>/', views.reset_password_confirm, name='reset-password-confirm'),

    # Admin, supervisor, student views
    path('admin/', views.admin_view, name='admin_view'),  # Admin route
    path('supervisor/', views.supervisor_view, name='supervisor_view'),  # Supervisor route
    path('user/', views.student_view, name='student_view'),  # Student route

    # Approve and activate user routes
    # path('approve-user/<int:user_id>/', views.approve_user, name='approve_user'),
    # path('activate-user/<int:user_id>/', views.activate_user, name='activate-user'),

    # Approve supervisors and get list of supervisors in the branch
    path('approve-supervisor/<int:user_id>/', views.approve_supervisor, name='approve_supervisor'),
    path('supervisors/', views.get_supervisors, name='get_supervisors'),
    path('delete_supervisor/<int:user_id>/', views.delete_supervisor, name='delete_supervisor'),

    # View and approve students for a supervisor
    path('students/', views.StudentListAPIView.as_view(), name='get_students'),
    path('approve-student/<int:student_id>/', views.ApproveStudentAPIView.as_view(), name='approve_student'),
    path('delete-student/<int:student_id>/', views.DeleteStudentAPIView.as_view(), name='delete_student'),


    # Organization, branch, and track routes
    path('organizations/', views.organizations_list, name='organizations'),
    path('branches/', views.branches_list, name='branches'),
    path('tracks/', views.tracks_list, name='tracks'),

    # API documentation routes (Swagger, ReDoc)
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # Roles view
    path('roles/', views.roles_view, name='roles'),

    # # Test endpoint
    # path('test/', views.testEndPoint, name='test_endpoint'),

    # Password reset related views
    path('password-reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('reset-password-confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='reset_password_confirm'),

    # # Routes view for testing
    # path('routes/', views.getRoutes, name='routes'),
    
    #Route For editProfile
    path('edit-profile/', views.EditProfileView.as_view(), name='edit-profile'),

]