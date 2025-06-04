"use client";
import DonationCard from "@/components/DonationCard";
import { useEffect, useState } from "react";
import { DonationPostInfo } from "@/components/DonationCard";
import userRoleProtection from "@/hooks/userRoleProtection";
import Container from "@/components/Container";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import FilterSortPopup, { FilterOption } from "@/components/FilterSortPopup";

export default function DonationPage() {
  userRoleProtection("donor");
  const [donations, setDonations] = useState<DonationPostInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* Filter useStates*/
  const [filteredDonations, setFilteredDonations] = useState<DonationPostInfo[]>([]);
  const [frequencies, setFrequencies] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<string[]>([]);
  const [weights, setWeights] = useState<string[]>([]);

  /*   Filter Options  */
  const filterOptions: FilterOption[] = [
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
        const data = await fetch("/api/dbQueries/donations/get-all-active/");
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

  /* Filter useEffect */
  useEffect(() => {
    const filter = donations.filter((donation) => {
      const matchSearch = donation.produce_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

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

      return matchSearch && matchFrequency && matchQuantity && matchWeight;
    });

    setFilteredDonations(filter);
  }, [donations, searchQuery, frequencies, quantities, weights]);

  const produceSuggestions = Array.from(
    new Set(donations.map((d: DonationPostInfo) => d.produce_name))
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
              placeholder="Search produce..."
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

        <div className="pt-8 mx-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {filteredDonations.map((donation: DonationPostInfo) => (
            <div key={donation.post_id} className="p-2 flex justify-center">
              <DonationCard
                produceName={donation.produce_name}
                quantity={donation.quantity}
                donorEmail={donation.donor_email}
                donorName={donation.donor_name}
                createdOn={new Date(donation.created_on)}
                frequency={donation.frequency}
              />
            </div>
          ))}

          {filteredDonations.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              {searchQuery
                ? "No matching donations found"
                : "No active donations available"}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
