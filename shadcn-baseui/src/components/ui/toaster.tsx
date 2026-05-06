"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { toastManager } from "@/lib/toast-manager";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastPositioner,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

function ToasterInner() {
  const { toasts } = ToastPrimitive.useToastManager();

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <ToastPositioner key={toast.id} toast={toast}>
          <Toast toast={toast}>
            <div className="grid gap-1">
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        </ToastPositioner>
      ))}
    </ToastViewport>
  );
}

export function Toaster() {
  return (
    <ToastProvider toastManager={toastManager}>
      <ToasterInner />
    </ToastProvider>
  );
}
