from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .serializers import Registration, Taskserializer
from .models import Task

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, AllowAny


from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


# Create your views here.

class Register(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        data = request.data
        serializer = Registration(data = data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "User created successfully",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class Login(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        
        data = request.data
        # Extract values safely
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Logged in successfully",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)

        return Response({"error": "invalid credentials bro!"}, status=status.HTTP_401_UNAUTHORIZED)



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get the refresh token from the request body
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            
            # Blacklist the token so it can never be used again
            token.blacklist()

            return Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)   

            
                

class Profile(APIView):
    serializer_classes = Taskserializer
    permission_classes = [IsAuthenticated]
    
    # This MUST be indented (4 spaces) to be inside the class
    def get(self, request):
        username = request.user
        tasks_all = Task.objects.filter(user=username)
        serializer = Taskserializer(tasks_all, many=True)
        return Response({
            "username": username.username, 
            "tasks": serializer.data # Changed key to "tasks" to match common practice
        }, status=status.HTTP_200_OK)

    def post(self, request):
        username = request.user
        serializer = Taskserializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=username)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = request.data
        try:
            task_id = data.get("id")
            obj = Task.objects.get(id=task_id, user=request.user)
            serializer = Taskserializer(obj, data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        data = request.data
        try:
            task_id = data.get("id")
            obj = Task.objects.get(id=task_id, user=request.user)
            serializer = Taskserializer(obj, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        data = request.data
        try:
            task_id = data.get("id")
            obj = Task.objects.get(id=task_id, user=request.user)
            obj.delete()
            return Response({"message": "task deleted"}, status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)



class TokenRefresh(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Refresh token required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            new_access_token = str(token.access_token)

            return Response(
                {"access": new_access_token},
                status=status.HTTP_200_OK
            )

        except TokenError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception:
            return Response(
                {"error": "Unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



