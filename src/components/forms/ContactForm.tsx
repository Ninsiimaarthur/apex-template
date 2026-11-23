"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { contactSchema } from "@/lib/validation";
import { Toast } from "@/components/forms/Toast";

type Status = "idle" | "loading" | "success" | "error";
type FieldName = "name" | "phone" | "email" | "service" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-500";

const toErrors = (fe: Record<string, string[] | undefined>): FieldErrors => ({
  name: fe.name?.[0],
  phone: fe.phone?.[0],
  email: fe.email?.[0],
  service: fe.service?.[0],
  message: fe.message?.[0],
});

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-secondary">
        {label}
        {optional && <span className="font-normal text-slate-400"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({
  defaultService = "",
  serviceOptions,
}: {
  defaultService?: string;
  serviceOptions: string[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget; // capture before any await
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(toErrors(parsed.error.flatten().fieldErrors));
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string[] | undefined>;
      };

      if (!res.ok || !json.ok) {
        if (json.fieldErrors) setErrors(toErrors(json.fieldErrors));
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }

      form.reset();
      setStatus("success");
      setToast({ type: "success", message: "Thanks! We've received your request and will be in touch shortly." });
    } catch (err) {
      setStatus("error");
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  }

  const loading = status === "loading";
  const describe = (name: FieldName) => (errors[name] ? `${name}-error` : undefined);

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Full name" error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className={inputClass}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describe("name")}
            />
          </Field>
          <Field id="phone" label="Phone / WhatsApp" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+256 700 000 000"
              className={inputClass}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describe("phone")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="email" label="Email" optional error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describe("email")}
            />
          </Field>
          <Field id="service" label="Service needed" error={errors.service}>
            <select
              id="service"
              name="service"
              defaultValue={defaultService}
              className={inputClass}
              aria-invalid={Boolean(errors.service)}
              aria-describedby={describe("service")}
            >
              <option value="">Select a service…</option>
              {serviceOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
              <option value="Other / not sure">Other / not sure</option>
            </select>
          </Field>
        </div>

        <Field id="message" label="How can we help?" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell us about your property, current power setup and what you'd like to achieve."
            className={inputClass}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describe("message")}
          />
        </Field>

        {/* Honeypot: hidden from people, tempting for bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {status === "success" && (
          <p className="rounded-lg bg-accent/10 p-4 text-sm text-secondary" role="status">
            Request sent. We usually reply within one business day. For a faster answer, message us on WhatsApp.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            "Request a Free Quote"
          )}
        </button>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}
    </>
  );
}
