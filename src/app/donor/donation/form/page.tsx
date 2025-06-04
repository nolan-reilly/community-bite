"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SelectGroup } from "@radix-ui/react-select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateDonationPost } from "./script"; 
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Navbar from "@/components/Navbar";
import userRoleProtection from "@/hooks/userRoleProtection";
import { useToast } from "@/hooks/use-toast";

export default function DonationForm() {

  userRoleProtection("donor");
  const [frequency, setFrequency] = useState("");
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
  
    try {
      const result = await CreateDonationPost(e, frequency);
  
      if (!result) {
        toast({ variant: "destructive", title: "Error", description: "Failed to create donation." });
      } else if (result.success) {
        toast({ variant: "success", title: "Success", description: "Donation created successfully!" });
      }
  
      (document.getElementById("produce") as HTMLInputElement).value = "";
      (document.getElementById("quantity") as HTMLInputElement).value = "";
      (document.getElementById("weight") as HTMLInputElement).value = "";
      (document.getElementById("date") as HTMLInputElement).value = "";
      (document.getElementById("comment") as HTMLInputElement).value = "";
  
      setFrequency("Select a frequency");
      setDate(undefined);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
      console.error("Error creating donation post:", error);
    }
  };

  return (
    <>
      <Navbar root="/donor"></Navbar>
      <div className="mt-8">
        <form id="donation-form" onSubmit={(e) => handleSubmit(e)}>
          <Card className="w-[80%] md:w-[50%] mx-auto">
            <CardHeader>
              <CardTitle>Food Donation Form</CardTitle>
              <CardDescription>
                Please complete the form below to create your donation post
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Produce Field */}
              <div>
                <p>Produce</p>
                <Input id="produce" type="text" placeholder="Tomatoes" required />
              </div>

              {/* Quantity & Weight */}
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                  <p>Quantity</p>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="10"
                    min={0}
                    required
                  />
                </div>

                <div className="flex-1">
                  <p>Weight (lb)</p>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="20"
                    min={0}
                    required
                  />
                </div>
              </div>

              {/* Delivery Date & Frequency */}
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                  <p>Delivery Date</p>
                  {/* Popover Calendar Input */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[100%] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Hidden input with the same id as the old date input */}
                  {/* This should send the correct data to our database */}
                  <input
                    id="date"
                    name="date"
                    type="hidden"
                    required
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                  />
                </div>
                <div className="flex-1">
                  <p>Frequency</p>
                  <Select value={frequency} onValueChange={(value) => setFrequency(value)}>
                    <SelectTrigger className="w-[100%]">
                      <SelectValue placeholder="Select a frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="one-time">One Time</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="12-months">12 Months</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p>Comments</p>
                <Textarea id="comment" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}
