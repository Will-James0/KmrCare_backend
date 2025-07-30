from django.urls import path, include
from .consumers import ConsultationConsumer

websocket_urlpatterns = [
    path('ws/', include([
        path('consultation/<str:token>/', ConsultationConsumer.as_asgi()),
    ]))
]