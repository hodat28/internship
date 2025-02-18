from django.shortcuts import render

# Create your views here.

def signup(request):
    return render(request, 'signup.html')

def signin(request):
    return render(request, 'signin.html')

def forgotPassword(request):
    return render(request, 'forgotPassword.html')