import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMAGE_URL } from "@/lib/constants";

const AVATAR = "/placeholder.svg?height=32&width=32";

interface ListingCardProps {
  image: string;
  price: string;
  title: string;
  description: string;
  category: string;
  time: string;
  creator: string;
}

export function ListingCard({
  image,
  price,
  title,
  description,
  category,
  time,
  creator,
}: ListingCardProps) {
  const imageURL = `${IMAGE_URL}${image}`;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img src={imageURL} alt={title} className="object-cover h-48" />
          <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded">
            ${price}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm font-semibold text-gray-600 mb-2">{category}</p>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>{time}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center">
        {creator ? (
          <>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={AVATAR} alt={creator} />
              <AvatarFallback>{creator.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {/* Capitalize the first character of the creator username */}
              {creator.charAt(0).toUpperCase() + creator.slice(1)}
            </span>
          </>
        ) : (
          <></>
        )}
      </CardFooter>
    </Card>
  );
}
