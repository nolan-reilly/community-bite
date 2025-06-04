"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WithdrawDonation } from "@/app/food-bank/donation/request/script";
import AlertDialog_ from "./AlertDialog";
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
  request_status: string;
}


const WithdrawRequest = ({
  postId,
  request_status,
}: {
  postId: number;
  request_status: string;
}) => {
  const { toast } = useToast();

  return (
    <AlertDialog_
      title="Withdraw Request"
      description="This action will withdraw your donation request."
      action={async () => {
        const response = await WithdrawDonation(postId);
        if (!response) {
          toast({
            variant: "destructive",
            title: "Request Failed",
            description: "Something went wrong. Please try again.",
          });
        } else if (response.success) {
          toast({
            variant: "default",
            title: "Request Withdrawn",
            description: "Your donation request was withdrawn successfully.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error,
          });
        }
      }}
      triggerLabel="Withdraw Request"
      disabled={request_status === "DECLINED" || request_status === "ACCEPTED"}
    />
  );
};


const Status = ({ status }: { status: string }) => {
  const baseStyle = "px-2 py-1 rounded-md text-xs font-medium";
  if (status === "ACCEPTED") {
    return <span className={`${baseStyle} text-green-700 bg-green-100`}>Accepted</span>;
  } else if (status === "DECLINED") {
    return <span className={`${baseStyle} text-red-700 bg-red-100`}>Declined</span>;
  }
  return <span className={`${baseStyle} text-gray-700 bg-gray-100`}>Pending</span>;
};

export default function DonationCard(donation: DonationCardProps) {
  return (
    <Card className="w-[430px] shadow-md border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{donation.produceName}</CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">{donation.comment}</CardDescription>
          </div>
          <Status status={donation.request_status} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between text-sm bg-gray-100 p-2 rounded-md">
          <span className="font-semibold">Quantity:</span>
          <span>{donation.quantity}</span>
        </div>

        <div className="flex justify-between text-sm bg-gray-100 p-2 rounded-md">
          <span className="font-semibold">Weight:</span>
          <span>{donation.weight} lbs</span>
        </div>

        <div className="flex justify-between text-sm bg-gray-100 p-2 rounded-md">
          <span className="font-semibold">Frequency:</span>
          <span>{donation.frequency}</span>
        </div>

        <div className="text-sm text-gray-500">
          Latest Shipment: {donation.deliveryDate.toLocaleDateString()}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        <WithdrawRequest
          postId={donation.post_id}
          request_status={donation.request_status}
        />
      </CardFooter>
    </Card>
  );
}
