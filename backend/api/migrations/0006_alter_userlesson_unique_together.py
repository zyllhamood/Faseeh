# Generated by Django 5.1.1 on 2024-10-09 04:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_userlesson_unique_together'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='userlesson',
            unique_together=set(),
        ),
    ]