from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
UserModel = get_user_model()

def register_validation(data):
    email = data['email'].strip()
    username = data['username'].strip()
    password = data['password'].strip()

    if not email or UserModel.objects.filter(email=email).exists():
        raise ValidationError('Email is already exists')

    if not password or len(password) < 8:
        raise ValidationError('Minimum is 8 characters')

    if not username:
        raise ValidationError('Type another username')
    return data


def validate_email(data):
    email = data['email'].strip()
    check_com = email.split(".")
    check_at = email.split("@")
    if not email:
        raise ValidationError('An email is needed')
    elif len(check_com) != 2 and len(check_at) != 2:
        raise ValidationError('Check your email')
    return True

def validate_username(data):
    username = data['username'].strip()
    if not username:
        raise ValidationError('Choose another username')
    return True

def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError('A password is needed')
    return True