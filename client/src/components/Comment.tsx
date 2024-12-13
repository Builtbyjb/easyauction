// import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface CommentProps {
  username: string;
  comment: string;
  time: string;
}

const AVATAR = "/placeholder.svg?height=32&width=32";

export default function Comment({ username, comment, time }: CommentProps) {
  return (
    <div className="flex space-x-4 p-4 bg-white rounded-lg shadow">
      <Avatar className="w-10 h-10">
        <AvatarImage src={AVATAR} alt={username} />
        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{username}</h4>
            <p className="text-sm text-gray-500">{time}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report</DropdownMenuItem>
              {/* <DropdownMenuItem>Block User</DropdownMenuItem> */}
              <DropdownMenuItem className="text-red-700">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-gray-700">{comment}</p>
        {/* <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className="text-gray-500 hover:text-gray-700"
          >
            <Heart className="h-4 w-4 mr-2" />
            {likes} {likes === 1 ? "Like" : "Likes"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReply}
            className="text-gray-500 hover:text-gray-700"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Reply
          </Button>
        </div> */}
      </div>
    </div>
  );
}
