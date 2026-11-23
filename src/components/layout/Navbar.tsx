"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { cn, telLink } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

type NavbarProps = {
  brand: { name: string; logo?: string };
  phone: string;
  nav: { label: string; href: string }[];
};

/**
 * Responsive behaviour:
 *  - < 1024px (lg): logo + hamburger menu, so nothing can clip on phones/tablets
 *  - 1024–1279px: full nav + icon-only phone button + "Get a Quote"
 *  - 1280px+ (xl): phone number text is shown too
 */
export function Navbar({ brand, phone, nav }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          {brand.logo ? (
            <Image src={brand.logo} alt={brand.name} width={40} height={40} className="h-10 w-10" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
              {brand.name.charAt(0)}
            </span>
          )}
          <span className="whitespace-nowrap text-lg font-bold text-secondary">{brand.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition hover:text-primary",
                pathname === item.href ? "text-primary" : "text-slate-600"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex xl:gap-4">
          <a
            href={telLink(phone)}
            aria-label={`Call ${phone}`}
            className="flex items-center gap-2 rounded-full p-2 text-sm font-semibold text-secondary hover:text-primary xl:p-0"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden xl:inline">{phone}</span>
          </a>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-md p-2 text-secondary lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-base font-medium",
                  pathname === item.href ? "bg-primary/10 text-primary" : "text-slate-700"
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={telLink(phone)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-700"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {phone}
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-primary px-4 py-3 text-center font-semibold text-white"
            >
              Get a Quote
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
