from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now
from datetime import timedelta
from django.core.exceptions import ValidationError


class User(AbstractUser):
    def __str__(self):
        return f"{self.username}"
    
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')

    class Meta:
        unique_together = ('follower', 'followed')  # Prevents duplicate follow

    def __str__(self):
        return f"{self.follower} followed {self.followed}"

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author')
    content = models.CharField(max_length=999)
    likers = models.ManyToManyField(User, through='Like', related_name='liked_posts')
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        likes_count = self.liked_post.count()  # Access likes via related_name
        comments_count = self.commented_post # Access comments via related_name
        return (
            f"Post-{self.id} User: {self.user} on "
            f"{self.time.strftime('%d %b %Y %H:%M:%S')} : {self.content} "
            f"(Likes: {likes_count}, Comments: {comments_count})"
        )
    
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
            return f"{diff.days}d"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liker')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='liked_post')
    
    class Meta:
        unique_together = ('user', 'post')  # Prevents duplicate likes

    def __str__(self):
        return f"{self.user} liked {self.post}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commenter')
    content = models.CharField(max_length=299)
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
        
    def clean(self):
        # Prevent empty or whitespace-only content
        if not self.content.strip():
            raise ValidationError("Comment content cannot be empty or contain only spaces.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Run model validation before saving
        super().save(*args, **kwargs)
        