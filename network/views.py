from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse

from .models import User, Post, Follow, Comment, Like


def index(request):
    if request.method == 'GET':
        posts = Post.objects.all().order_by('-time')  # Reverse order by default
        # comments_by_post = {post.id: post.commented_post.all() for post in posts} 

        return render(request, "network/index.html", {
            'posts': posts,
        })

def post(request):
    if request.method == 'POST':
        content = request.POST.get('content', '')  # Use .get() to avoid errors if 'content' is missing
        user = request.user  # No need to query User again, request.user is already the object

        if content:  # Ensure content is not empty
            post = Post(content=content, user=user)
            post.save()
        
         # Redirect to the previous page (refresh effect)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', request.path))

    # Handle GET requests properly
    return redirect('index')  # Redirect GET requests to the index page

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def profile(request, user_id):
    user = User.objects.get(pk=user_id)
    posts = Post.objects.filter(user=user).order_by('id').reverse()
    followed = Follow.objects.filter(follower=user)
    followers = Follow.objects.filter(followed=user)

    return render(request, "network/profile.html", {
        'profileUser': user,
        'posts': posts,
        'followed': followed,
        'followers': followers
    })

def follow(request):
    pass

def makeFollow(request, follower_id, type):
    if type == 'follow':
        follower = User.objects.get(pk=follower_id)
        followed = request.user
        if follower != followed:
            follow = Follow(follower=follower, followed=followed)
            follow.save()
    elif type == 'unfollow':
        follow = Follow.objects.get(follower=follower_id, followed=request.user)
        follow.delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', request.path))
    
def deletePost(request, post_id):
    post = Post.objects.get(pk=post_id)
    if request.user == post.user:
        post.delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', request.path))

def comment(request, post_id):
    if request.method == 'POST':
        content = request.POST.get('content', '')
        user = request.user

        if content and post_id:
            post = Post.objects.get(pk=post_id)
            comment = Comment(content=content, user=user, post=post)
            comment.save()

        return HttpResponseRedirect(request.META.get('HTTP_REFERER', request.path))
    
    return redirect('index')  # Redirect GET requests to the index page

def like(request, post_id):
    if request.method == 'POST':
        user = request.user
        isLiked = Like.objects.filter(user=user, post=post_id)
        
        if isLiked:
            isLiked.delete()
            return HttpResponseRedirect(request.META.get('HTTP_REFERER', request.path))
        else:
            post = Post.objects.get(pk=post_id)
            like = Like(user=user, post=post)
            like.save()

        return HttpResponseRedirect(request.META.get('HTTP_REFERER', request.path))
    
    return redirect('index')  # Redirect GET requests to the index page

def updatePost(request, post_id):
    if request.method == 'POST':
        content = request.POST.get('content', '')
        post = Post.objects.get(pk=post_id)

        if request.user == post.user:
            post.content = content
            post.save()

        return HttpResponseRedirect(request.META.get('HTTP_REFERER', request.path))
    