from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Lesson)

admin.site.register(Mistake)
admin.site.register(UserLesson)
admin.site.register(Profile)