import { ListingCard } from "@/components/ListingCard";

interface Props {
  type: string;
}

export default function Categories({ type }: Props) {
  const listings = [];
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Category</h1>
      <p className="mb-6 text-gray-600 font-semibold">{type}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </>
  );
}
