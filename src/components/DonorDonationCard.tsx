'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteDonationPost } from "@/app/donor/donation/feed/user/script";
import { useToast } from "@/hooks/use-toast";
import DeleteIconDialog from "./DeleteIconDialog";

interface DonationCardProps {
  produceName: string;
  post_id: number;
  quantity: number;
  createdOn: Date;
  frequency: string;
}

const CloseDonationButton = ({ postId }: { postId: number }) => {
  const { toast } = useToast();

  return (
    <DeleteIconDialog
      title="Delete Donation"
      description="This will delete the donation and decline all pending requests."
      icon="BadgeX"
      onConfirm={async () => {
        const response = await DeleteDonationPost(postId);
        if (!response) {
          toast({ variant: "destructive", title: "Error", description: "Could not delete." });
        } else if (response.success) {
          toast({ variant:"safeDelete", title: "Deleted", description: "Donation removed successfully." });
        } else {
          toast({ variant: "destructive", title: "Failed", description: response.error });
        }
      }}  
    />
  );
}

export default function DonationCard(donation: DonationCardProps) {
  return (
    <Card className="w-[500px] shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{donation.produceName}</CardTitle>
          </div>
          <CloseDonationButton postId={donation.post_id} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between bg-gray-100 p-3 rounded-md">
          <div className="flex gap-2">
            <span className="font-semibold text-sm text-gray-700">Quantity:</span>
            <span className="text-sm text-gray-800">{donation.quantity}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-sm text-gray-700">Frequency:</span>
            <span className="text-sm text-gray-800">{donation.frequency}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <CardDescription className="text-sm text-gray-500">
          Posted on: {donation.createdOn.toLocaleDateString()}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}