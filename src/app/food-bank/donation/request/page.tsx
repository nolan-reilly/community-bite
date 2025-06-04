"use client";
import DonationCard from "@/components/FoodBankRequestCard";
import { useEffect, useState } from "react";
import { RequestStatus, DonationStatus } from "@prisma/client";
import userRoleProtection from "@/hooks/userRoleProtection";
import Container from "@/components/Container";
import Image from "next/image";
import { GetDonationRequests } from "./script";
import Navbar from "@/components/Navbar";
import FilterSortPopup, { FilterOption } from "@/components/FilterSortPopup";

export interface Post {
  request_status: RequestStatus;
  post_id: number;
  donor_email: string;
  produce_name: string;
  quantity: number;
  weight: number;
  created_on: Date;
  proposed_date: Date;
  frequency: string;
  comment: string | null;
  donation_status: DonationStatus;
}

export default function RequestPage() {
  userRoleProtection("food-bank");

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [donations, setDonations] = useState<Post[]>([]);

  /* Filter useStates*/
  const [filteredDonations, setFilteredDonations] = useState<Post[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [frequencies, setFrequencies] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<string[]>([]);
  const [weights, setWeights] = useState<string[]>([]);

  /*   Filter Options  */
  const filterOptions: FilterOption[] = [
    {
      title: "Donation Status",
      options: ["Accepted", "Declined", "Pending"],
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
    {
      title: "Weight",
      options: ["0 - 50", "51 - 100", "100+"],
      selected: weights,
      onChange: setWeights,
    },
  ];

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donations = await GetDonationRequests();
        setDonations(donations.posts ? donations.posts.reverse() : []);
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
        statuses.length === 0 || statuses.some((s) => s.toLowerCase() === donation.request_status.toLowerCase());

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

      const matchWeight =
        weights.length === 0 ||
        weights.some((range) => {
          const [min, max] =
            range === "100+"
              ? [100, Infinity]
              : range.split(" - ").map(Number);
          return donation.weight >= min && donation.weight <= max;
        });

      return matchSearch && matchStatus && matchFrequency && matchQuantity && matchWeight;
    });

    setFilteredDonations(filter);
  }, [donations, searchQuery, statuses, frequencies, quantities, weights]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (produceName: string) => {
    setSearchQuery(produceName);
    setShowSuggestions(false);
  };

  const produceSuggestions = Array.from(
    new Set(donations.map((d: Post) => d.produce_name))
  );

  return (
    <div>
      <Navbar root="/food-bank">
        <div className="relative mx-auto max-w-2xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search requests..."
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
        {/* Donations Grid -lg:grid grid-cols-3 md:grid-cols-2 grid-cols-1 */}
        <div className="absolute right-20">
          <FilterSortPopup filterOptions={filterOptions} />
        </div>
        <div className="gap-4">
          {filteredDonations.length === 0 ? (
            <div className="flex flex-col justify-center col-span-full">
              <div className="flex justify-center">
                <p className="text-center text-gray-500">
                  {searchQuery
                    ? "No matching requests found"
                    : "You have no pending requests at the moment."}
                </p>
              </div>
              {!searchQuery && (
                <div className="flex justify-center">
                  <a
                    href="/food-bank/donation/feed"
                    className="text-blue-500 underline"
                  >
                    Find donations
                  </a>
                </div>
              )}
            </div>
          ) : (
            filteredDonations.map((donation) => (
              <div key={donation.post_id} className="p-2 flex justify-center">
                <DonationCard
                  produceName={donation.produce_name}
                  post_id={donation.post_id}
                  quantity={donation.quantity}
                  weight={donation.weight}
                  donorEmail={donation.donor_email}
                  deliveryDate={new Date(donation.proposed_date)}
                  frequency={donation.frequency}
                  comment={donation.comment ?? ""}
                  request_status={donation.request_status}
                />
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}
