from django.urls import path, include
from care.views.doctor import AddDoctorView

# Create your views here.
urlpatterns = [
    path("doctor/", include([
        path("create/<uuid:token>/", AddDoctorView.as_view()),
    ]))
]
