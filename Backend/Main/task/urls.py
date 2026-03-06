from django.urls import path
from .views import Register, Login, Profile, TokenRefresh, LogoutView

urlpatterns = [
    path("register/", Register.as_view()),
    path("login/", Login.as_view()),
    path('logout/', LogoutView.as_view()),
    path("profile/", Profile.as_view()),
    path("refresh/", TokenRefresh.as_view())
]
