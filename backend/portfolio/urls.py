from django.urls import path
from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# OpenAPI/Swagger configuration for API documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Your API Title",
        default_version='v1',
        description="API documentation for Portfolio Endpoints",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@yourapi.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('student-leetcode/<int:student_id>/', views.get_leetcode_data, name='get_leetcode_data'),
    path('student-portfolio/<int:student_id>/', views.get_student_portfolio, name='get_student_portfolio'),
    path('student-github/<int:student_id>/', views.get_github_username, name='get_github_username'),

    # Swagger documentation route
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
