from .models import User, Listing
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField( 
        required=True,
        allow_blank=False,
        validators=[UniqueValidator(queryset=User.objects.all())] 
    )
    username = serializers.CharField(
        required=True,
        allow_blank=False,
        validators=[UniqueValidator(queryset=User.objects.all())] 
    ) 
    password = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField( 
        required=True,
        allow_blank=False,
    )
    password = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = User
        fields = ["email", "password"]
        extra_kwargs = {"password": {"write_only": True}}


class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = "__all__"
