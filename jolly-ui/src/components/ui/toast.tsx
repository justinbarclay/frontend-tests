import React, { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex min-w-[300px] items-center justify-between rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-10 ${
              t.type === "success"
                ? "bg-emerald-500 text-white"
                : t.type === "error"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-background text-foreground"
            }`}
          >
            <span className="text-sm font-medium">{t.message}</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-current hover:bg-black/10"
              onPress={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
