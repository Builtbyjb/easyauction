import { ListingCard } from "@/components/ListingCard";

export default function Watchlists() {
  const listings = [];
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Watchlists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </>
  );
}
