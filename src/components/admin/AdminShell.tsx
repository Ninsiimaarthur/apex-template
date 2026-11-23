"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Images, Package, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/admin/SignOutButton";

const links = [
  { href: "/admin", label: "Business Info", icon: Store },
  { href: "/admin/products", label: "Products & Services", icon: Package },
  { href: "/admin/projects", label: "Projects Gallery", icon: Images },
];

const itemClass = "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition";

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="bg-secondary text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
        <div className="px-4 pb-2 pt-4 lg:px-6 lg:pb-4 lg:pt-6">
          <p className="text-lg font-bold">Site Admin</p>
          <p className="truncate text-xs text-white/60">{email}</p>
        </div>

        <nav
          aria-label="Admin"
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-4 lg:pb-6"
        >
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                itemClass,
                pathname === href ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(itemClass, "text-white/70 hover:bg-white/10 hover:text-white lg:mt-auto")}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View site
          </a>
          <SignOutButton className={cn(itemClass, "text-white/70 hover:bg-white/10 hover:text-white")} />
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
