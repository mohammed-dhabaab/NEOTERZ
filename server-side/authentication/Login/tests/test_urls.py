from django.test import SimpleTestCase
from django.urls import reverse, resolve

from ..views import *



class TestUrls(SimpleTestCase):

    def test_register_url_is_resolved(self):
        url = reverse('register')
        resolved_func = resolve(url).func
        expected_func = UserRegister.as_view()
        print(resolve(url),"---<")
        self.assertEqual(resolved_func.__name__, expected_func.__name__)

    def test_login_url_is_resolved(self):
        url = reverse('login')
        resolved_func = resolve(url).func
        expected_func = UserLogin.as_view()
        print(resolve(url), "---<")
        self.assertEqual(resolved_func.__name__, expected_func.__name__)

    def test_logout_url_is_resolved(self):
        url = reverse('logout')
        resolved_func = resolve(url).func
        expected_func = UserLogout.as_view()
        print(resolve(url), "---<")
        self.assertEqual(resolved_func.__name__, expected_func.__name__)

    def test_user_url_is_resolved(self):
        url = reverse('user')
        resolved_func = resolve(url).func
        expected_func = UserView.as_view()
        print(resolve(url), "---<")
        self.assertEqual(resolved_func.__name__, expected_func.__name__)