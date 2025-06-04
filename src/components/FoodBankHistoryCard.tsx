import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export interface HistoryProp {
  post_id: number;
  business_name: string;
  foodbank_email: string;
  pantry_address: string;
  produce_name: string;
  quantity: number;
  proposed_date: Date;
  created_on: Date;
  frequency: string;
  comment: string;
  donation_status: string;
}

function getEndDate(startDate: Date, frequency: string): Date {
  const start = new Date(startDate);
  const end = new Date(start);

  if (frequency.toLowerCase() !== "one-time") {
    end.setFullYear(end.getFullYear() + 1);
  }

  return end;
}

function isDonationActive(startDate: Date, frequency: string): boolean {
  const now = new Date();
  return now <= getEndDate(startDate, frequency);
}

export default function HistoryCard(donation: HistoryProp) {
  return (
    <Card className="w-[450px] shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{donation.produce_name}</CardTitle>
        <CardDescription className="mt-1 text-sm text-gray-600">
          Posted on: {donation.created_on.toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 text-sm">
        {/* Pantry Info */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
          <p className="font-semibold text-gray-700">Pantry Info</p>
          <p className="text-gray-800">
            {donation.business_name} <br />
            <span className="text-gray-500 text-xs">@{donation.foodbank_email}</span> <br />
            <span className="text-gray-500 text-xs">{donation.pantry_address}</span>
          </p>
        </div>

        {/* Donation Details */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
          <p className="font-semibold text-gray-700">Donation Details</p>
          <div className="flex justify-between mt-1">
            <span className="text-gray-600">Quantity:</span>
            <span>{donation.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Frequency:</span>
            <span>{donation.frequency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span
              className={
              isDonationActive(donation.proposed_date, donation.frequency)
                ? "text-green-500"
                : "text-red-500"
              }
            >
              {isDonationActive(donation.proposed_date, donation.frequency)
              ? "Active"
              : "Inactive"}
            </span>

          </div>
        </div>

        {/* Schedule Info */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
          <p className="font-semibold text-gray-700">Schedule</p>
          <div className="flex justify-between mt-1">
            <span className="text-gray-600">Start:</span>
            <span>{donation.proposed_date.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">End:</span>
            <span>{getEndDate(donation.proposed_date, donation.frequency).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      {/* Optional Footer if needed */}
      <CardFooter>
        {/* Add any action or status summary here */}
      </CardFooter>
    </Card>
  );
}
