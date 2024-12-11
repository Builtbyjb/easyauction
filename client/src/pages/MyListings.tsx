import { LoadingPage } from "@/components/LoadingPage";
import { ListingCard } from "@/components/ListingCard";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { URL_FIX } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";

export default function MyListings() {
  const [listings, setListings] = useState<[][] | null>(null);

  const getListings = async () => {
    try {
      const response = await api.get(`${URL_FIX}/my_listings`);
      if (response.status === 200) {
        setListings(response.data.listings);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getListings();
  }, []);

  if (listings === null) {
    return <LoadingPage />;
  }
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">My Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={uuidv4()} {...listing} />
        ))}
      </div>
    </>
  );
}
