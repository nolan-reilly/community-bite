'use client';
import React, { useState, useEffect } from "react";
import EmbeddedMap from "@/components/EmbeddedMap";
import Navbar from "@/components/Navbar";
import PantryInfoCard from "@/components/PantryInfoCard";
import { Search } from "lucide-react";

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [dbPantries, setDbPantries] = useState<any[]>([]);
  const [googPantries, setGoogPantries] = useState<any[]>([]);
  const [selectedPantry, setSelectedPantry] = useState<any | null>(null);
  const [mergedPantries, setMergedPantries] = useState<any[]>([]);

  const [filterValue, setFilterValue] = useState<string>("");
  const [applied, setApplied] = useState<boolean>(false);

  // default is set to UIC
  const [centralPoint, setCentralPoint] = useState({
    lat: 41.871889,
    lng: -87.64925
  });

  useEffect(() => {
    const merge = Array.from(
      new Map(
        [...(googPantries || []), ...(dbPantries || [])].map(pantry => [pantry.id, pantry])
      ).values()
    );

    setMergedPantries(merge);
  }, [dbPantries, googPantries]);

  useEffect(() => {
    console.log("render...");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCentralPoint({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      })
    }
    setIsLoaded(true);
  }, [])

  useEffect(() => {
    const fetchPantries = async () => {
      const callBody = {
        userLat: centralPoint.lat,
        userLong: centralPoint.lng,
        maxDist: 13 // kilometers
      }

      try {
        const response = await fetch("/api/dbQueries/nearby-food-banks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(callBody)
        });

        if (!response.ok) {
          const err = await response.json();
          console.log(err.message);
          return;
        }

        const data = await response.json();
        return data;
      }
      catch (error) {
        console.log("Error fetching pantries: ", (error as Error).message);
      }

    };
    
    fetchPantries().then(data => {
      if (data) {
        setDbPantries(data.db_pantries);
        setGoogPantries(data.ggl_pantries);
      } else {
        setDbPantries([]);
        setGoogPantries([]);
      }
    })
  }, [centralPoint]);

  const handlePantrySelect = (pantry: any) => {
    setSelectedPantry(pantry);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleSearch = () => {
    const filter = filterValue.toLowerCase().replace(/s$/i, '');

    if (filter.trim() === "") {
      resetSearch();
      return;
    }

    const filtered = dbPantries.filter(pantry => {
      return pantry.inventory.some((item: any) => {
        const itemName = item.produce_name.toLowerCase().replace(/s$/i, '');
        return itemName.includes(filter) || filter.includes(itemName);
      });
    });

    setMergedPantries(filtered);
    setApplied(true);
    setSelectedPantry(null);
  };

  const resetSearch = () => {
    const merged = Array.from(
      new Map(
        [...(googPantries || []), ...(dbPantries || [])].map(pantry => [pantry.id, pantry])
      ).values()
    );

    setMergedPantries(merged);
    setApplied(false);
    setSelectedPantry(null);
    setFilterValue("");
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="relative h-full w-full flex flex-col flex-grow">
        <div className="absolute flex flex-col justify-between flex-grow h-[95%] left-4 mt-4 z-50" >
          <div className="flex h-[5%] gap-5" >
            {/* Pantry Inventory Search */}
            <div className="flex w-[400px] h-full bg-white border border-gray-300 rounded-xl shadow-lg" >
              <input 
                type="text"
                className="bg-transparent my-auto mx-2 px-2 w-full h-full outline-none"
                placeholder="Search for Produce"
                value={filterValue}
                onChange={handleFilterChange}
              />
              <Search 
                className="my-auto mx-3 hover:cursor-pointer "
                size={27}
                color="#65ae2d"
                absoluteStrokeWidth={true}
                strokeWidth={3.5}
                onClick={handleSearch}
              />
            </div>
            {applied && (
              <button 
                className="bg-white my-auto text-gray-700 border border-gray-300 shadow-lg rounded-full px-4 h-[36px] hover:bg-gray-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onClick={resetSearch}
              >
                Reset Search
              </button>
            )}
          </div>
          {/* Pantry Results */}
          <div className="w-[400px] h-[93%] bg-white opacity-95 border border-gray-300 rounded-xl shadow-lg">
            <h1 className="text-center text-xl py-2 font-bold opacity-100" >Nearby Pantries</h1>
            <div className="h-[94%] overflow-y-auto scrollbar-thin">
            {mergedPantries.length > 0 ? (
              mergedPantries
                .sort((a: any, b: any) => a.distance.value - b.distance.value)
                .map((pantry) => (
                  <PantryInfoCard
                    key={pantry.id}
                    pantry={pantry}
                    className="h-[130px] px-4 py-1 pt-3 flex flex-col justify-around hover:bg-gray-100 hover:cursor-pointer"
                    isSearchable={dbPantries.includes(pantry)}
                    setSelectedPantry={handlePantrySelect}
                  />
                ))
            ) : (
              <div className="text-center text-gray-500 py-6">
                No matching pantries found.
              </div>
            )}

            </div>
          </div>
        </div>
        <div id="map-display"
          className="flex-grow h-full w-full"
        >
          {isLoaded && (
            <EmbeddedMap 
              center={centralPoint}
              db_pantries={!applied ? dbPantries : mergedPantries}
              goog_pantries={!applied ? googPantries : []}
              selectedPantry={selectedPantry}
              setSelectedPantry={handlePantrySelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}
