from rest_framework.views import APIView
from rest_framework.response import Response
from care.serializers import doctor
from care.models import Doctor, Dispensary, Role
from django.shortcuts import get_object_or_404
from account.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from care.permissions import IsOwner, IsOwnerOrChiefDoctor, CanDeleteDoctor
from django.contrib.auth import get_user_model
from rest_framework import generics

User = get_user_model()


class AddDoctorView(APIView):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrChiefDoctor]
    
    def post(self, request, token):
        serializer = doctor.AddDoctorSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer._validated_data
            dispensary = get_object_or_404(Dispensary, token=token)
            user_role = get_object_or_404(Role, code=data["role"])
            user = User(
                first_name = data["first_name"],
                last_name = data["last_name"],
                email = data["email"],
                username = data["username"]
            )
            user.set_password(data["password"])
            user.save()
            medecin = Doctor(
                user = user,
                dispensary = dispensary,
                role = user_role
            )
            medecin.save()
            return Response({"message": "Médecin ajouté avec succès."}, status=201)
        return Response(serializer.errors, status=400)
            

class DeleteDoctorView(generics.DestroyAPIView):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, CanDeleteDoctor]
    queryset = Doctor.objects.all()
    serializer_class = doctor.DoctorSerializer
    lookup_field = 'token'
    
    
# class UpdateDoctorView(generics.UpdateAPIView):
    
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated, CanDeleteDoctor]
#     queryset = Doctor.objects.all()
#     serializer_class = doctor.DoctorSerializer
#     lookup_field = 'token'