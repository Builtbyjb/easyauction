from django.contrib.auth import authenticate
from django.db import IntegrityError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from datetime import datetime
from .models import User, Listing, Watchlist, Bid, Comment
from .serializer import (
    UserRegisterSerializer, 
    UserLoginSerializer, 
    ListingSerializer,
)
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken


@api_view(['GET'])
@permission_classes([AllowAny])
def index(request):
    return render(request, "index.html")


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):

    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():

        try:
            user = User.objects.get(email=serializer.validated_data['email'])

            # Check if authentication successful
            if user.check_password(serializer.validated_data['password']):
                access = AccessToken.for_user(user)
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "success": "Login successful",
                        "refresh": str(refresh),
                        "access": str(access)
                    }, 
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": f"Invalid password"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid email"},
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        print(serializer.errors)
        return Response(
            {"error": "serializer error"},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):

    serializer = UserRegisterSerializer(data=request.data)

    if serializer.is_valid():

        try:
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
        
            access = AccessToken.for_user(user)
            refresh = RefreshToken.for_user(user)
            user.save()
            return Response(
                {
                    "success": "Registered",
                    'refresh': str(refresh),
                    'access': str(access),
                },
                status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {"error": "Username already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )

    else:
        error = ""
        try:
            serializer.errors['email']
            error = "Email is already taken"
        except KeyError:
            pass

        try:
            serializer.errors['username']
            error = "Username is already taken"
        except KeyError:
            pass

        return Response(
            {"error": error},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_listing(request):

    serializer = ListingSerializer(data=request.data)
    if serializer.is_valid():
        time = datetime.now()

        new_listing = Listing(
            title=serializer.validated_data['title'], 
            creator=request.user.username, 
            description=serializer.validated_data['description'], 
            price=serializer.validated_data['price'],
            image=serializer.validated_data['image'], 
            category=serializer.validated_data['category'],
            time=time.strftime("%B %d, %Y %I:%M %p"),
            creator_id=request.user.id,
        )

        new_listing.save()

        return Response(
            {"success": "Listing added successfully"},
            status=status.HTTP_201_CREATED
        )
    else:
        return Response(
            {"error": "Could not process the request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def listings(request):
    listings = Listing.objects.filter(is_active=True).order_by("-id")
    serialized_listings = ListingSerializer(listings, many=True).data

    return Response(
        {"listings": serialized_listings},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_listings(request):
    listings = Listing.objects.all().order_by("-id")
    serialized_listings = ListingSerializer(listings, many=True).data

    return Response(
        {"listings": serialized_listings},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def category(request, category_type):
    listings = Listing.objects.filter(category=category_type).order_by("-id")
    serialized_listings = ListingSerializer(listings, many=True).data

    return Response(
        {"listings": serialized_listings},
        status=status.HTTP_200_OK
    )


@api_view(['GET','POST'])
def watchlists(request):
    if request.method == "POST":
        add_id = request.POST.get('add to watchlist', False) # Gets listing to add
        remove_id = request.POST.get('remove from watchlist', False) # Gets listing to remove

        if add_id:
            listing = Listing.objects.get(id=add_id)
            # Store the above listing in a watchlist table
            Watchlist(title=listing.title,
                    description=listing.description,
                    bid=listing.bid,
                    image=listing.image,
                    time=listing.time,
                    listing_id=listing.id,
                    user_id= request.user.id,
                    ).save()
        
        if remove_id:
            # Removes listing from watchlist
            Watchlist.objects.get(listing_id=remove_id).delete()

            # Refresh the listing page by redirecting to the listings url, with listing id as an argument
            return Response(
                {"success": "Listing removed from watchlist"},
                status=status.HTTP_200_OK
            )

        return Response(
            {'success':'Listing added to watchlist'},
            status=status.HTTP_200_OK
        )
    else:
        listings = Watchlist.objects.filter(user_id = request.user.id)
        serialized_listings = ListingSerializer(listings, many=True).data
        return Response(
            {"listings": serialized_listings},
            status=status.HTTP_200_OK
        )


@api_view(['GET','POST'])
def listing(request, listing_id):
    watchlist_id = [] # Stores listing ids

    listing = Listing.objects.get(id=listing_id)

    # Gets the watchlist listings of the logged in user
    # Only gets the watchlist listings of the current user
    watchlists = Watchlist.objects.filter(user_id = request.user.id)

    comments = Comment.objects.filter(listing_id= listing_id)

    # Adds the ids of every listing in the watchlist to a list(watchlist_id)
    for watch_list in watchlists:
        watchlist_id.append(int(watch_list.listing_id))
        
    bids_list = [] # Stores all the bids
    bid_user = [] # Stores bid user IDs

    # Gets all the bids on the listing
    all_bids = Bid.objects.filter(listing_id = listing_id)
    
    for user_bid in all_bids:
        bids_list.append(int(user_bid.bid))
        bid_user.append(int(user_bid.user_id))

    # Sets initial values
    isCreator = False
    auction_winner = False
    highest_bid = 0

    if bids_list:
        highest_bid = max(bids_list) # Gets the highest bid

        user_highest_bid = Bid.objects.get(bid=highest_bid) # Gets user with the highest bid

         # Checks if the current logged user is the winner of the auction
        if request.user.id is None:
            pass
        else:
            if int(user_highest_bid.user_id) == int(request.user.id) and not listing.is_active:
                auction_winner = True
            else:
                auction_winner = False

    # Checks if the listing has been added to the watchlist previously
    if listing_id in watchlist_id:
        unique_listing = False
    else:
        unique_listing = True

    # Checks if the current user is the creator of the listing
    if request.user.id is None:
        pass
    else:
        if int(listing.creator_id) == int(request.user.id):
            isCreator = True
        else:
            isCreator = False
    
    if request.user.is_authenticated:
        user_authenticated = True
    else:
        user_authenticated = False

    if request.method == "POST":

        close_listing = request.POST.get("close_listing", False)
        listing_id = request.POST.get("listing_id", False)
        listing_bid = request.POST.get("listing_bid", False)
        bid = request.POST.get("bid", False)
        comment = request.POST.get("comment", False)
        time = datetime.now()

        # Stores comments
        username = User.objects.get(id=request.user.id)

        if comment is not False:    
            Comment(user_id = request.user.id,
                    user_name = username.username,
                    comment = comment,
                    listing_id = listing.id,
                    time= time.strftime("%B %d, %Y %I:%M %p")
                    ).save()

        # Closes a listing
        if close_listing == "0":
            listing.is_active = False
            listing.save()
            return Response(
                {'success': 'Listing closed'},
                status=status.HTTP_200_OK
            )

        # Stores Bids
        if bid is not False:
            try:
                if int(listing_bid) > int(bid) or int(highest_bid) >= int(bid):
                    bid_success = 0
                else:
                    if request.user.id in bid_user:
                        c_bid = Bid.objects.get(user_id=request.user.id)
                        c_bid.bid = bid
                        c_bid.save()
                    else:
                        Bid(listing_id = listing_id,
                            bid = bid,
                            user_id = request.user.id,
                            ).save()
            
                        # If a users bid is approved, automatically adds the listing to their watchlist
                        Watchlist(title=listing.title,
                                description=listing.description,
                                bid=listing.bid,
                                image=listing.image,
                                time=listing.time,
                                listing_id=listing.id,
                                user_id= request.user.id,
                                ).save()

                        print(int(bid))
                        bid_success = 1
            except:
                bid_success = 2
        else:
            bid_success = ""
        
        return Response(
            {
                "listing": listing,
                "user_authenticated": user_authenticated,
                "unique_listing": unique_listing,
                "listing_owner": User.objects.get(id=listing.user_id),
                "listing_creator": isCreator,
                "highest_bid": highest_bid,
                "number_of_bids": len(bids_list),
                "is_active": listing.is_active,
                "auction_winner": auction_winner,
                "comments": comments,
                "bid_success": bid_success,
            },
            status=status.HTTP_200_OK
        )

    else:
        serialized_listing = ListingSerializer(listing, many=False).data

        return Response(
            {
                "listing": serialized_listing,
                "user_authenticated": user_authenticated,
                "unique_listing": unique_listing,
                "isCreator": isCreator,
                "highest_bid": highest_bid,
                "number_of_bids": len(bids_list),
                "auction_winner": auction_winner,
                "comments": comments,
            },
            status=status.HTTP_200_OK
        )
    
