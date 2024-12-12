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
    <div>
      <h3>Listing Decativated</h3>
      <p>
        The current bid for this listings is {highest_bid} by {auction_winner}
      </p>
      <div className="flex">
        <Button onClick={acceptBid}>Accept bid</Button>
        <Button variant="destructive" onClick={rejectBid}>
          Reject bid
        </Button>
      </div>
    </div>
  );
}
