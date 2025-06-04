"use client";
import { useEffect, useState, useCallback } from "react";
import { DonationPost } from "@prisma/client";
import userRoleProtection from "@/hooks/userRoleProtection";
import DonationCard from "@/components/DonorDonationCard";
import FoodBankCard from "@/components/FoodBankInfoCard";
import { getDonationPost, getPendingDonationRequests } from "./script";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";

interface FoodBankInfo {
  business_name: string;
  email: string;
  zipcode: string;
  address: string;
  post_id: string;
}
export default function DonationPage() {
  userRoleProtection("donor");
  const email =
    typeof window !== "undefined" ? sessionStorage.getItem("email") : null;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const [donations, setDonations] = useState<DonationPost[]>([]);
  const [foodBanks, setFoodbanks] = useState<FoodBankInfo[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<DonationPost | null>(
    null
  );
  
  // Fetch user donations
  const fetchDonations = useCallback(async () => {
    if (!email || !token) return;

    try {
      const data = await getDonationPost();
      if (data.success) {
        setDonations(
          data.response.allDonations ? data.response.allDonations.reverse() : []
        );
      }
    } catch (error) {
      setDonations([]);
      console.error("Failed to fetch donations:", error);
    }
  }, [email, token]);

  useEffect(() => {
    fetchDonations();
    if (donations.length === 0) {
      setFoodbanks([]);
    }
    const interval = setInterval(fetchDonations, 3000);
    return () => clearInterval(interval);
  }, [fetchDonations, donations.length]);

  // Handle Donation Click (Updates Food Banks)
  const handleDonationClick = async (donation: DonationPost) => {
    setSelectedDonation(donation);

    const updatedFoodBanks = await getPendingDonationRequests(
      donation.post_id.toString()
    );
    console.log(donation.post_id.toString());
    if (!updatedFoodBanks.success) {
      setFoodbanks([]);
      console.log("failed to fetch donation requests");
      return;
    }
    setFoodbanks(updatedFoodBanks.response.donationRequests);
  };

  const handleRequestUpdate = (emailToRemove: string) => {
    setFoodbanks((prev) => prev.filter((fb) => fb.email !== emailToRemove));
  };

  return (
    <div>
      <Navbar root="/donor"></Navbar>

      <div className="flex h-screen mt-8 gap-4">
        {/* Left Side - Donations (Selectable) */}
        <div className="flex-1 overflow-y-auto bg-white border border-gray-300 rounded-md p-2">
          <h2 className="text-lg font-bold mb-2">Donations</h2>
          <div className="grid grid-cols-1">
            {Array.isArray(donations) &&
              donations.map((donation) => (
                <div
                  key={donation.post_id}
                  className="flex justify-center cursor-pointer hover:bg-gray-100 p-2"
                  onClick={() => handleDonationClick(donation)}
                  style={{
                    backgroundColor:
                      selectedDonation?.post_id === donation.post_id
                        ? "#FEF3C7"
                        : "transparent",
                  }}
                >
                  <DonationCard
                    produceName={donation.produce_name}
                    post_id={donation.post_id}
                    frequency={donation.frequency}
                    quantity={donation.quantity}
                    createdOn={new Date(donation.created_on)}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Right Side - Food Banks (Fixed to right) */}
        <div className="w-[70%] overflow-y-auto p-4 right-0 top-0 h-full bg-gray-100 shadow-lg border border-gray-300 rounded-md">
          <h2 className="text-lg font-bold mb-2">Food Banks</h2>
          {selectedDonation && (
            <p className="text-sm text-gray-500 mb-2">
              Showing food banks for donation:{" "}
              <strong>{selectedDonation.produce_name}</strong>
            </p>
          )}
          <div className="grid grid-cols-1 gap-4">
            {foodBanks.length > 0 ? (
              foodBanks.map((foodBank) => (
                <div key={foodBank.email} className="flex justify-center">
                  <FoodBankCard
                    business_name={foodBank.business_name}
                    email={foodBank.email}
                    zipcode={foodBank.zipcode ? foodBank.zipcode : ""}
                    address={foodBank.address ? foodBank.address : ""}
                    post_id={selectedDonation?.post_id?.toString() || ""}
                    onRequestUpdate={handleRequestUpdate}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No request found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
