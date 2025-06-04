'use client';
import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { BadgeX, Trash2 } from "lucide-react";

export default function DeleteIconDialog({
  title,
  description,
  onConfirm,
  disabled = false,
  icon,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  disabled?: boolean;
  icon: string;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          className="hover:bg-red-100 p-1 rounded transition"
          title={title}
          disabled={disabled}
        >
          {icon === "BadgeX" ? (
            <BadgeX className="text-red-500 w-5 h-5" />
          ) : (
            <Trash2 className="text-red-500 w-5 h-5" />
          )}
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-5 shadow-lg focus:outline-none">
          <AlertDialog.Title className="text-lg font-semibold text-red-600">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-gray-600">
            {description}
          </AlertDialog.Description>
          <div className="mt-5 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Yes, Delete
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
