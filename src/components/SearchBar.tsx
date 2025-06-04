"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Simulating filtered search results
    // TODO: update to read data from your actual data source
    if (value) {
      setResults(
        ["Apple", "Banana", "Cherry", "Date", "Orange", "Eggs"].filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setResults([]);
    }
  };

  return (
    // Possibly Change back to being popover in the future

    <div className="relative w-96">
      <div className="relative w-full">
        <Input
          placeholder="Type to search..."
          value={query}
          onChange={handleSearch}
          onBlur={() => {
            setTimeout(() => setResults([]), 0);
          }}
          className="w-full pr-10"
        />

        <Image
          src="/magnify.svg"
          alt="Search icon"
          width={20}
          height={20}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 border border-gray-200 rounded-md bg-white z-10">
          {results.map((result, index) => (
            <div
              key={index}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery(result);
                setResults([]);
              }}
            >
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
