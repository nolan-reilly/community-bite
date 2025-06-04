'use client';
import * as React from "react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AddProduce } from "@/app/food-bank/inventory/script";
import { useToast } from "@/hooks/use-toast";

export interface ProduceItem {
  produce_name: string;
  quantity: number;
  readonly: boolean;
  disableButton: boolean;
  clearOnSubmit: boolean;
}

export default function AddProducePopup(item: ProduceItem) {
  const [produceName, setProduceName] = useState(item.produce_name);
  const [quantity, setQuantity] = useState(item.quantity);
  const isFormValid = produceName !== "" && quantity > 0;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
          disabled={item.disableButton}
        >
          Add To Inventory
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />

        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[20px] font-semibold text-black">
            Add Produce
          </Dialog.Title>

          <Dialog.Description className="mb-4 mt-2 text-[14px] leading-normal text-blue-500">
            Enter produce details to create a new inventory item or update the quantity of an existing item.
          </Dialog.Description>

          {/* Produce Input */}
          <fieldset className="mb-[15px] flex items-center gap-5">
            <Label className="w-[90px] text-right text-[15px] text-blackA11" htmlFor="produce_name">
              Produce
            </Label>
            <input
              className="inline-flex h-[35px] w-1/2 items-center justify-center rounded px-2.5 text-[15px] leading-none text-blackA11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
              id="produce_name"
              placeholder="Eggs"
              value={produceName}
              readOnly={item.readonly}
              onChange={(e) => setProduceName(e.target.value)}
              required
            />
          </fieldset>

          {/* Quantity Input */}
          <fieldset className="mb-[15px] flex items-center gap-5">
            <Label className="w-[90px] text-right text-[15px] text-blackA11" htmlFor="quantity">
              Quantity
            </Label>
            <input
              className="inline-flex h-[35px] w-1/2 items-center justify-center rounded px-2.5 text-[15px] leading-none text-blackA11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
              id="quantity"
              type="number"
              placeholder="20"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              min="1"
            />
          </fieldset>

          {!isFormValid && (
            <p className="text-red-500 text-sm mt-2">Please fill out all fields before saving.</p>
          )}

          {/* Save Button */}
          <div className="mt-[25px] flex justify-end">
            <AddProduceTriggerButton
              produceName={produceName}
              quantity={quantity}
              disabled={!isFormValid}
              clearOnSubmit={item.clearOnSubmit}
              clearFields={() => {
                setProduceName("");
                setQuantity(0);
              }}
            />
          </div>

          {/* Close Button */}
          <Dialog.Close asChild>
            <button
              className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-red10 bg-gray4 hover:bg-red4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function AddProduceTriggerButton({
  produceName,
  quantity,
  disabled,
  clearOnSubmit,
  clearFields,
}: {
  produceName: string;
  quantity: number;
  disabled: boolean;
  clearOnSubmit: boolean;
  clearFields: () => void;
}) {
  const { toast } = useToast();

  const handleSave = async () => {
    const response = await AddProduce(produceName, quantity);

    if (!response) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: "Something went wrong. Please try again.",
      });
    } else if (response.success) {
      toast({
        variant: "success",
        title: "Inventory Updated",
        description: `${produceName} added successfully.`,
      });
      if (clearOnSubmit) clearFields();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: String(response.error),
      });
    }
  };

  return (
    <Dialog.Close asChild>
      <Button
        className="h-[35px] bg-green4 text-green11 hover:bg-green5 focus-visible:outline-green6"
        disabled={disabled}
        onClick={handleSave}
      >
        Save changes
      </Button>
    </Dialog.Close>
  );
}
