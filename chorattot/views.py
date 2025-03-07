import requests
from requests.exceptions import SSLError
import json
from .models import *
from django.shortcuts import render, redirect
from chorattot.authentication.forms import UserRegistrationForm, UserLoginForm
from django.contrib import messages
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password


# Create your views here.
def home(request):
    token = request.session.get('token')  # Assuming the token is stored in the session
    return render(request, "home.html", {'token': token})

@csrf_exempt
def register(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 != password2:
            messages.error(request, 'Passwords do not match')
            return render(request, 'register.html')

        if not email or not phone or not password1:
            messages.error(request, 'Missing required fields')
            return render(request, 'register.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists')
            return render(request, 'register.html')

        user = User.objects.create(
            email=email,
            username=email,  # Assuming username is the same as email
            password=make_password(password1)
        )

        messages.success(request, 'User registered successfully')
        return redirect('login')
    else:
        return render(request, 'register.html')

def login(request):
    if request.method == 'POST':
        form = UserLoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            print(f"Attempting to authenticate user with email: {email} and password: {password}")
            
            try:
                # Send a request to the external API
                response = requests.post(
                    f"{settings.EXTERNAL_API_URL}/api/login",
                    data={'email': email, 'password': password},
                    verify=False  # Disable SSL verification
                )
                
                print(f"API response status code: {response.status_code}")
                print(f"API response content: {response.content}")
                
                if response.status_code == 201:
                    # Assuming the API returns a JSON response with user data
                    user_data = response.json()
                    print("user is authenticated")
                    
                    # Store the token in the session
                    request.session['token'] = user_data['metadata']['token']['accessToken']
                    
                    return redirect('home')
                else:
                    print("user is none, invalid email or password")
                    messages.error(request, 'Invalid email or password.')
            except SSLError as e:
                print(f"SSL error occurred: {e}")
                messages.error(request, 'An SSL error occurred while trying to authenticate. Please try again later.')
        else:
            print("form is not valid")
            messages.error(request, 'Invalid email or password.')
    else:
        form = UserLoginForm()
    return render(request, 'login.html', {'form': form})

def logout(request):
    # Remove the token from the session
    if 'token' in request.session:
        del request.session['token']
    auth_logout(request)
    return redirect('home')

def forgotPassword(request):
    return render(request, 'forgotPassword.html')

def newPassword(request):
    return render(request, 'newPassword.html')

def changePassword(request):
    return render(request, 'changePassword.html')


def posting(request):
    return render(request, "posting.html")
