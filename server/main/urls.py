from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_listings", views.create_listings, name="create_listings"),
    path("categories", views.categories, name="categories"),
    path("watchlists", views.watchlists, name="watchlists"),
    path("<int:listing_id>", views.listing, name="listing"),
    path("category/<str:category_type>", views.category, name="category"),
]