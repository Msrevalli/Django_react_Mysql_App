from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "Welcome to the API"})

# Use DefaultRouter to automatically register the ViewSet
router = DefaultRouter()
router.register(r'todos', TodoViewSet, basename='todo')

urlpatterns = [
    path('', api_root),           # Default route for /api/
    path('', include(router.urls)), # Register ViewSet routes
]
