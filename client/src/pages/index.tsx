import { ListingCard } from "@/components/ListingCard";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { URL_FIX } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";
import { LoadingPage } from "@/components/LoadingPage";

export default function Index() {
  const [listings, setListings] = useState<[][] | null>(null);

  useEffect(() => {
    const getListings = async () => {
      try {
        const response = await api.get(`${URL_FIX}/listings`);
        if (response.status === 200) {
          setListings(response.data.listings);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getListings();
  }, []);

  if (listings === null) {
    return <LoadingPage />;
  }
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Active Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={uuidv4()} {...listing} />
        ))}
      </div>
    </>
  );
}
