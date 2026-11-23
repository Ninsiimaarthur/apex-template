"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps public pages with the navbar/footer/WhatsApp button, and steps aside
 * for /admin so the admin portal gets its own layout.
 */
export function SiteChrome({
  header,
  footer,
  floating,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  floating: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
      {floating}
    </>
  );
}
