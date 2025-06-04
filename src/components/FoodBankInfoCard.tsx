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
import { ApproveRequest, DeclineRequest } from "@/app/donor/donation/request/script";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FoodBankCardProps {
  business_name: string;
  email: string;
  zipcode: string;
  address: string;
  post_id: string;
  onRequestUpdate: (email: string) => void;
}

const RequestActionButton = ({
  label,
  message,
  style,
  action,
  post_id,
  email,
  onRequestUpdate,
}: {
  label: string;
  message: string;
  style: string;
  action: (post_id: string, email: string) => Promise<any>;
  post_id: string;
  email: string;
  onRequestUpdate: (email: string) => void;
}) => {

  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      className={style}
      onClick={async () => {
        const response = await action(post_id, email);
        if (!response) {
          toast({
            variant: "destructive",
            title: "Request Failed",
            description: "Something went wrong. Please try again.",
          });
        } else if (response.success) {
          toast({
            variant: "success",
            title: "Resonse Sent",
            description: `Request ${message}.`,
          });
          onRequestUpdate(email); 
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error,
          });
        }
      }}
    >
      {label}
    </Button>
  )
}

export default function FoodBankInfoCard(foodBank: FoodBankCardProps) {
  return (
    <Card className="w-[450px] shadow-md border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {foodBank.business_name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {foodBank.email}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4" />
          <span>{foodBank.address}</span>
        </div>
        <CardDescription className="text-sm text-gray-500">
          {/* Replace with distance logic if available */}
          {/* 4.2 miles away */}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex gap-4">
        <RequestActionButton
          label="Approve"
          message="approved"
          style="flex-1 bg-[#BACBA9] text-black hover:bg-[#98A688]"
          action={ApproveRequest}
          post_id={foodBank.post_id}
          email={foodBank.email}
          onRequestUpdate={foodBank.onRequestUpdate}
        />
        <RequestActionButton
          label="Reject"
          message="rejected"
          style="flex-1 bg-red-500 text-white hover:bg-red-600"
          action={DeclineRequest}
          post_id={foodBank.post_id}
          email={foodBank.email}
          onRequestUpdate={foodBank.onRequestUpdate}
        />
      </CardFooter>
    </Card>
  );
}
