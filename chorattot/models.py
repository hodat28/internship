from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

# Create your models here.
class CreateUserForm(UserCreationForm):
  class Meta:
    model = User
    fields = ['email', 'password1', 'password2']

class UserProfile(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.email
  class Meta:
    db_table = 'user_profile'
    verbose_name = 'User Profile'
    verbose_name_plural = 'User Profiles'
    ordering = ['-created_at']

class UserLogin(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.email
  class Meta:
    db_table = 'user_login'
    verbose_name = 'User Login'
    verbose_name_plural = 'User Logins'
    ordering = ['-created_at']

class UserForgotPassword(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.email
  class Meta:
    db_table = 'user_forgot_password'
    verbose_name = 'User Forgot Password'
    verbose_name_plural = 'User Forgot Passwords'
    ordering = ['-created_at']

class UserNewPassword(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.email
  class Meta:
    db_table = 'user_new_password'
    verbose_name = 'User New Password'
    verbose_name_plural = 'User New Passwords'
    ordering = ['-created_at']

class UserChangePassword(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.email
  class Meta:
    db_table = 'user_change_password'
    verbose_name = 'User Change Password'
    verbose_name_plural = 'User Change Passwords'
    ordering = ['-created_at']

class UserLogout(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.email
  class Meta:
    db_table = 'user_logout'
    verbose_name = 'User Logout'
    verbose_name_plural = 'User Logouts'
    ordering = ['-created_at']

class UserSession(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.email
  class Meta:
    db_table = 'user_session'
    verbose_name = 'User Session'
    verbose_name_plural = 'User Sessions'
    ordering = ['-created_at']
    
class UserActivity(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.email
  class Meta:
    db_table = 'user_activity'
    verbose_name = 'User Activity'
    verbose_name_plural = 'User Activities'
    ordering = ['-created_at']
    
class UserNotification(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.email
  class Meta:
    db_table = 'user_notification'
    verbose_name = 'User Notification'
    verbose_name_plural = 'User Notifications'
    ordering = ['-created_at']
    
class UserSubscription(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return self.email
  
  class Meta:
    db_table = 'user_subscription'
    verbose_name = 'User Subscription'
    verbose_name_plural = 'User Subscriptions'
    ordering = ['-created_at']
    
class UserPayment(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  email = models.EmailField(max_length=200)
  password = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return self.email
  
  class Meta:
    db_table = 'user_payment'
    verbose_name = 'User Payment'
    verbose_name_plural = 'User Payments'
    ordering = ['-created_at']  
