import { useParams } from "react-router";
// import { Clock, DollarSign, User, Tag, Calendar } from "lucide-react";
import { DollarSign, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { URL_FIX } from "@/lib/constants";
// import { v4 as uuidv4 } from "uuid";
import LoadingPage from "@/components/LoadingPage";
import { IMAGE_URL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import BidEnd from "@/components/BidEnd";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  creator: string;
  category: string;
  image: string;
  time: string;
  highest_bid: string;
}

const AVATAR = "/placeholder.svg?height=32&width=32";

const commentFormSchema = z.object({
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters long",
  }),
});

const bidFormSchema = z.object({
  bid: z.coerce.number().positive({
    message: "Bid must be a positive number",
  }),
});

export default function Listing() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isBidding, setIsBidding] = useState<boolean>(false);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [isDeactivating, setIsDeactivating] = useState<boolean>(false);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true); // is Listing Active or deactivated
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [auctionWinner, setAuctionWinner] = useState<string>("");
  const [thereIsAuctionWinner, setThereIsAuctionWinner] =
    useState<boolean>(false);
  const [highestBid, setHighestBid] = useState<string>("");
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [isAuctionWinner, setIsAuctionWinner] = useState<boolean>(false);

  // Gets id from the url
  const { id } = useParams<{ id: string }>();

  const commentForm = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: "",
    },
  });
  const bidForm = useForm<z.infer<typeof bidFormSchema>>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      bid: 0,
    },
  });

  const clearBidField = () => {
    bidForm.reset({
      bid: 0,
    });
  };

  const clearCommentField = () => {
    commentForm.reset({
      comment: "",
    });
  };
  async function onBidSubmit(values: z.infer<typeof bidFormSchema>) {
    setIsBidding(true);
    const data = {
      listing_id: id,
      bid: values.bid,
    };
    try {
      const response = await api.post(`${URL_FIX}/bid`, data);

      if (response.status === 202) {
        alert(response.data.success);
        setHighestBid(response.data.highest_bid);
        clearBidField();
      } else {
        alert(response.data.error);
        console.error(response);
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    } finally {
      setIsBidding(false);
    }
  }

  async function onCommentSubmit(values: z.infer<typeof commentFormSchema>) {
    setIsCommenting(true);
    const data = {
      listing_id: id,
      comment: values.comment,
    };
    try {
      const response = await api.post(`${URL_FIX}/comment`, data);

      if (response.data.success) {
        alert(response.data.success);
        clearCommentField();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCommenting(false);
    }
  }

  async function addToWatchlist() {
    setIsAdding(true);
    const data = { listing_id: id };
    try {
      const response = await api.post(`${URL_FIX}/watchlists`, data);

      if (response.status === 200) {
        setInWatchlist(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  }

  async function removeFromWatchlist() {
    setIsRemoving(true);
    try {
      const response = await api.delete(`${URL_FIX}/watchlists/${id}`);

      if (response.status === 200) {
        setInWatchlist(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRemoving(false);
    }
  }

  async function handleDeactivate() {
    setIsDeactivating(true);
    const data = { is_active: false };
    try {
      const response = await api.post(`${URL_FIX}/listing/${id}`, data);

      if (response.status === 200) {
        setIsActive(false);

        if (response.data.auction_winner) {
          setAuctionWinner(response.data.auction_winner);
          setThereIsAuctionWinner(response.data.there_is_auction_winner);
          setHighestBid(response.data.highest_bid);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeactivating(false);
    }
  }

  async function handleActivate() {
    setIsActivating(true);
    const data = { is_active: true };
    try {
      const response = await api.post(`${URL_FIX}/listing/${id}`, data);

      if (response.status === 200) {
        setIsActive(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsActivating(false);
    }
  }

  useEffect(() => {
    const getListing = async () => {
      try {
        const response = await api.get(`${URL_FIX}/listing/${id}`);

        if (response.status === 200) {
          setListing(response.data.listing);
          setHighestBid(response.data.listing.highest_bid);
          setIsActive(response.data.listing.is_active);
          setInWatchlist(response.data.in_watchlist);
          setIsAuctionWinner(response.data.is_auction_winner);
          setIsCreator(response.data.is_creator);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getListing();
  }, [id]);

  if (listing === null) {
    return <LoadingPage />;
  }
  const imageURL = `${IMAGE_URL}${listing.image}`;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex justify-between m-4">
          {isCreator ? (
            <div>
              {isActive ? (
                <Button
                  variant="destructive"
                  onClick={() => handleDeactivate()}
                  disabled={isDeactivating}
                >
                  {isDeactivating ? "Deactivating" : "Deactivate"}
                </Button>
              ) : (
                <Button
                  onClick={() => handleActivate()}
                  disabled={isActivating}
                >
                  {isActivating ? "Activating" : "Activate"}
                </Button>
              )}
            </div>
          ) : (
            <></>
          )}
          {inWatchlist ? (
            <Button
              variant="destructive"
              onClick={() => removeFromWatchlist()}
              disabled={isRemoving}
            >
              {isRemoving ? "Removing from watchlist" : "Remove from watchlist"}
            </Button>
          ) : (
            <Button onClick={() => addToWatchlist()} disabled={isAdding}>
              {isAdding ? "Adding to Watchlist" : "Add to watchlist"}
            </Button>
          )}
        </div>
        {!isActive && thereIsAuctionWinner && isCreator ? (
          <BidEnd auction_winner={auctionWinner} highest_bid={highestBid} />
        ) : (
          <></>
        )}
        {!isActive ? (
          <div className="m-4">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              This listing has been deactivated
            </h3>
            {isAuctionWinner ? (
              <>
                <div>
                  <p className="text-gray-600">
                    Congratutions! You are the winner of this auction. Click the
                    Pay button to proceed to the next step
                  </p>
                  <Button
                    onClick={() => {
                      console.log("Processing Payment");
                    }}
                  >
                    Pay
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">
            {listing.title}
          </CardTitle>
          <CardDescription>
            <Badge variant="secondary">{listing.category}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={imageURL}
                  alt={listing.title}
                  className="object-cover rounded-lg"
                />
              </div>
              {/* Showcasing more images for the listing */}
              {/* <div className="grid grid-cols-4 gap-2">
                {listing.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${listing.title} - Image ${index + 1}`}
                    className="object-cover rounded-lg aspect-square"
                  />
                ))}
              </div> */}
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{listing.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    {highestBid.length > 0 ? (
                      <p className="font-semibold">${highestBid}</p>
                    ) : (
                      <p className="text-sm font-semibold text-gray-700">
                        No bids yet
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Starting Price</p>
                    <p className="font-semibold">${listing.price}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={AVATAR} alt={listing.creator} />
                  <AvatarFallback>
                    {listing.creator.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="font-semibold">
                    {listing.creator.charAt(0).toUpperCase() +
                      listing.creator.slice(1)}
                  </p>
                </div>
              </div>
              {isActive ? (
                <div className="w-full md:w-1/2 lg:w-1/2">
                  {!isCreator ? (
                    <>
                      <h3 className="text-lg font-semibold mb-2 mt-4">Bid</h3>
                      <Form {...bidForm}>
                        <form
                          onSubmit={bidForm.handleSubmit(onBidSubmit)}
                          className="space-y-8"
                        >
                          <FormField
                            control={bidForm.control}
                            name="bid"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    data-clear
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    min={listing.price}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isBidding}>
                            {isBidding ? "Place a bid " : "Placing bid"}
                          </Button>
                        </form>
                      </Form>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {isActive ? (
            <div className="w-full md:w-1/2 lg:w-1/2">
              <h3 className="text-lg font-semibold mb-2 mt-4">Comments</h3>
              {/* Display comments */}
              <div className="mb-4"></div>
              {/* Comment input */}
              <Form {...commentForm}>
                <form
                  onSubmit={commentForm.handleSubmit(onCommentSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={commentForm.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            data-clear
                            placeholder="Write a comment"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isCommenting}>
                    {isCommenting ? "Commenting" : "Comment"}
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
