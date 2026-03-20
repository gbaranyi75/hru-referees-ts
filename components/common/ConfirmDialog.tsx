"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/common/Modal";
import OutlinedButton from "@/components/common/OutlinedButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import DisabledButton from "@/components/common/DisabledButton";
import DeleteButton from "@/components/common/DeleteButton";

export type ConfirmDialogVariant = "danger" | "primary";

export type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  /** Shows loading state on the confirm action */
  isLoading?: boolean;
  loadingConfirmText?: string;
  /** Modal close (X); default false for compact confirm flows */
  showCloseButton?: boolean;
  className?: string;
};

const defaultCancel = "Mégse";
const defaultConfirmDanger = "Törlés";
const defaultConfirmPrimary = "Megerősítés";
const defaultLoading = "Folyamatban…";

/**
 * Accessible, styled confirmation overlay (replaces window.confirm).
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = defaultCancel,
  variant = "danger",
  isLoading = false,
  loadingConfirmText = defaultLoading,
  showCloseButton = false,
  className = "max-w-md p-6 lg:p-8",
}: ConfirmDialogProps) {
  const resolvedConfirmText =
    confirmText ??
    (variant === "danger" ? defaultConfirmDanger : defaultConfirmPrimary);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={showCloseButton}
      className={className}
      rootClassName="!z-[200000]"
    >
      <div className="flex flex-col px-1 pt-2">
        <h2 className="text-center text-xl font-semibold text-gray-700">
          {title}
        </h2>
        {message != null && message !== "" && (
          <div className="mt-3 text-center text-sm text-gray-600">{message}</div>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <OutlinedButton
            type="button"
            onClick={onClose}
            text={cancelText}
          />
          {isLoading ? (
            <DisabledButton text={loadingConfirmText} />
          ) : variant === "danger" ? (
            <DeleteButton
              type="button"
              onClick={() => onConfirm()}
              text={resolvedConfirmText}
            />
          ) : (
            <PrimaryButton
              type="button"
              onClick={() => onConfirm()}
              text={resolvedConfirmText}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
