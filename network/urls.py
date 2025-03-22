
from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_posts, name="index"),
    path("get_posts", views.get_posts, name="get_posts"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("deletePost/<int:post_id>", views.deletePost, name="deletePost"),
    path("createPost", views.createPost, name="createPost"),
    path("post/<int:post_id>", views.post, name="post"),
    path("makeFollow/<int:followed_id>/<str:type>/", views.makeFollow, name="makeFollow"),
    path("follow", views.follow, name="follow"),
    path("search", views.search, name="search"),
    path("newPost", views.newPost, name="newPost"),
    path("searching", views.searching, name="searching"),
    path("comment/<int:post_id>", views.comment, name="comment"),
    path("updateComment/<int:comment_id>", views.updateComment, name="updateComment"),
    path("deleteComment/<int:comment_id>", views.deleteComment, name="deleteComment"),
    path("like/<int:post_id>", views.like, name="like"),
    path("updatePost/<int:post_id>", views.updatePost, name="updatePost"),
    path("darkLight", views.darkLight, name="darkLight"),
]
