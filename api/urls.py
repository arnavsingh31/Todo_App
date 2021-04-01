from django.urls import path
from . import views


urlpatterns = [
    path('', views.apiOverview, name="api-overview"),
    path('task-list/', views.taskList, name="task-list"),
    path('task-detail/<str:task_id>/', views.taskDetail, name="task-list"),
    path('task-create/', views.taskCreate, name="task-create"),
    path('task-update/<str:task_id>/', views.taskUpdate, name="task-update"),
    path('task-delete/<str:task_id>/', views.taskDelete, name="task-delete"),

]
