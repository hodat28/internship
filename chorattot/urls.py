from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.signup),
    path('signin/', views.signin),
    path('forgotPassword/', views.forgotPassword),
    path('newPassword/', views.newPassword),
    path('changePassword/', views.changePassword),
]