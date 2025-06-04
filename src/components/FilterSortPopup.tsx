'use client';
import * as React from "react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import CollapsibleCheckboxGroup from "./CollapsibleCheckboxGroup";
import { FastForward } from "lucide-react";

export interface FilterOption {
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

interface FilterSortPopupProps {
  filterOptions: FilterOption[];
}

const handleClear = (filters: FilterOption[]) => {
  for (const filter of filters) {
    filter.onChange([]);
  }
};


const handleToggleOptions = (expandAll: boolean, setExpandAll: React.Dispatch<React.SetStateAction<boolean>>) => {
  setExpandAll((prev) => !prev);
};

const ToggleOptions = ({
  onClick,
  toggleState,
}: {
  onClick: () => void;
  toggleState: boolean;
}) => (
  <button
    onClick={onClick}
    className="text-sm pr-5 text-center text-muted-foreground underline hover:text-black hover:rounded px-1.5 py-1.5"
  >
    {toggleState ? "Collapse All" : "Expand All"}
  </button>
);


const ClearAll = ({
  onClick,
  isVisible
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isVisible: boolean;
}) => {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="text-sm  mr-5 text-center text-muted-foreground underline hover:text-white hover:bg-black rounded px-1.5 py-1.5"
    >
      Clear All
    </button>
  );
};

export default function FilterSortPopup({ filterOptions }: FilterSortPopupProps) {

  const [expandAll, setExpandAll] = useState(false);
  const ApplyFilter = async () => {};

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button 
        className="flex bg-white text-black hover:bg-white hover:underline border-2 border-gray-700">
          <div className="flex gap-4">
            Filter & Sort  
            <SlidersHorizontal/>
          </div>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />

        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[100vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 
        rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[20px] font-semibold text-black">
            <div className="border-t">
              <div className="flex gap-4 justify-between text-2xl">
                Filter & Sort
                <ClearAll
                  onClick={() => handleClear(filterOptions)}
                  isVisible={filterOptions.some((s) => s.selected.length > 0)}
                />
              </div>
              
            </div>
          </Dialog.Title>

          <div className="mb-4 mt-2 border-b text-[14px] leading-normal text-blue-500">
            <div className="flex items-right justify-right">
              <ToggleOptions 
                onClick={() => handleToggleOptions(expandAll, setExpandAll)}
                toggleState={expandAll}
              />
            </div>
        </div>

          {/* Filter Options */}
          {Array.isArray(filterOptions) &&
            filterOptions.map((filterOption) => (
              <CollapsibleCheckboxGroup
                key={filterOption.title}
                title={filterOption.title}
                options={filterOption.options}
                selected={filterOption.selected}
                onChange={filterOption.onChange}
                openAll={expandAll}
              />
          ))}

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                className="flex flex-1 h-[35px] items-center justify-between rounded bg-green5 px-[15px] 
                font-medium leading-none text-green11 outline-none outline-offset-1 hover:bg-green9 hover:text-white
                focus-visible:outline-2 focus-visible:outline-green8 select-none"
                onClick={ApplyFilter}
              >
                Apply
                <FastForward/>
              </button>
            </Dialog.Close>
          </div>

          {/* Close Button */}
          <Dialog.Close asChild>
                <button
                  className="absolute mt-0 right-2.5 top-2.5 inline-flex size-[25px] appearance-none 
                  items-center justify-center border border-red11 square-full text-red10 bg-gray4 hover:bg-red4 focus:shadow-[0_0_0_2px] 
                  focus:shadow-violet7 focus:outline-none"
                  aria-label="Close"
                >
                  <Cross2Icon/>
                </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
