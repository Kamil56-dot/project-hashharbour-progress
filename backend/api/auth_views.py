from django.contrib.auth import get_user_model
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class EmailTokenObtainSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password', '')

        if not email or not password:
            raise serializers.ValidationError({"error": "Both email and password are required."})

        # Match user by email (case-insensitive)
        user = User.objects.filter(email__iexact=email).first()

        if user is None or not user.check_password(password):
            raise serializers.ValidationError({"error": "Invalid email address or password."})

        if not user.is_active:
            raise serializers.ValidationError({"error": "This account is inactive."})

        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }


class EmailTokenObtainPairView(APIView):
    """
    Authenticate a user using their email address and password,
    returning a pair of JSON Web Tokens (access and refresh) and basic user details.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = EmailTokenObtainSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        # Flatten error messages if possible for cleaner frontend toasts/alerts
        errors = serializer.errors
        error_msg = "Invalid credentials."
        if 'error' in errors:
            if isinstance(errors['error'], list) and len(errors['error']) > 0:
                error_msg = errors['error'][0]
            else:
                error_msg = str(errors['error'])
        elif 'email' in errors:
            error_msg = errors['email'][0] if isinstance(errors['email'], list) else str(errors['email'])
        elif 'password' in errors:
            error_msg = errors['password'][0] if isinstance(errors['password'], list) else str(errors['password'])
        
        return Response({'error': error_msg, 'details': errors}, status=status.HTTP_401_UNAUTHORIZED)
