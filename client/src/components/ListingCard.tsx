import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ListingCardProps {
  image: string;
  price: number;
  title: string;
  description: string;
  time: string;
  creator: {
    name: string;
    avatar: string;
  };
}

export function ListingCard({
  image,
  price,
  title,
  description,
  time,
  creator,
}: ListingCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img src={image} alt={title} />
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            ${price.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>{time}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={creator.avatar} alt={creator.name} />
          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm">{creator.name}</span>
      </CardFooter>
    </Card>
  );
}
