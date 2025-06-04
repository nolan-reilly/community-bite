import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export interface DialogProp {
  title: string;
  description: string;
  action: () => void;
  triggerLabel?: string;
  disabled?: boolean;
}

export default function AlertDialog_({
  title,
  description,
  action,
  triggerLabel = "Confirm Action",
  disabled = false,
}: DialogProp) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          disabled={disabled}
          className="flex-1 h-[35px] items-center justify-center rounded bg-red4 px-[15px] font-medium leading-none text-red11 outline-none outline-offset-1 hover:bg-red5 focus-visible:outline-2 focus-visible:outline-red7 select-none disabled:opacity-50"
        >
          {triggerLabel}
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
          <AlertDialog.Title className="text-lg font-semibold text-black">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 text-sm text-gray-600">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-4 mt-6">
            <AlertDialog.Cancel asChild>
              <button className="inline-flex h-[35px] items-center justify-center rounded bg-mauve4 px-[15px] font-medium leading-none text-mauve11 outline-none outline-offset-1 hover:bg-mauve5 focus-visible:outline-2 focus-visible:outline-mauve7 select-none">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={action}
                className="inline-flex h-[35px] items-center justify-center rounded bg-red4 px-[15px] font-medium leading-none text-red11 outline-none outline-offset-1 hover:bg-red5 focus-visible:outline-2 focus-visible:outline-red7 select-none"
              >
                Yes, Proceed
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}