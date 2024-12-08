import { ListingCard } from "@/components/ListingCard";

const listings = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=400",
    price: 199.99,
    title: "Vintage Camera",
    description: "A beautiful vintage camera in excellent condition.",
    time: "2 hours ago",
    creator: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=400",
    price: 499.99,
    title: "Modern Laptop",
    description: "High-performance laptop for all your computing needs.",
    time: "1 day ago",
    creator: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=400",
    price: 79.99,
    title: "Wireless Headphones",
    description:
      "Noise-cancelling wireless headphones with great sound quality.",
    time: "3 days ago",
    creator: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=400",
    price: 299.99,
    title: "Smartwatch",
    description:
      "Feature-packed smartwatch with fitness tracking and notifications.",
    time: "1 week ago",
    creator: {
      name: "Emily Brown",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
];

export default function ListingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Active Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </div>
  );
}
