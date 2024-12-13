from .models import User, Listing, Watchlist, Comment, Bid
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField( 
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())] 
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())] 
    ) 
    password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField( 
        required=True,
    )
    password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ["email", "password"]
        extra_kwargs = {"password": {"write_only": True}}


class ListingSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    image = serializers.ImageField(required=False)
    price = serializers.CharField(required=False)
    highest_bid = serializers.CharField(required=False)
    category = serializers.CharField(required=False)
    time = serializers.CharField(required=False)
    creator = serializers.CharField(required=False)
    is_active = serializers.BooleanField(required=False)

    class Meta:
        model = Listing
        fields = [
            "id",
            "creator",
            "title", 
            "description", 
            "image", 
            "price", 
            "highest_bid",
            "category", 
            "time", 
            "is_active"
        ]


class WatchlistSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(required=False)
    listing_id = serializers.IntegerField(required=False)

    class Meta:
        model = Watchlist
        fields = ["user_id", "listing_id"]


class CommentSerializer(serializers.ModelSerializer):
    listing_id = serializers.IntegerField(required=False)
    comment = serializers.CharField(required=False)
    time = serializers.CharField(required=False)
    username = serializers.CharField(required=False)

    class Meta:
        model = Comment
        fields = ["listing_id","comment", "time", "username"]

class BidSerializer(serializers.ModelSerializer):
    listing_id = serializers.IntegerField(required=False)
    user_id = serializers.IntegerField(required=False)
    bid = serializers.CharField(required=False)

    class Meta:
        model = Bid
        fields = ["listing_id","bid", "user_id"]