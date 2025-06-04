import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2, Pencil, Save } from "lucide-react";

interface InventoryItemCardProps {
    produce_name: string;
    quantity: number;
};

export default function InventoryItemCard({produce_name, quantity}: InventoryItemCardProps) {
    const [editable, setEditable] = useState(false);
    const [newQuantity, setNewQuantity] = useState(quantity);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewQuantity(e.target.value === "" ? newQuantity : parseInt(e.target.value));
    }

    const handleEdit = async () => {
        // Add edit functionality here
        if (newQuantity === quantity) {
            setEditable(false);
            return;
        }

        // Else, make API call to update quantity
        await saveEdit();
    }

    const saveEdit = async () => {
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
                alert("Failed to update inventory item");
                return;
            }

            setEditable(false);
        } catch (error) {
            console.error("Error updating inventory item:", error);
        }
    }

    const handleDelete = async () => {
        // Add delete functionality here
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
                alert("Failed to delete inventory item");
                return;
            }

            // Item should be removed from database
        } catch (error) {
            console.error("Error deleting inventory item:", error);
        }
    }

    return (
        <div className="flex flex-row justify-between border border-gray-200 rounded-md shadow-2xl p-4 w-[200px] h-[150px]">
            <div className="flex flex-col justify-center gap-2">
                <Label className="pl-1">{produce_name}</Label>
                <Input 
                    className="w-[75px]"
                    type="number" value={newQuantity} disabled={!editable}
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col justify-around">
                {editable ? (
                    <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleEdit}
                    >
                        <Save size={24} />
                    </Button>
                ) : (
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setEditable(true)}
                    >
                        <Pencil size={24} />
                    </Button>
                )}
                <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDelete}
                >
                    <Trash2 size={24} />
                </Button>
            </div>
        </div>
    )
}