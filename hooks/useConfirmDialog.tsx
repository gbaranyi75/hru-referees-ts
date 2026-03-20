"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConfirmDialog,
  ConfirmDialogVariant,
} from "@/components/common/ConfirmDialog";

export type RequestConfirmOptions = {
  title: string;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
};

/**
 * Promise-based confirm dialog. Render `confirmDialog` once in your tree (e.g. fragment sibling).
 *
 * @example
 * const { requestConfirm, confirmDialog } = useConfirmDialog();
 * const ok = await requestConfirm({ title: "Törlés?", message: "..." });
 * if (ok) { ... }
 * return (<>{confirmDialog}<div>...</div></>);
 *
 * Re-entry: if a confirm is already open, the same Promise is returned (e.g. double-click)
 * so the first await is not left hanging. On unmount, any pending Promise resolves to false.
 */
export function useConfirmDialog() {
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const pendingPromiseRef = useRef<Promise<boolean> | null>(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<RequestConfirmOptions>({
    title: "",
  });

  useEffect(() => {
    return () => {
      const resolve = resolverRef.current;
      resolverRef.current = null;
      pendingPromiseRef.current = null;
      resolve?.(false);
    };
  }, []);

  const finish = useCallback((value: boolean) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    pendingPromiseRef.current = null;
    setOpen(false);
    resolve?.(value);
  }, []);

  const requestConfirm = useCallback((opts: RequestConfirmOptions) => {
    if (resolverRef.current !== null && pendingPromiseRef.current !== null) {
      return pendingPromiseRef.current;
    }

    const promise = new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOptions(opts);
      setOpen(true);
    });
    pendingPromiseRef.current = promise;
    return promise;
  }, []);

  const handleClose = useCallback(() => finish(false), [finish]);
  const handleConfirm = useCallback(() => finish(true), [finish]);

  const confirmDialog = (
    <ConfirmDialog
      isOpen={open}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      variant={options.variant ?? "danger"}
    />
  );

  return {
    requestConfirm,
    confirmDialog,
  };
}
