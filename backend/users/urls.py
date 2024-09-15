# users/urls.py

from django.urls import path
from .views import UserRegistrationView, ActivateAccountView

from .views import ProtectedView

from django.contrib.auth import views as auth_views


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

from .views import LogoutView


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate_account'),
       # JWT Token endpoints
      # Login (Obtain JWT token)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Token refresh
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Logout (Blacklist token - optional)
    path('api/token/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
     path('api/protected/', ProtectedView.as_view(), name='protected'),

        # Password reset
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    
    # Password change (for logged-in users)
    path('password_change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),

    path('api/logout/', LogoutView.as_view(), name='logout'),
]
