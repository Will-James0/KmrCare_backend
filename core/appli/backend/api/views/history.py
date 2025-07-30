from rest_framework import generics
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from api.models import AppointmentHistory
from api.mixins import DispensaryQuerySetMixin, UserQuerySetMixin
from api.serializers import AppointmentHistorySerializer
from api.permissions import *
from account.authentication import AuthTokenAuthentication

#----------------------List----------------------------------#

class AdminHistoryListView(generics.ListAPIView):
    queryset = AppointmentHistory.objects.all()
    serializer_class = AppointmentHistorySerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]


class DispensaryHistoryListView(DispensaryQuerySetMixin, generics.ListAPIView):
    queryset = AppointmentHistory.objects.all()
    serializer_class = AppointmentHistorySerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, IsDispensaryMember]
    

class PatientHistoryListView(UserQuerySetMixin, generics.ListAPIView):
    queryset = AppointmentHistory.objects.all()
    serializer_class = AppointmentHistorySerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    
#-----------------------Details-------------------------------------#

class AdminHistoryDetailView(generics.RetrieveAPIView):
    queryset = AppointmentHistory.objects.all()
    serializer_class = AppointmentHistorySerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'token'


class DispensaryHistoryDetailView(DispensaryQuerySetMixin, generics.RetrieveAPIView):
    queryset = AppointmentHistory.objects.all()
    serializer_class = AppointmentHistorySerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, IsDispensaryMember]
    lookup_field = 'token'
    

class PatientHistoryDetailView(UserQuerySetMixin, generics.RetrieveAPIView):
    queryset = AppointmentHistory.objects.all()
    serializer_class = AppointmentHistorySerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'token'