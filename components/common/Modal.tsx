"use client";
import React, { useRef, useEffect, useCallback } from "react";

const FOCUSABLE_SELECTOR = [
  'a[href]:not([disabled])',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((el) => !el.closest('[aria-hidden="true"]'));
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  /** Extra classes on the outer fixed overlay (e.g. higher z-index for nested confirms) */
  rootClassName?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // New prop to control close button visibility
  isFullscreen?: boolean; // Default to false for backwards compatibility
  /** Prefer over ariaLabel when a visible heading has this id */
  ariaLabelledBy?: string;
  /** Fallback accessible name when ariaLabelledBy is not used */
  ariaLabel?: string;
  /** Optional id of descriptive content inside the dialog */
  ariaDescribedBy?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  rootClassName = "",
  showCloseButton = true, // Default to true for backwards compatibility
  isFullscreen = false,
  ariaLabelledBy,
  ariaLabel,
  ariaDescribedBy,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  /** Move focus into the dialog when opened; restore previous focus on close. */
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.activeElement as HTMLElement | null;

    const frameId = requestAnimationFrame(() => {
      const root = modalRef.current;
      if (!root) return;
      const focusables = getFocusableElements(root);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        if (!root.hasAttribute("tabindex")) {
          root.setAttribute("tabindex", "-1");
        }
        root.focus();
      }
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (
        previous &&
        typeof previous.focus === "function" &&
        document.body.contains(previous)
      ) {
        previous.focus();
      }
    };
  }, [isOpen]);

  /** Keep keyboard focus inside the modal while open. */
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const root = modalRef.current;
      if (!root) return;
      const focusables = getFocusableElements(root);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !root.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full rounded-3xl bg-white";

  const hasLabelledBy =
    typeof ariaLabelledBy === "string" && ariaLabelledBy.trim() !== "";
  const dialogAriaLabel = hasLabelledBy ? undefined : (ariaLabel ?? "Dialógus");

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999 ${rootClassName}`.trim()}
      role="presentation"
    >
      {!isFullscreen && (
        <div
          className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-md"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={dialogAriaLabel}
        aria-labelledby={hasLabelledBy ? ariaLabelledBy : undefined}
        aria-describedby={
          ariaDescribedBy && ariaDescribedBy !== "" ? ariaDescribedBy : undefined
        }
        className={`${contentClasses}  ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Bezárás"
            className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 sm:right-6 sm:top-6 sm:h-11 sm:w-11"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
