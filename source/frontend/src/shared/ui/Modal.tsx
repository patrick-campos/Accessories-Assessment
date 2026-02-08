import * as React from "react";
import { Button } from "./Button";

type ModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
};

export function Modal({
  isOpen,
  title,
  message,
  onClose,
  primaryAction,
  secondaryAction,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  let secondaryNode: React.ReactNode = null;
  if (secondaryAction) {
    secondaryNode = <div>{secondaryAction}</div>;
  }

  let primaryNode: React.ReactNode = null;
  if (primaryAction) {
    primaryNode = <div>{primaryAction}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
      <div className="w-full max-w-[72rem] rounded-sm bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-dune px-6 py-4">
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          <Button type="button" variant="ghost" className="px-2 py-1" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm text-clay">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-4 border-t border-dune px-6 py-4">
          {secondaryNode}
          {primaryNode}
        </div>
      </div>
    </div>
  );
}
