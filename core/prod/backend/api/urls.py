from django.urls import path, include
from api.views import *

urlpatterns = [
    path("admin/", include([
        path("appointment/", include([
            path("list/", AdminAppointmentListView.as_view()),
            path("details/<uuid:token>/", AdminAppointmentDetailView.as_view()),
        ])),
        
        path("history/", include([
            path("list/", AdminHistoryListView.as_view()),
            path("details/<uuid:token>/", AdminHistoryDetailView.as_view()),
        ])),
    ])),

    path("dispensary/", include([
        path("appointment/", include([
            path("list/", DispensaryAppointmentListView.as_view()),
            path("details/<uuid:token>/", DispensaryAppointmentDetailView.as_view()),
            path("confirm/<uuid:token>/", ConfirmAppointmentView.as_view()),
            path("reject/<uuid:token>/", RejectAppointmentView.as_view()),
            path("cancel/<uuid:token>/", DispensaryCancelAppointmentView.as_view()),
            path("start/<uuid:token>/", StartAppointmentView.as_view()),   # 🚀 Début
            path("end/<uuid:token>/", EndAppointmentView.as_view()),       # ✅ Fin
        ])),
        
        path("history/", include([
            path("list/", DispensaryHistoryListView.as_view()),
            path("details/<uuid:token>/", DispensaryHistoryDetailView.as_view()),
        ])),
    ])),

    path("patient/", include([
        path("appointment/", include([
            path("list/", PatientAppointmentListView.as_view()),
            path("details/<uuid:token>/", PatientAppointmentDetailView.as_view()),
            path("make/", MakeAnAppointmentView.as_view()),
            path("update/<uuid:token>/", UpdateAppointmentView.as_view()),
            path("cancel/<uuid:token>/", CancelAppointmentView.as_view()),
        ])),
        
        path("history/", include([
            path("list/", PatientHistoryListView.as_view()),
            path("details/<uuid:token>/", PatientHistoryDetailView.as_view()),
        ])),
    ])),
]
