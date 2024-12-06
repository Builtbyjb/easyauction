from django.contrib import admin
from .models import Listing, Bid, Comment, User, Watchlist

admin.site.register(Listing)
admin.site.register(Comment)
admin.site.register(Bid)
admin.site.register(User)
admin.site.register(Watchlist)