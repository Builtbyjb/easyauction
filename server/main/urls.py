from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    # path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_listings", views.create_listings, name="create_listings"),
    # path("categories", views.categories, name="categories"),
    path("watchlists", views.watchlists, name="watchlists"),
    path("<int:listing_id>", views.listing, name="listing"),
    path("category/<str:category_type>", views.category, name="category"),
]