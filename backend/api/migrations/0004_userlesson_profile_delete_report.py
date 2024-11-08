# Generated by Django 5.1.1 on 2024-10-06 12:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_rename_img_link_lesson_youtube_link'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserLesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('finished', models.BooleanField(default=False)),
                ('value', models.IntegerField(default=0)),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.lesson')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userlessons', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255)),
                ('avatar', models.URLField(blank=True)),
                ('completed_exercises', models.IntegerField(default=0)),
                ('mistakes_count', models.IntegerField(default=0)),
                ('hours_learn_weekly', models.IntegerField(default=0)),
                ('done_rate', models.IntegerField(default=0)),
                ('high_outcome', models.IntegerField(default=0)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('lessons', models.ManyToManyField(blank=True, default='', to='api.userlesson')),
            ],
        ),
        migrations.DeleteModel(
            name='Report',
        ),
    ]
