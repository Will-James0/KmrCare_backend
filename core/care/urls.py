from django.urls import path, include
from care.views import dispensary, doctor

# Create your views here.
urlpatterns = [
    path("doctor/", include([
        path("list/", doctor.ListDoctorView.as_view()),
        path("list/", doctor.ListDoctorView.as_view()),
        path("create/<uuid:token>/", doctor.AddDoctorView.as_view()),
        path("delete/<uuid:token>/", doctor.DeleteDoctorView.as_view()),
        path("details/<uuid:token>/", doctor.RetrieveDctorView.as_view()),
    ])),
    
    path("dispensary/", include([
        path("list/", dispensary.DispensaryListView.as_view()),
        path("details/<uuid:token>/", dispensary.DispensaryDetailView.as_view()),
        path("update/<uuid:token>/", dispensary.UpdateDispensaryView.as_view()),
        path("delete/<uuid:token>/", dispensary.DeleteDispensaryView.as_view()),
    ]))
]
