"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import userRoleProtection from "@/hooks/userRoleProtection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Save, ArrowUpDown } from "lucide-react";
import Container from "@/components/Container";
import AddProducePopup from "@/components/AddProducePopup";
import Navbar from "@/components/Navbar";
import { AlertDisplay, AlertInfo } from "@/components/Alert";
import DeleteIconDialog from "@/components/DeleteIconDialog";
import { useToast } from "@/hooks/use-toast";
import FilterSortPopup, { FilterOption } from "@/components/FilterSortPopup";

interface InventoryItem {
  produce_name: string;
  quantity: number;
}

export default function Page() {
  userRoleProtection("food-bank");
  const router = useRouter();
  const { toast } = useToast();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"produce_name" | "quantity" | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAlert, setShowAlert] = useState(false);
  const [alertToDisplay, setAlert] = useState<AlertInfo>();

  /* Filter useStates*/
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [quantities, setQuantities] = useState<string[]>([]);

/*   Filter Options  */
  const filterOptions: FilterOption[] = [
    {
      title: "Quantity",
      options: ["0 - 50", "51 - 100", "100+"],
      selected: quantities,
      onChange: setQuantities,
    }
  ];
  const _displayAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const handleSortClick = (column: "produce_name" | "quantity") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      const token = sessionStorage.getItem("token");
      const email = sessionStorage.getItem("email");
      try {
        const response = await fetch(`/api/food-bank/inventory/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          console.log(Error("Failed to fetch inventory"));
        }
        const data = await response.json();
        setInventory(data?.inventory ? data.inventory.reverse() : []);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Failed to fetch inventory. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
    const interval = setInterval(fetchInventory, 3000);
    return () => clearInterval(interval);
  }, [router]);

    /* Filter useEffect */
    useEffect(() => {
      const filter = inventory.filter((item) => {
        const matchSearch = item.produce_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
  
        const matchQuantity =
          quantities.length === 0 ||
          quantities.some((range) => {
            const [min, max] =
              range === "100+"
                ? [100, Infinity]
                : range.split(" - ").map(Number);
            return item.quantity >= min && item.quantity <= max;
          });
  
        return matchSearch  && matchQuantity;
      });
  
      setFilteredInventory(filter);
    }, [inventory, searchQuery, quantities]);

  const produceSuggestions = Array.from(
    new Set(inventory.map((d: InventoryItem) => d.produce_name))
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {showAlert && alertToDisplay && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <AlertDisplay {...alertToDisplay} />
        </div>
      )}
      <Navbar root="/food-bank">
        {/* Search Input */}
        <div className="relative mx-auto max-w-2xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search inventory..."
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
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <div className="flex flex-wrap gap-2">
              <div className="w-[140px]">
                <AddProducePopup
                  produce_name=""
                  quantity={0}
                  readonly={false}
                  disableButton={false}
                  clearOnSubmit={true}
                />
              </div>
              <div className="w-[140px]">
                <FilterSortPopup filterOptions={filterOptions} />
              </div>
            </div>
          </div>
          <Table className="mb-8">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">
                  <Button
                    variant="ghost"
                    className="px-0 hover:bg-transparent"
                    onClick={() => handleSortClick("produce_name")}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <p>Item Name</p>
                      <ArrowUpDown />
                      <span className="text-sm">
                        {sortBy === "produce_name"
                          ? sortDirection === "desc"
                            ? "▼"
                            : "▲"
                          : ""}
                      </span>
                    </div>
                  </Button>
                </TableHead>
                <TableHead className="text-left w-[200px]">
                  <Button
                    variant="ghost"
                    className="px-0 hover:bg-transparent"
                    onClick={() => handleSortClick("quantity")}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <p>Quantity</p>
                      <ArrowUpDown />
                      <span className="text-sm">
                        {sortBy === "quantity"
                          ? sortDirection === "desc"
                            ? "▼"
                            : "▲"
                          : ""}
                      </span>
                    </div>
                  </Button>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  {searchQuery || quantities.length > 0
                    ? "No matching items found"
                    : "Your inventory is currently empty."}
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory
                .slice()
                .sort((a, b) => {
                  if (!sortBy) return 0;
                  const modifier = sortDirection === "asc" ? 1 : -1;
                  if (sortBy === "produce_name") {
                    return a.produce_name.localeCompare(b.produce_name) * modifier;
                  }
                  return (a.quantity - b.quantity) * modifier;
                })
                .map((item) => (
                  <TableRow key={item.produce_name}>
                    <TableCell>{item.produce_name}</TableCell>
                    <TableCell>
                      {editingItem === item.produce_name ? (
                        <Input
                          type="number"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(Number(e.target.value))}
                          className="w-24"
                        />
                      ) : (
                        item.quantity
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {editingItem === item.produce_name ? (
                          <SaveEditButton
                            produce_name={item.produce_name}
                            newQuantity={newQuantity}
                            onSuccess={() => setEditingItem(null)}
                          />
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingItem(item.produce_name);
                              setNewQuantity(item.quantity);
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                        )}
                        <DeleteItemButton
                          produce_name={item.produce_name}
                          onDelete={() =>
                            setInventory((prev) =>
                              prev.filter((i) => i.produce_name !== item.produce_name)
                            )
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
          </Table>
        </div>
      </Container>
    </div>
  );
}

function SaveEditButton({
  produce_name,
  newQuantity,
  onSuccess,
}: {
  produce_name: string;
  newQuantity: number;
  onSuccess: () => void;
}) {
  const { toast } = useToast();

  const handleEdit = async () => {
    const token = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");
    if (!token || !email) return;

    try {
      const response = await fetch(`/api/food-bank/inventory/modify-produce`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_email: email,
          produce_name,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Could not update the inventory item.",
        });
        return;
      }

      toast({
        variant: "success",
        title: "Inventory Updated",
        description: `${produce_name} quantity updated to ${newQuantity}`,
      });

      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
      console.error("Edit error:", error);
    }
  };

  return (
    <Button
      size="sm"
      className="bg-green-600 hover:bg-green-700 text-white"
      onClick={handleEdit}
    >
      <Save size={16} />
    </Button>
  );
}

function DeleteItemButton({
  produce_name,
  onDelete,
}: {
  produce_name: string;
  onDelete: () => void;
}) {
  const { toast } = useToast();

  return (
    <DeleteIconDialog
      title="Delete Item"
      description="This will permanently remove the inventory item."
      icon="Trash2"
      onConfirm={async () => {
        const token = sessionStorage.getItem("token");
        const email = sessionStorage.getItem("email");
        if (!token || !email) return;

        try {
          const response = await fetch(`/api/food-bank/inventory/modify-produce`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              business_email: email,
              produce_name,
            }),
          });

          if (!response.ok) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not delete item.",
            });
            return;
          }

          toast({
            variant: "safeDelete",
            title: "Deleted",
            description: "Item removed successfully.",
          });

          onDelete();
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed",
            description: "An unexpected error occurred.",
          });
          console.error("Delete error:", error);
        }
      }}
    />
  );
}
