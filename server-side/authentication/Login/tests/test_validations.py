from django.test import TestCase
from django.core.exceptions import ValidationError
from ..validations import validate_email, validate_password, register_validation


class ValidateCredentials(TestCase):
    def test_valid_email(self):
        email = {'email': 'neot@example.com'}
        self.assertTrue(validate_email(email))

    def test_invalid_email(self):
        email = {'email': 'neot123'}
        try:
            validate_email(email)
        except ValidationError as e:
            print(e)
            self.assertEqual(str(e), "['Check your email']")

    def test_empty_email(self):
        email = {'email': ''}
        try:
            validate_email(email)
        except ValidationError as e:
            print(e)
            self.assertEqual(str(e), "['An email is needed']")

    def test_empty_password(self):
        password = {'password': ''}
        try:
            validate_password(password)
        except ValidationError as e:
            print(e)
            self.assertEqual(str(e), "['A password is needed']")

    def test_password_length(self):
        data = {'email': 'x@example.com',
                'password': '',
                'username': 'user'}
        try:
            register_validation(data)
        except ValidationError as e:
            print(e)
            self.assertEqual(str(e), "['Minimum is 8 characters']")
