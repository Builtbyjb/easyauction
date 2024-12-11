import ListingCard from "@/components/ListingCard";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { URL_FIX } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";
import LoadingPage from "@/components/LoadingPage";
import NoListingsAvailable from "@/components/NoListingAvailable";
import { logOut } from "@/lib/utils";

interface Props {
  type: string;
  path: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  creator: string;
  category: string;
  image: string;
  time: string;
}

export default function Categories({ type, path }: Props) {
  const [listings, setListings] = useState<Listing[] | null>(null);

  useEffect(() => {
    const getListings = async () => {
      try {
        const response = await api.get(`${URL_FIX}/categories/${path}`);
        if (response.status === 401) {
          logOut();
        } else if (response.status === 200) {
          setListings(response.data.listings);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getListings();
  }, [path]);

  if (listings === null) {
    return <LoadingPage />;
  }
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Category</h1>
      <p className="mb-6 text-gray-600 font-semibold">{type}</p>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing: Listing) => (
            <ListingCard
              id={listing.id}
              image={listing.image}
              price={listing.price}
              title={listing.title}
              description={listing.description}
              category={listing.category}
              time={listing.time}
              creator={listing.creator}
              key={uuidv4()}
            />
          ))}
        </div>
      ) : (
        <>
          <NoListingsAvailable subMessage="Check back later for new auctions in this category" />
        </>
      )}
    </>
  );
}
