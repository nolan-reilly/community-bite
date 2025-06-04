import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface DonationCardProps {
  produceName: string;
  post_id: number;
  quantity: number;
  frequency: string;
  donorEmail: string;
  createdOn: Date;
  comment: string;
}

export default function DonationCard(donation: DonationCardProps) {
  return (
    <Card className="w-[500px] shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">{donation.produceName}</CardTitle>
        <CardDescription className="text-base text-gray-600">
          {donation.comment}
        </CardDescription>
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
