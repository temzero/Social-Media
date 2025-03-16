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
    
def follow(request):
    if request.method == 'GET':
        followed = Follow.objects.filter(follower=request.user)
        followed_users = [follow.followed for follow in followed]
        print("Followed Users:", followed_users) 
        posts = Post.objects.filter(user__in=followed_users).order_by('-time')

        return render(request, "network/index.html", {
            'posts': posts,
            'title': 'Following'
        })
    
def search(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')
        users = User.objects.filter(username__icontains=query)
        posts = Post.objects.filter(content__icontains=query).order_by('-time')

        if not users and not posts:
            return render(request, "network/search.html", {
                'message': f'No results found for "{query}"'
            })

        return render(request, "network/search.html", {
            # 'posts': posts,
            # 'users': users,
        })
    
def searching(request):  
    if request.method == 'GET':
        query = request.GET.get('q', '')
        print("Query:", query)
        users = User.objects.filter(username__icontains=query)

        if not users:
            return render(request, "network/search.html", {
                'message': f'No results found for "{query}"'
            })

        return render(request, "network/search.html", {
            'users': users,
        })
    
def newPost(request):  
    if request.method == 'GET':
        return render(request, "network/newPost.html",)

def post(request):
    if request.method == 'POST':
        content = request.POST.get('content', '')  # Use .get() to avoid errors if 'content' is missing
        user = request.user  # No need to query User again, request.user is already the object

        if content:  # Ensure content is not empty
            post = Post(content=content, user=user)
            post.save()
        
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
                "message": "Invalid username or password"
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
    profileUser = User.objects.get(pk=user_id)
    
    # Get users this profile is following
    following_users = User.objects.filter(followers__follower=profileUser)
    
    # Get users who follow this profile
    follower_users = User.objects.filter(following__followed=profileUser)

    # Get posts by this user
    posts = Post.objects.filter(user=profileUser).order_by('-time')

    return render(request, "network/profile.html", {
        "profileUser": profileUser,
        "following_users": following_users,
        "follower_users": follower_users,
        "posts": posts
    })

def makeFollow(request, followed_id, type):
    if type == 'follow':
        followed = User.objects.get(pk=followed_id)
        follower = request.user
        if follower != followed:
            follow = Follow(follower=follower, followed=followed)
            follow.save()
    elif type == 'unfollow':
        follow = Follow.objects.get(follower=request.user, followed=followed_id)
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
    
def darkLight(request): 
    pass