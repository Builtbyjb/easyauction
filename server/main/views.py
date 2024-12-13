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
    WatchlistSerializer,
    CommentSerializer,
    BidSerializer,
)
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.db import transaction


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
    listings = Listing.objects.filter(creator_id=request.user.id).order_by("-id")
    serialized_listings = ListingSerializer(listings, many=True).data

    return Response(
        {"listings": serialized_listings},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def category(request, category_type):
    listings = Listing.objects \
                    .filter(is_active=True) \
                    .filter(category=category_type) \
                    .order_by("-id")

    serialized_listings = ListingSerializer(listings, many=True).data

    return Response(
        {"listings": serialized_listings},
        status=status.HTTP_200_OK
    )


@api_view(['GET','POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def watchlists(request, listing_id=None):
    if request.method == "POST":
        serializer = WatchlistSerializer(data=request.data)

        if serializer.is_valid():
            watchlist = Watchlist(
                listing_id=serializer.validated_data["listing_id"],
                user_id=request.user.id,
            )

            watchlist.save()

            return Response(
                {'success':'Listing added to watchlist'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                serializer.errors, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    elif request.method == "DELETE":
        
        if listing_id:
            # Removes listing from watchlist
            Watchlist.objects.get(listing_id=listing_id).delete()

            # Refresh the listing page by redirecting to the listings url, with listing id as an argument
            return Response(
                {"success": "Listing removed from watchlist"},
                status=status.HTTP_200_OK
            )

    else:
        listing_ids = []
        watchlists = Watchlist.objects.filter(user_id=request.user.id)

        for watchlist in watchlists:
            listing_ids.append(watchlist.listing_id)

        listings = Listing.objects.filter(id__in=listing_ids)

        serialized_listings = ListingSerializer(listings, many=True).data
        return Response(
            {"listings": serialized_listings},
            status=status.HTTP_200_OK
        )


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def listing(request, listing_id):

    if request.method == "POST":
        serializer = ListingSerializer(data=request.data)
        if serializer.is_valid():
            listing = Listing.objects.get(id=listing_id)
            listing.is_active = serializer.validated_data['is_active']

            if serializer.validated_data['is_active'] == False:

                # Set initial values
                there_is_auction_winner = False

                try:
                    user_with_highest_bid = Bid.objects.get(bid=listing.highest_bid) 
                    user = User.objects.get(id=user_with_highest_bid.user_id)
                    listing.winner = user.username
                    listing.winner_id = user.id
                    there_is_auction_winner = True

                    return Response(
                        {
                            'success': 'Listing deactivated',
                            'auction_winner': user.username,
                            'there_is_auction_winner': there_is_auction_winner,
                            'highest_bid': str(listing.highest_bid),
                         },
                        status=status.HTTP_200_OK
                    )
                except Bid.DoesNotExist:
                    return Response(
                        {'success': 'Listing deactivated'},
                        status=status.HTTP_200_OK
                    )
                finally:
                    listing.save()
            else:
                listing.winner = None
                listing.winner_id = None
                listing.save()
                return Response(
                    {'success': 'Listing activated'},
                    status=status.HTTP_200_OK
                )
        
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    else:
        # Sets initial values
        is_creator = False
        is_auction_winner = False
        there_is_auction_winner = False
        in_watchlist = False

        watchlist_id = [] # Stores listing ids

        listing = Listing.objects.get(id=listing_id)
        watchlists = Watchlist.objects.filter(user_id = request.user.id)

        for watchlist in watchlists:
            watchlist_id.append(watchlist.listing_id)

        # Checks if the listing has been added to the watchlist
        if listing_id in watchlist_id:
            in_watchlist = True

        if listing.creator_id == request.user.id:
            is_creator = True

        if listing.winner == request.user.username:
            is_auction_winner = True

        if not listing.is_active and listing.winner is not None:
            there_is_auction_winner = True

        comments = Comment.objects.filter(listing_id= listing_id)
        serialized_listing = ListingSerializer(listing, many=False).data

        return Response(
            {
                "listing": serialized_listing,
                "in_watchlist": in_watchlist,
                "is_creator": is_creator,
                "is_auction_winner": is_auction_winner,
                "there_is_auction_winner": there_is_auction_winner,
                "comments": comments,
            },
            status=status.HTTP_200_OK
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.get(id=request.user.id)
        time = datetime.now()
        comment = Comment(
            user_id = request.user.id,
            user_name = user.username,
            comment = comment,
            listing_id = listing.id,
            time= time.strftime("%B %d, %Y %I:%M %p")
        )
        comment.save()
        return Response(
            {"success": "Comment added"},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            serializer.errors,
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@transaction.atomic
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bid(request):
    bid_user = [] # Stores bid user IDs

    serializer = BidSerializer(data=request.data)
    if serializer.is_valid():
        listing_id = serializer.validated_data['listing_id']
        current_bid = serializer.validated_data['bid']

        # Gets all the bids on the listing
        all_bids = Bid.objects.filter(listing_id=listing_id)
    
        for user_bid in all_bids:
            bid_user.append(user_bid.user_id)

        listing = Listing.objects.get(id=listing_id)
        
        '''
        The highest bid initial value is null,
        if the highest bid is null set highest to listing price,
        else the highest bid remains the same
        '''
        highest_bid = listing.highest_bid
        if not highest_bid:
            highest_bid = listing.price

        '''
        # Validate bid
        If the bid is higher than the listing price and 
        the the bid is higher than the highest bid,
        the bid is valid.
        '''
        if current_bid > highest_bid and current_bid >= listing.price:
            # Checks if the user has place a bid previously
            if request.user.id in bid_user:
                c_bid = Bid.objects \
                        .filter(user_id=request.user.id) \
                        .get(listing_id=listing_id)

                c_bid.bid = current_bid
                c_bid.save()
            else:
                bid = Bid(
                    listing_id=listing_id,
                    bid=current_bid,
                    user_id=request.user.id,
                )
                bid.save()

                '''
                If a users bid is approved, 
                automatically adds the listing to their watchlist
                '''
                watchlist = Watchlist(
                    listing_id=listing_id,
                    user_id= request.user.id,
                )
                watchlist.save()

            '''
            Save the new bid as the highest bid and
            locks the query, allowing only one request to update the table at time.
            '''
            with transaction.atomic():
                listing = Listing.objects.select_for_update().get(id=listing_id)
                listing.highest_bid = current_bid
                listing.save()

            return Response(
                {
                    "success": "Bid placed successfully",
                    "highest_bid": current_bid,
                },
                status=status.HTTP_202_ACCEPTED
            )
        else:
            return Response(
                {
                    "error": "Bid most be higher than the current bid and the starting price"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        return Response(
            serializer.errors,
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )