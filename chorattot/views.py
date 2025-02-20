from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm
from .models import *

# Create your views here.

def signup(request):
    form = CreateUserForm()
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
    context = {'form':form}
    return render(request, 'signup.html', context)

def signin(request):
    context = {}
    return render(request, 'signin.html', context)

def forgotPassword(request):
    return render(request, 'forgotPassword.html')

def newPassword(request):
    return render(request, 'newPassword.html')

def changePassword(request):
    return render(request, 'changePassword.html')