from .models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField( 
        validators=[UniqueValidator(queryset=User.objects.all())] 
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())] 
    ) 

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}
