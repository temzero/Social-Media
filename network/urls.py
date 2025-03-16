
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("deletePost/<int:post_id>", views.deletePost, name="deletePost"),
    path("post", views.post, name="post"),
    path("makeFollow/<int:followed_id>/<str:type>/", views.makeFollow, name="makeFollow"),
    path("follow", views.follow, name="follow"),
    path("search", views.search, name="search"),
    path("searching", views.searching, name="searching"),
    path("comment/<int:post_id>", views.comment, name="comment"),
    path("like/<int:post_id>", views.like, name="like"),
    path("updatePost/<int:post_id>", views.updatePost, name="updatePost"),
]
