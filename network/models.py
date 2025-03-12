from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now
from datetime import timedelta


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author')
    content = models.CharField(max_length=999)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post-{self.id} User: {self.user} on {self.time.strftime('%d %b %Y %H:%M:%S')} : {self.content}"
    
    def time_ago(self):
        diff = now() - self.time
        if diff < timedelta(minutes=1):
            return "Just now"
        elif diff < timedelta(hours=1):
            return f"{int(diff.total_seconds() / 60)} minutes"
        elif diff < timedelta(days=1):
            return f"{int(diff.total_seconds() / 3600)} hours"
        elif diff < timedelta(days=7):
            return f"{diff.days} days"
        else:
            return self.time.strftime('%d %b %Y')

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liker')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='liked_post')

    def __str__(self):
        return f"{self.user} liked {self.post}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commenter')
    content = models.CharField(max_length=999)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='commented_post')
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} commented on {self.post} on {self.time.strftime('%d %b %Y %H:%M:%S')} : {self.content}"
    
    def time_ago(self):
        diff = now() - self.time
        if diff < timedelta(minutes=1):
            return "Just now"
        elif diff < timedelta(hours=1):
            return f"{int(diff.total_seconds() / 60)}m"
        elif diff < timedelta(days=1):
            return f"{int(diff.total_seconds() / 3600)}h"
        elif diff < timedelta(days=7):
            return f"{diff.days}d"
        else:
            return self.time.strftime('%d %b %Y')
        
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower')
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followed')

    def __str__(self):
        return f"{self.follower} followed {self.followed}"