import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/site-data";
import { contactSchema, type ContactInput } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot filled in: pretend success so bots learn nothing.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendWithResend(data);

    // Optional: also store the lead in Supabase (uncomment the function below).
    // await saveToSupabase(data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Failed to process lead:", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your message. Please try WhatsApp or call us instead." },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/* Resend (email notification)                                        */
/* Uses Resend's REST API directly, so no extra dependency is needed. */
/* ------------------------------------------------------------------ */
async function sendWithResend(data: ContactInput) {
  const site = await getSiteData();
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Website Leads <onboarding@resend.dev>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }
    // Dev convenience: the form works end-to-end without credentials.
    console.warn("[contact] RESEND_API_KEY not set. Lead logged instead of emailed:\n", data);
    return;
  }

  const text = [
    `New enquiry from ${site.brand.name} website`,
    "",
    `Name: ${data.name}`,
    `Phone / WhatsApp: ${data.phone}`,
    `Email: ${data.email || "(not provided)"}`,
    `Service: ${data.service}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email || undefined,
      subject: `New enquiry: ${data.service} (${data.name})`,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}

/* ------------------------------------------------------------------ */
/* Supabase fallback / lead storage (disabled by default)             */
/*                                                                    */
/* 1. Create the table in the Supabase SQL editor:                    */
/*      create table leads (                                          */
/*        id uuid primary key default gen_random_uuid(),              */
/*        created_at timestamptz default now(),                       */
/*        name text, phone text, email text, service text, message text */
/*      );                                                            */
/* 2. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.   */
/* 3. Uncomment this function and the call in POST above.             */
/* ------------------------------------------------------------------ */
// async function saveToSupabase(data: ContactInput) {
//   const url = process.env.SUPABASE_URL;
//   const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
//   if (!url || !key) throw new Error("Supabase env vars are not set");
//
//   const res = await fetch(`${url}/rest/v1/leads`, {
//     method: "POST",
//     headers: {
//       apikey: key,
//       Authorization: `Bearer ${key}`,
//       "Content-Type": "application/json",
//       Prefer: "return=minimal",
//     },
//     body: JSON.stringify({
//       name: data.name,
//       phone: data.phone,
//       email: data.email || null,
//       service: data.service,
//       message: data.message,
//     }),
//   });
//   if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
// }
