"use client";
import DonationCard from "@/components/DonorDonationCard";
import { useEffect, useState } from "react";
import { DonationPost } from "@prisma/client";
import userRoleProtection from "@/hooks/userRoleProtection";
import Image from "next/image";

export default function DonationPage() {
  userRoleProtection("donor");

  const [donations, setDonations] = useState<DonationPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const email =
    typeof window !== "undefined" ? sessionStorage.getItem("email") : null;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const data = await fetch(`/api/donor/donation/${email}?donation_status=OPEN`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const donations = await data.json();
        setDonations(
          donations.allDonations ? donations.allDonations.reverse() : []
        );
      } catch (error) {
        setDonations([]);
        console.error("Failed to fetch donations:", error);
      }
    };

    fetchDonations();
    const interval = setInterval(fetchDonations, 3000);

    return () => clearInterval(interval);
  }, []);

  // Get unique produce names for suggestions
  const produceSuggestions = Array.from(
    new Set(donations.map((d: DonationPost) => d.produce_name))
  ) as string[];

  // Filter donations based on search query
  const filteredDonations = donations.filter((donation: DonationPost) =>
    donation.produce_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (produceName: string) => {
    setSearchQuery(produceName);
    setShowSuggestions(false);
  };

  return (
    <div className="w-[50%] mx-auto">
      {/* Custom Search Input */}
      <div className="mb-8 relative">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search donations..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pr-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Image
            src="/magnify.svg"
            alt="Search icon"
            width={20}
            height={20}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          />

          {showSuggestions && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {produceSuggestions
                .filter((name: string) =>
                  name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((name: string, index: number) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(name);
                    }}
                  >
                    {name}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Donations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDonations.map((donation: DonationPost) => (
          <div key={donation.post_id} className="flex justify-center">
            <DonationCard
              produceName={donation.produce_name}
              post_id={donation.post_id}
              quantity={donation.quantity}
              createdOn={new Date(donation.created_on)}
              frequency={donation.frequency}
            />
          </div>
        ))}

        {filteredDonations.length === 0 && (
          <p className="text-center text-gray-500">
            {searchQuery
              ? "No matching donations found"
              : "No donations available"}
          </p>
        )}
      </div>
    </div>
  );
}
