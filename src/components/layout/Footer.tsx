import Link from "next/link";
import { getSiteData } from "@/lib/site-data";
import { telLink } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export async function Footer() {
  const { brand, contact, hours, nav, social } = await getSiteData();
  const socials = Object.entries(social).filter(([, url]) => Boolean(url));

  return (
    <footer className="bg-secondary text-white/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-bold text-white">{brand.name}</p>
          <p className="mt-3 text-sm">{brand.tagline}</p>
          {socials.length > 0 && (
            <ul className="mt-4 flex gap-4 text-sm">
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="capitalize underline-offset-4 hover:text-white hover:underline"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Quick links</p>
          <ul className="space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Contact</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Icon name="Phone" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href={telLink(contact.phone)} className="hover:text-white">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="Mail" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="MapPin" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{contact.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Opening hours</p>
          <ul className="space-y-2 text-sm">
            {hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-right">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
