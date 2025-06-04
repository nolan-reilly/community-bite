'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestDonation } from "@/app/food-bank/donation/feed/script";
import { useToast } from "@/hooks/use-toast";

interface DonationCardProps {
  produceName: string;
  post_id: number;
  quantity: number;
  weight: number;
  donorEmail: string;
  deliveryDate: Date;
  frequency: string;
  comment: string;
}

const SendRequest = ({
  onClick,
  postId,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  postId: number;
}) => {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      className="flex-1 bg-[#A9B89A] text-black hover:bg-[#BACBA9]"
      onClick={async (e) => {
        onClick(e);
        const response = await RequestDonation(postId);

        if (!response) {
          toast({
            variant: "destructive",
            title: "Request Failed",
            description: "Something went wrong. Please try again.",
          });
        } else if (response.success) {
          toast({
            variant: "success",
            title: "Request Sent",
            description: "Your donation request was submitted successfully.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error,
          });
        }
      }}
    >
      Send Request
    </Button>
  );
};


export default function DonationCard(donation: DonationCardProps) {
  
  return (
    <Card className="w-[450px] shadow-md border">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-semibold">
            {donation.produceName}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {donation.comment}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between bg-gray-100 p-3 rounded-md text-sm">
          <span className="font-medium text-gray-700">Quantity:</span>
          <span>{donation.quantity}</span>
        </div>

        <div className="flex justify-between bg-gray-100 p-3 rounded-md text-sm">
          <span className="font-medium text-gray-700">Weight:</span>
          <span>{donation.weight} lbs</span>
        </div>

        <div className="flex justify-between bg-gray-100 p-3 rounded-md text-sm">
          <span className="font-medium text-gray-700">Frequency:</span>
          <span>{donation.frequency}</span>
        </div>

        <CardDescription className="text-sm text-gray-500">
          Latest Shipment: {donation.deliveryDate.toLocaleDateString()}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex gap-4">
        <SendRequest 
          onClick={() => {}} postId={donation.post_id}
        >
        </SendRequest>
      </CardFooter>
    </Card>
  );
}
