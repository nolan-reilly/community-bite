// app/donor/donation/feedpage.tsx
"use client";
import { useEffect, useState } from "react";
import userRoleProtection from "@/hooks/userRoleProtection";
import { HistoryProp } from "@/components/FoodBankHistoryCard";
import HistoryCard from "@/components/FoodBankHistoryCard";
import { getDonationHistory } from "./script";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Container from "@/components/Container";
import FilterSortPopup, { FilterOption } from "@/components/FilterSortPopup";

export default function DonationPage() {
  userRoleProtection("donor");

  const [donations, setDonations] = useState<HistoryProp[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* Filter useStates*/
  const [filteredDonations, setFilteredDonations] = useState<HistoryProp[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [frequencies, setFrequencies] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<string[]>([]);

  /*   Filter Options  */
  const filterOptions: FilterOption[] = [
    {
      title: "Donation Status",
      options: ["Active", "Inactive"],
      selected: statuses,
      onChange: setStatuses,
    },
    {
      title: "Frequency",
      options: ["One-time", "Daily", "Weekly", "Monthly"],
      selected: frequencies,
      onChange: setFrequencies,
    },
    {
      title: "Quantity",
      options: ["0 - 50", "51 - 100", "100+"],
      selected: quantities,
      onChange: setQuantities,
    },
  ];

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donations = await getDonationHistory();
        setDonations(
          donations.response.donationHistory
            ? donations.response.donationHistory.reverse()
            : []
        );      
      } catch (error) {
        setDonations([]);
        console.error("Failed to fetch donations:", error);
      }
    };

    fetchDonations();
    const interval = setInterval(fetchDonations, 5000);
    return () => clearInterval(interval);
  }, []);

  /* Filter useEffect */
  useEffect(() => {
    const filter = donations.filter((donation) => {
      const matchSearch = donation.produce_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

        const matchStatus =
        statuses.length === 0 ||
        statuses.some((s) => {
          const normalized = s.toLowerCase();
          const mappedStatus =
            normalized === "active" ? "open" :
            normalized === "inactive" ? "close" :
            normalized;
      
          return mappedStatus === donation.donation_status.toLowerCase();
        });
      

      const matchFrequency =
        frequencies.length === 0 || frequencies.some((f) => f.toLowerCase() === donation.frequency.toLowerCase());

      const matchQuantity =
        quantities.length === 0 ||
        quantities.some((range) => {
          const [min, max] =
            range === "100+"
              ? [100, Infinity]
              : range.split(" - ").map(Number);
          return donation.quantity >= min && donation.quantity <= max;
        });

      return matchSearch && matchStatus && matchFrequency && matchQuantity ;
    });

    setFilteredDonations(filter);
  }, [donations, searchQuery, frequencies, quantities]);
  
  const produceSuggestions = Array.from(
    new Set(donations.map((d: HistoryProp) => d.produce_name))
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
    <div>
      <Navbar root="/donor">
      {/* Search Input */}
      <div className="relative mx-auto max-w-2xl">
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
      </Navbar>

      <Container>
        <div className="absolute right-20">
          <FilterSortPopup filterOptions={filterOptions} />
        </div>

        <div className="gap-4">
          {filteredDonations.length === 0 ? (
            <div className="flex justify-center col-span-full">
              <p className="text-center text-gray-500">
                {searchQuery
                  ? "No matching donations found"
                  : "No available donations at the moment."}
              </p>
            </div>
          ) : (
            filteredDonations.map((donation) => (
              <div
                key={`${donation.post_id}-${donation.foodbank_email}`}
                className="flex justify-center p-2"
              >
                <HistoryCard
                  produce_name={donation.produce_name}
                  post_id={donation.post_id}
                  quantity={donation.quantity}
                  created_on={new Date(donation.created_on)}
                  frequency={donation.frequency}
                  comment={donation.comment ?? ""}
                  business_name={donation.business_name}
                  foodbank_email={donation.foodbank_email}
                  pantry_address={donation.pantry_address}
                  proposed_date={
                    donation.proposed_date
                      ? new Date(donation.proposed_date)
                      : new Date()
                  }
                  donation_status={donation.donation_status}
                />
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}
