from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm
from .models import *

# Create your views here.
def home(request):
  return render(request, "home.html")

def login(request):
    form = CreateUserForm()
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
    context = {'form':form}
    return render(request, 'login.html', context)

def register(request):
    context = {}
    return render(request, 'register.html', context)

def forgotPassword(request):
    return render(request, 'forgotPassword.html')

def newPassword(request):
    return render(request, 'newPassword.html')

def changePassword(request):
    return render(request, 'changePassword.html')

def posting(request):
    return render(request, "posting.html")

def profile(request):
    return render(request, "profile.html")

def productDetail(request, product_id):
    return render(request, "productDetail.html", {'product_id': product_id})
