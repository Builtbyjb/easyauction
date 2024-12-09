import { ListingCard } from "@/components/ListingCard";
import { useEffect, useState } from "react";

export default function Index() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    setListings([]);
  }, []);
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Active Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </>
  );
}
