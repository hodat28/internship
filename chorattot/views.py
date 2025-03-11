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
from .models import User

# Create your views here.
def home(request):
    token = request.session.get('token')  # Assuming the token is stored in the session
    return render(request, "home.html", {'token': token})

@csrf_exempt
def register(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password')
        password_confirm = request.POST.get('password_confirm')

        if not email or not phone or not password or not password_confirm:
            messages.error(request, 'Vui lòng điền đầy đủ thông tin')
            return render(request, 'register.html')

        if password != password_confirm:
            messages.error(request, 'Mật khẩu không khớp')
            return render(request, 'register.html')

        user = User.objects.create(
            email=email,
            username=email,  # Ensure username is set to a unique value, such as the email
            password=make_password(password)
        )

        # Save the phone number in the UserProfile
        UserProfile.objects.create(user=user, phone=phone)

        try:
            response = requests.post(
                f"{settings.EXTERNAL_API_URL}/api/signup",
                data={'email': user.email, 'phone': phone, 'password': password},
                verify=False  # Disable SSL verification
            )
            print(f"API response status code: {response.status_code}")
            print(f"API response content: {response.content}")
        except SSLError as e:
            print(f"SSL error occurred: {e}")
            messages.error(request, 'Đã xảy ra lỗi SSL. Vui lòng thử lại sau 5 - 10 phút nữa.')

        messages.success(request, 'Đăng ký thành công')
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
                    messages.error(request, 'Mật khẩu hoặc email không chính xác.')
            except SSLError as e:
                print(f"SSL error occurred: {e}")
                messages.error(request, 'Đã xảy ra lỗi SSL. Vui lòng thử lại sau 5 - 10 phút nữa.')
        else:
            print("form is not valid")
            messages.error(request, 'Mật khẩu hoặc email không chính xác.')
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

def profile(request):
    return render(request, 'profile.html')

def posting(request):
    return render(request, "posting.html")

def productDetail(request, product_id):
    return render(request, "productDetail.html", {'product_id': product_id})

def filterProduct(request, category_name):
    return render(request, "filterPage.html", {'category_name': category_name})
