import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
from requests.exceptions import SSLError, ConnectionError, Timeout
import re
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

# Tắt cảnh báo SSL
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Create your views here.
def home(request):
    token = request.session.get('token')  # Assuming the token is stored in the session
    return render(request, "home.html", {'token': token})

@csrf_exempt
def register(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()
        password = request.POST.get('password', '').strip()
        password_confirm = request.POST.get('password_confirm', '').strip()

        # ✅ 1. Kiểm tra các trường không được để trống
        if not email or not phone or not password or not password_confirm:
            messages.error(request, 'Vui lòng nhập đầy đủ thông tin.')
            return redirect('register')

        # ✅ 2. Kiểm tra định dạng email hợp lệ
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            messages.error(request, 'Email không hợp lệ.')
            return redirect('register')

        # ✅ 3. Kiểm tra các lỗi phổ biến của email
        common_mistakes = ["gnail.com", "yaho.com", "outlok.com", "hotnail.com", "gmai.com", "gamil.com", "gmai.com", "gmal.com", "gmail.con", "gmail.come", "gmail.co", "gmail.comm", "gmail.cpm", "gmail.vom", "gmail.xom", "gmailcom", "gmial.com", "gmsil.com", "gnail.com", "gns"]
        email_domain = email.split('@')[-1]
        if email_domain in common_mistakes:
            messages.error(request, "Có vẻ như bạn đã nhập sai email. Email phải có định dạng abc@example.com")
            return redirect('register')

        # ✅ 4. Kiểm tra số điện thoại hợp lệ
        phone_regex = r'^0[0-9]{8,10}$'
        if not re.match(phone_regex, phone):
            messages.error(request, 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (bắt đầu bằng 0 và có 9-11 số).')
            return redirect('register')

        # ✅ 5. Kiểm tra độ dài mật khẩu
        if len(password) < 6:
            messages.error(request, 'Mật khẩu phải có ít nhất 6 ký tự.')
            return redirect('register')

        # ✅ 6. Kiểm tra xác nhận mật khẩu
        if password != password_confirm:
            messages.error(request, 'Mật khẩu xác nhận không khớp.')
            return redirect('register')

        # ✅ 7. Gửi request API đăng ký
        try:
            response = requests.post(
                f"{settings.EXTERNAL_API_URL}/api/signup",
                json={'email': email, 'phone': phone, 'password': password},
                verify=False
            )

            data = response.json()  # Lấy dữ liệu từ phản hồi API

            if response.status_code == 201:
                messages.success(request, 'Đăng ký thành công! Vui lòng đăng nhập.')
                return redirect('login')
            else:
                error_message = data.get('error', 'Đăng ký thất bại. Vui lòng thử lại.')
                if error_message == "Email already exists":
                    error_message = "Email đã tồn tại. Vui lòng sử dụng email khác."
                elif error_message == "Đã có lỗi xảy ra":
                    error_message = "Số điện thoại đã tồn tại. Vui lòng sử dụng số điện thoại khác."
                messages.error(request, error_message)
                return redirect('register')

        except requests.exceptions.RequestException as e:
            messages.error(request, f"Lỗi kết nối đến máy chủ: {str(e)}")
            return redirect('register')

    return render(request, 'register.html')

@csrf_exempt
def login(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()

        # Kiểm tra điều kiện nhập
        if not email or not password:
            messages.error(request, 'Email và mật khẩu không được để trống.')
            return redirect('login')

        try:
            response = requests.post(
                f"{settings.EXTERNAL_API_URL}/api/login",
                json={'email': email, 'password': password},
                verify=True
            )
            
            data = response.json()  # Lấy dữ liệu JSON từ phản hồi API

            if response.status_code == 201:
                user_id = data.get('metadata', {}).get('user', {}).get('userId')  # Lấy ID từ API
                user_email = data.get('metadata', {}).get('user', {}).get('email')  # Lấy email từ API
                access_token = data.get('metadata', {}).get('token', {}).get('accessToken')  # Token

                # ✅ Lưu token vào session Django
                request.session['token'] = access_token

                # ✅ Truyền ID và email đến template để lưu vào localStorage bằng JavaScript
                response = redirect('profile')
                response.set_cookie('user_id', user_id)
                response.set_cookie('user_email', user_email)
                return response
            else:
                messages.error(request, data.get('error', 'Sai email hoặc mật khẩu.'))
                return redirect('login')

        except requests.exceptions.RequestException as e:
            messages.error(request, f"Lỗi kết nối đến máy chủ: {str(e)}")
            return redirect('login')

    return render(request, 'login.html')

def logout(request):
    # Remove the token from the session
    if 'token' in request.session:
        del request.session['token']
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

def searchPage(request):
    return render(request, "searchPage.html", {'search': request.GET.get("key")})

def profile(request):
    return render(request, "profile.html")
