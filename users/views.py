from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer
from .services import authenticate

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(serializer.validated_data["username"],
                                serializer.validated_data["password"])
            if user:
                return Response(user, status=status.HTTP_200_OK)
            return Response({
                        "error": "Credenciais inválidas"
                    }, 
                    status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
