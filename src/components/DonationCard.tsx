import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { $Enums } from "@prisma/client";

export interface DonationPostInfo {
    post_id: number;
    donor_email: string;
    donor_name: string;
    produce_name: string;
    quantity: number;
    weight: number;
    created_on: Date;
    proposed_date: Date;
    frequency: string;
    comment: string | null;
    donation_status: $Enums.DonationStatus | null
}

interface DonationCardProps {
  produceName: string;
  quantity: number;
  donorEmail: string;
  donorName: string;
  createdOn: Date;
  frequency: string;
}

export default function DonationCard(donation: DonationCardProps) {
  return (
    <Card className="w-[430px] shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">{donation.produceName}</CardTitle>
        <div className="flex gap-1">
          <span className="text-base font-medium text-gray-700">
            {donation.donorName}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between bg-gray-100 p-2 rounded-md">
          <span className="font-semibold text-sm text-gray-700">Quantity:</span>
          <span className="text-sm text-gray-800">{donation.quantity}</span>
        </div>

        <div className="flex justify-between bg-gray-100 p-2 rounded-md">
          <span className="font-semibold text-sm text-gray-700">Frequency:</span>
          <span className="text-sm text-gray-800">{donation.frequency}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <CardDescription className="text-xs text-gray-500">
          Posted on: {donation.createdOn.toLocaleDateString()}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
