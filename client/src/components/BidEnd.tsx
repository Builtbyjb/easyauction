import { Button } from "./ui/button";

interface Props {
  auction_winner: string;
  highest_bid: string;
}

export default function BidEnd({ auction_winner, highest_bid }: Props) {
  const acceptBid = () => {
    console.log("Bid accepted");
  };

  const rejectBid = () => {
    console.log("Bid rejected");
  };

  return (
    <div className="m-4">
      <p className="mb-4">
        The current bid for this listings is {highest_bid} by {auction_winner}
      </p>
      <div className="flex">
        <Button onClick={acceptBid} className="me-8">
          Accept bid
        </Button>
        <Button variant="destructive" onClick={rejectBid}>
          Reject bid
        </Button>
      </div>
    </div>
  );
}
