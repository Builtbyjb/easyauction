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
    path("api/v0/login", views.login_view, name="login"),
    # path("logout", views.logout_view, name="logout"),
    path("api/v0/register", views.register, name="register"),
    path("api/v0/create_listing", views.create_listing, name="create_listing"),
    # path("categories", views.categories, name="categories"),
    path("api/v0/watchlists", views.watchlists, name="watchlists"),
    path("api/v0/listing/<int:listing_id>", views.listing, name="listing"),
    path("api/v0/category/<str:category_type>", views.category, name="category"),
]