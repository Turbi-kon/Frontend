from django.contrib import admin
from .models import User, Service, Request, RequestService

'''
user:       admin
password:   123321
mail:       admin@mail.com
'''
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')
    list_display_links = ('username',)
    search_fields = ('username', 'email')

    
    # Перевод заголовков
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Custom Fields', {'fields': ('role',)}),  # Добавьте свои поля
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'status')
    list_filter = ('status',)
    search_fields = ('name',)

    class Meta:
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'created_at', 'creator', 'moderator')
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'creator__username')

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"


@admin.register(RequestService)
class RequestServiceAdmin(admin.ModelAdmin):
    list_display = ('request', 'service')
    list_filter = ('request', 'service')

    class Meta:
        verbose_name = "Услуга в заявке"
        verbose_name_plural = "Услуги в заявках"
