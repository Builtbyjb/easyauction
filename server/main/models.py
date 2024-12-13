from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

    def __str__(self) -> str:
        return f"User ID: {self.id}, Username: {self.username}"

class Listing(models.Model):
    creator_id = models.IntegerField()
    creator = models.CharField(max_length=50, null=True)
    winner_id = models.IntegerField(null=True)
    winner = models.CharField(max_length=50, null=True)
    title = models.CharField(max_length=12, null=True)
    image = models.ImageField(upload_to="", null=True)
    description = models.CharField(max_length=1000, null=True)
    price = models.CharField(max_length=10, null=True)
    highest_bid = models.CharField(max_length=10, null=True)
    category = models.CharField(max_length=20, null=True)
    time = models.CharField(max_length=50, null=True)
    is_active = models.BooleanField(max_length=10, default=True)

    def __str__(self):
        return f"Listing ID:{self.id}, User ID:{self.user_id}, Listing Title: {self.title}"

class Watchlist(models.Model):
    user_id = models.IntegerField()
    listing_id = models.IntegerField(primary_key=True)

    def __str__(self):
        return f"Listing ID: {self.listing_id}, User ID: {self.user_id}"

class Bid(models.Model):
    user_id = models.IntegerField()
    listing_id = models.IntegerField()
    bid = models.CharField(max_length=10, null=True)

    def __str__(self):
        return f"User ID: {self.user_id}, Listing ID: {self.listing_id}, Bid Amount: {self.bid}"

class Comment(models.Model):
    user_id = models.IntegerField()
    username = models.CharField(max_length=100)
    listing_id = models.IntegerField()
    comment = models.CharField(max_length=1000, null=True)
    time = models.CharField(max_length=50, null=True)

    def __str__(self):
        return f"Listing ID: {self.listing_id}, Username: {self.username}, User ID: {self.user_id}"