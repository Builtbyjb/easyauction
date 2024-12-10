from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("create_listing", views.create_listing, name="create_listing"),
    path("watchlists", views.watchlists, name="watchlists"),
    path("listing/<int:listing_id>", views.listing, name="listing"),
    path("category/<str:category_type>", views.category, name="category"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)