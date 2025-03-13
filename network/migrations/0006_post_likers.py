# Generated by Django 5.1.6 on 2025-03-13 08:45

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0005_alter_comment_content_alter_like_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='likers',
            field=models.ManyToManyField(related_name='liked_posts', through='network.Like', to=settings.AUTH_USER_MODEL),
        ),
    ]
