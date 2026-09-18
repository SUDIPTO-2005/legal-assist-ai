import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    """Custom user manager where email is the unique identifier for auth."""
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, username=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    """Custom User Model supporting multi-language and tailored explanation levels."""
    
    EXPLANATION_MODES = [
        ('beginner', 'Beginner (Simple Everyday Language)'),
        ('professional', 'Professional (In-depth Legal Analysis)'),
    ]

    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('hi', 'Hindi (हिंदी)'),
        ('bn', 'Bengali (বাংলা)'),
        ('es', 'Spanish (Español)'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True, db_index=True)
    full_name = models.CharField(_('full name'), max_length=255, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    profession = models.CharField(max_length=100, blank=True, help_text="e.g. Individual, Small Business, Lawyer, HR")
    organization = models.CharField(max_length=200, blank=True)
    
    preferred_language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='en')
    explanation_mode = models.CharField(max_length=20, choices=EXPLANATION_MODES, default='beginner')
    
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = CustomUserManager()

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    @property
    def display_name(self):
        return self.full_name or self.email.split('@')[0]
