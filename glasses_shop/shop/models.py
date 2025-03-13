from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password

class User(AbstractUser):
    ROLE_CHOICES = [
        ('guest', 'Guest'),
        ('creator', 'Creator'),
        ('moderator', 'Moderator'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='guest')

    password = models.CharField(max_length=128, default=make_password("12344321"))

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='shop_users',
        related_query_name='shop_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='shop_users_permissions',
        related_query_name='shop_user_permission',
    )

class Service(models.Model):
    STATUS_CHOICES = [
        ('active', 'Активен'),
        ('deleted', 'Удалён'),
    ]
    name = models.CharField(max_length=255, verbose_name="Название услуги")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    image = models.ImageField(upload_to='static/images/')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active', verbose_name="Статус")

    class Meta:
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"

    def __str__(self):
        return self.name

class Request(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('formed', 'Сформирован'),
        ('completed', 'Завершён'),
        ('rejected', 'Отклонён'),
        ('deleted', 'Удалён'),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, verbose_name="Статус")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    formed_at = models.DateTimeField(null=True, blank=True, verbose_name="Дата формирования")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Дата завершения")
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_requests', verbose_name="Создатель")
    moderator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='moderated_requests', null=True, blank=True, verbose_name="Модератор")
    services = models.ManyToManyField(
        Service,
        through='RequestService',
        related_name='requests'
    )

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self):
        return f"Заявка {self.id} ({self.status})"

class RequestService(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, verbose_name="Заявка")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, verbose_name="Услуга")
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = "Услуга в заявке"
        verbose_name_plural = "Услуги в заявках"
        unique_together = ('request', 'service')

    def __str__(self):
        return f"{self.request} - {self.service}"


class Draft(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='draft')
    services = models.ManyToManyField(Service, through='DraftService', blank=True)

    def __str__(self):
        return f"Черновик пользователя {self.user.username}"


class DraftService(models.Model):
    draft = models.ForeignKey(Draft, on_delete=models.CASCADE, related_name='draft_services')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.service.name} (x{self.quantity}) в черновике"