import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteData, hexToHslTriplet } from "@/lib/site-data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SiteChrome } from "@/components/layout/SiteChrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteData();
  return {
    title: {
      default: `${brand.name} | ${brand.tagline}`,
      template: `%s | ${brand.name}`,
    },
    description: brand.description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, brand, contact, nav, colors } = await getSiteData();

  const themeVars = {
    "--primary": hexToHslTriplet(colors.primaryHex, "24 95% 53%"),
    "--secondary": hexToHslTriplet(colors.secondaryHex, "215 28% 17%"),
    "--accent": hexToHslTriplet(colors.accentHex, "142 71% 45%"),
  } as React.CSSProperties;

  return (
    <html lang={locale} style={themeVars}>
      <body className={`${inter.variable} font-sans`}>
        <SiteChrome
          header={<Navbar brand={brand} phone={contact.phone} nav={nav} />}
          footer={<Footer />}
          floating={<FloatingWhatsApp />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
