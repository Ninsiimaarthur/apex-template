export type IconName =
  | "Sun"
  | "Zap"
  | "Battery"
  | "BatteryCharging"
  | "ShieldCheck"
  | "Wrench"
  | "Clock"
  | "BadgeCheck"
  | "Phone"
  | "MessageCircle"
  | "Mail"
  | "MapPin"
  | "Star"
  | "Plug"
  | "Home"
  | "Building2"
  | "Lightbulb"
  | "Gauge"
  | "Users"
  | "Award"
  | "HandCoins"
  | "ArrowRight"
  | "Check";

/** A call-to-action. `whatsapp` and `phone` use the numbers in `contact`. */
export type Cta =
  | { label: string; type: "whatsapp"; message?: string } // message overrides contact.whatsappMessage
  | { label: string; type: "phone" }
  | { label: string; type: "link"; href: string };

/** A service or product. Mirrors the `services_products` table. */
export type Offering = {
  id?: string;
  slug: string; // generated from the title, used for #anchors and ?service= links
  title: string;
  category: string;
  description: string;
  priceUgx: number | null; // null shows "Get a quote"
  features: string[];
  imageUrl: string | null;
  isFeatured: boolean;
};

/** A past project. Mirrors the `projects` table. */
export type Project = {
  id?: string;
  title: string;
  category: string;
  location: string;
  summary?: string;
  specs?: string; // e.g. "5 kW hybrid · 10 kWh battery"
  image?: string; // leave empty to show a clean placeholder
};

export type TeamMember = {
  name: string;
  role: string;
  photo?: string;
};

export type SiteConfig = {
  locale: string;
  brand: {
    name: string;
    tagline: string;
    description: string; // SEO meta description
    logo?: string; // path under /public; leave empty to use a letter mark
  };
  contact: {
    phone: string;
    whatsapp: string; // digits only, with country code, no "+"
    whatsappMessage: string;
    email: string;
    address: string;
    mapEmbedUrl: string; // Google Maps "Embed a map" src URL; empty = placeholder
  };
  hours: { days: string; time: string }[];
  hero: {
    badge?: string;
    headline: string;
    subheadline: string;
    bullets: string[];
    primaryCta: Cta;
    secondaryCta: Cta;
    image?: string;
  };
  trustBadges: { value: string; label: string }[];
  services: Offering[];
  whyChooseUs: { title: string; text: string; icon: IconName }[];
  about: {
    mission: string;
    story: string[];
    values: { title: string; text: string; icon: IconName }[];
    credentials: { title: string; text: string; icon: IconName }[]; // safety & licensing highlights
    team: TeamMember[];
  };
  projects: {
    categories: string[];
    items: Project[];
  };
  testimonials: { name: string; role: string; quote: string; rating: number }[];
  faqs: { question: string; answer: string }[];
  cta: { headline: string; text: string };
  social: { facebook?: string; instagram?: string; linkedin?: string };
  nav: { label: string; href: string }[];
};
