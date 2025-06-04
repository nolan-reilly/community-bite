'use client';
import * as React from "react";
import { useEffect, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Collapsible from "@radix-ui/react-collapsible";
import { CheckIcon } from "@radix-ui/react-icons";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleCheckboxGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
  openAll: boolean;
}

export default function CollapsibleCheckboxGroup({
  title,
  options,
  selected,
  onChange,
  openAll,
}: CollapsibleCheckboxGroupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openAll);
  }, [openAll]);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <button
          className="flex items-center text-black justify-between w-full py-2 mt-4 text-left font-semibold border-b"
        >
          {title}
          {open ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="flex flex-col gap-2 mt-2 pl-2">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <Checkbox.Root
                className="w-4 h-4 border rounded"
                id={option}
                checked={selected.includes(option)}
                onCheckedChange={() => handleToggle(option)}
              >
                <Checkbox.Indicator className="bg-black w-full h-full text-white flex items-center justify-center">
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className="text-m">{option}</span>
            </label>
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
