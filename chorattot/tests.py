from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthenticationTests(TestCase):

    def setUp(self):
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'testpassword123'
        }

    def test_user_registration(self):
        response = self.client.post(reverse('register'), self.user_data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())

    def test_user_login(self):
        self.client.post(reverse('register'), self.user_data)
        response = self.client.post(reverse('login'), {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Đăng nhập")  # Assuming the login page contains this text

    def test_login_with_invalid_credentials(self):
        response = self.client.post(reverse('login'), {
            'email': 'wronguser@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 400)  # Assuming the login fails with a 400 status code

    def test_registration_with_existing_email(self):
        self.client.post(reverse('register'), self.user_data)
        response = self.client.post(reverse('register'), self.user_data)
        self.assertEqual(response.status_code, 400)  # Assuming the registration fails with a 400 status code