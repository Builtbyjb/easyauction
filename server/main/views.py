from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from datetime import datetime

from .models import User, Listing, Watchlist, Bid, Comment


def index(request):
    return render(request, "main/index.html",{
        "listings": Listing.objects.filter(is_active=True)
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "main/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "main/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "main/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "main/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "main/register.html")

def create_listings(request):
    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")
        bid = request.POST.get("bid")
        image = request.POST.get("image")
        category = request.POST.get("category")
        time = datetime.now()

        # Adds user input to the listings table
        Listing(title=title, 
                 description=description, 
                 bid=bid,
                 image=image, 
                 category=category,
                 time=time.strftime("%B %d, %Y %I:%M %p"),
                 user_id=request.user.id,
                 ).save()

        return render(request, "main/create_listings.html",{
            "message": "Listing added successfully",
        })
    else:
        return render(request, "main/create_listings.html")


def categories(request):
    if request.method == "POST":
        category = request.POST.get("category", False)

        return HttpResponseRedirect(reverse("category", args={str(category)}))

    return render(request, "main/categories.html")

def category(request, category_type):
    category = Listing.objects.filter(category=category_type)

    return render(request, "main/category.html", {
        "category": category,
        "category_type": category_type,
    })


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
            return HttpResponseRedirect(reverse("listing", args=[remove_id]))

        return HttpResponseRedirect(reverse("listing", args=[add_id]))
    else:
        watchlists = Watchlist.objects.filter(user_id = request.user.id)
        return render(request, "main/watchlists.html",{
            "watchlists": watchlists,
            "number": len(watchlists),
        })

def listing(request, listing_id):
    watchlist_id = [] # Stores listing ids

    listing = Listing.objects.get(id=listing_id)

    # Gets the watchlist listings of the logged in user
    # Only gets the watchlist listings of the current user
    watchlists = Watchlist.objects.filter(user_id = request.user.id)

    comments = Comment.objects.filter(listing_id= listing.id)

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
    listing_creator = False
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
        if int(listing.user_id) == int(request.user.id):
            listing_creator = True
        else:
            listing_creator = False
    
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
            return HttpResponseRedirect(reverse("listing", args=(str(listing.id))))

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
        
        return render(request, "main/listing.html", {
            "listing": listing,
            "user_authenticated": user_authenticated,
            "unique_listing": unique_listing,
            "listing_owner": User.objects.get(id=listing.user_id),
            "listing_creator": listing_creator,
            "highest_bid": highest_bid,
            "number_of_bids": len(bids_list),
            "is_active": listing.is_active,
            "auction_winner": auction_winner,
            "comments": comments,
            "bid_success": bid_success,
        })

    return render(request,"main/listing.html", {
        "listing": listing,
        "user_authenticated": user_authenticated,
        "unique_listing": unique_listing,
        "listing_owner": User.objects.get(id=listing.user_id),
        "listing_creator": listing_creator,
        "highest_bid": highest_bid,
        "number_of_bids": len(bids_list),
        "is_active": listing.is_active,
        "auction_winner": auction_winner,
        "comments": comments,
    })
    
