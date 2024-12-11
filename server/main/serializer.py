from .models import User, Listing
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
    title = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    image = serializers.ImageField(required=True)
    price = serializers.CharField(required=True)
    category = serializers.CharField(required=True)
    time = serializers.CharField(required=False)
    creator = serializers.CharField(required=False)
    is_active = serializers.CharField(required=False)

    class Meta:
        model = Listing
        fields = [
            "id",
            "creator",
            "title", 
            "description", 
            "image", 
            "price", 
            "category", 
            "time", 
            "is_active"
        ]
