from django.urls import path, include
from .views.register import *
from .views.login import *
from .views.profile import *
from .views.user import *

# Create your views here.
urlpatterns = [
    path("register/", include([
        path("user/", RegisterUserView.as_view()),
        path("owner/", RegisterOwnerView.as_view()),
        path("admin/", RegisterAdminView.as_view())
    ])),
    
    path("login/", include([
        path("user/", LoginAPIView.as_view()),
        path("admin/", AdminLoginAPIView.as_view()),
        path("doctor/", DoctorLoginAPIView.as_view())
    ])),
    
    path("request/", include([
        path("list/", RegisterOwnerView.as_view()),
        path("approve/<uuid:token>/", ApproveRegisterView.as_view()),
        path("reject/<uuid:token>/", RefuseRegisterView.as_view()),
    ])),
    
    path("profile/", include([
        path("<uuid:token>/", ProfileMixinView.as_view()),
        path("update/<uuid:token>/", ProfileMixinView.as_view)
    ])),
    
    path("user/", include([
        path("list/", ListUsersView.as_view()),
        path("details/<uuid:token>/", UserDetailView.as_view()),
        path("update/<uuid:token>/", UpdateUserView.as_view()),
        path("delete/<uuid:token>/", DeleteUserView.as_view()),
    ])),
]