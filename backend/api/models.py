from django.db import models
from django.contrib.auth.models import User
# Create your models here.
#colors = #22078a #084f4d #7b9e19 #3d0c6e
class Lesson(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    youtube_link = models.URLField(blank=True)
    minutes = models.IntegerField(default=0)
    transcript = models.TextField(blank=True)
    def __str__(self):
        return self.title



class Mistake(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mistakes')
    text = models.TextField(blank=True)

class UserLesson(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userlessons')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    finished = models.BooleanField(default=False)
    value = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.user} - {self.lesson}"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    lessons = models.ManyToManyField(UserLesson,blank=True, default="")
    avatar = models.URLField(blank=True,default='')

    completed_exercises = models.IntegerField(default=0,blank=True)
    mistakes_count = models.IntegerField(default=0,blank=True)
    hours_learn_weekly = models.IntegerField(default=0,blank=True)
    done_rate = models.IntegerField(default=0,blank=True)
    high_outcome = models.IntegerField(default=0,blank=True)

    def __str__(self):
        return self.user.username

class Summary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='summaries')
    title = models.CharField(max_length=50)
    result = models.CharField(max_length=10)
    data = models.JSONField()

    def __str__(self):
        return f"{self.user} - {self.title}"