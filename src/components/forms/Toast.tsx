"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "fixed right-4 top-20 z-50 flex max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-xl",
        type === "success" ? "border-accent/40" : "border-red-200"
      )}
    >
      {type === "success" ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
      )}
      <p className="text-sm font-medium text-secondary">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="ml-1 shrink-0 text-slate-400 hover:text-slate-600"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
