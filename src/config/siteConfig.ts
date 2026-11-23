import type { SiteConfig } from "@/types/site";

/**
 * SAFE FALLBACK + STATIC CONTENT.
 *
 * With Supabase configured, business info, services/products and projects are
 * read from the database (editable at /admin) and the matching values below are
 * only used if the database is empty or unreachable. Everything else here
 * (hero bullets, testimonials, FAQs, story, team, nav...) is always read from
 * this file. Without Supabase env vars, the whole site runs from this file.
 */
export const siteConfig: SiteConfig = {
  locale: "en",

  brand: {
    name: "Apex Solar & Electrical",
    tagline: "Power your home. Cut your bills.",
    description:
      "Certified solar installation, electrical wiring and backup power for homes and businesses. Free site survey and a written quote within 48 hours.",
    logo: undefined,
  },

  contact: {
    phone: "+256 700 000 000",
    whatsapp: "256700000000",
    whatsappMessage: "Hi Apex, I'd like a quote for solar / electrical work.",
    email: "info@apexsolar.example",
    address: "Plot 12, Example Road, Kampala, Uganda",
    mapEmbedUrl: "",
  },

  hours: [
    { days: "Mon – Fri", time: "8:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 2:00 PM" },
    { days: "Sunday", time: "Emergency call-outs only" },
  ],

  hero: {
    badge: "Licensed & insured electrical engineers",
    headline: "Solar and electrical work done right, the first time.",
    subheadline:
      "From rooftop solar and battery backup to full rewiring, our certified team keeps your lights on and your bills down. Free site survey, fixed written quotes.",
    bullets: [
      "Free site survey and quote in 48 hours",
      "5-year workmanship warranty",
      "Certified engineers, tidy installs",
    ],
    primaryCta: { label: "Chat on WhatsApp", type: "whatsapp" },
    secondaryCta: { label: "Request a Free Quote", type: "link", href: "/contact" },
    image: undefined,
  },

  trustBadges: [
    { value: "12+", label: "Years of experience" },
    { value: "4.9★", label: "Google rating" },
    { value: "850+", label: "Projects completed" },
  ],

  // Same shape as the `services_products` table. priceUgx: null = "Get a quote".
  services: [
    {
      slug: "home-starter-solar",
      title: "Home Starter Solar",
      category: "Solar",
      description: "Essential solar for lights, TV, fridge and Wi-Fi, with battery backup.",
      priceUgx: 8500000,
      features: ["3 kW hybrid inverter", "5 kWh battery", "6 solar panels", "2-year warranty"],
      imageUrl: null,
      isFeatured: false,
    },
    {
      slug: "home-plus-solar",
      title: "Home Plus Solar",
      category: "Solar",
      description: "Whole-home backup including pumps and heavier appliances.",
      priceUgx: 18000000,
      features: ["5 kW hybrid inverter", "10 kWh battery", "12 solar panels", "5-year warranty"],
      imageUrl: null,
      isFeatured: true,
    },
    {
      slug: "business-solar",
      title: "Business Solar",
      category: "Solar",
      description: "Custom systems for shops, clinics, offices and small factories.",
      priceUgx: null,
      features: ["10 kW+ systems", "Load analysis", "Monitoring dashboard", "Maintenance plan"],
      imageUrl: null,
      isFeatured: false,
    },
    {
      slug: "electrical-wiring",
      title: "Electrical Wiring",
      category: "Electrical",
      description:
        "Full residential and commercial wiring by certified electricians, including distribution boards, earthing and compliance certificates.",
      priceUgx: null,
      features: ["New-build wiring", "Rewiring and upgrades", "Distribution boards", "Earthing and surge protection"],
      imageUrl: null,
      isFeatured: true,
    },
    {
      slug: "backup-power-and-batteries",
      title: "Backup Power & Batteries",
      category: "Backup Power",
      description:
        "Silent, fuel-free backup power. We retrofit batteries to existing solar systems or supply standalone inverter-battery packages.",
      priceUgx: null,
      features: ["Inverter and battery packs", "Solar retrofits", "Generator changeover switches", "Load management"],
      imageUrl: null,
      isFeatured: true,
    },
    {
      slug: "maintenance-and-repairs",
      title: "Maintenance & Repairs",
      category: "Maintenance",
      description:
        "Scheduled maintenance plans and rapid fault repair for solar and electrical systems, whoever installed them.",
      priceUgx: null,
      features: ["Panel cleaning and inspection", "Inverter diagnostics", "Emergency call-outs", "Annual service plans"],
      imageUrl: null,
      isFeatured: false,
    },
    {
      slug: "commercial-solutions",
      title: "Commercial Solutions",
      category: "Commercial",
      description:
        "Larger systems engineered for commercial loads, with ROI projections so the numbers make sense before you commit.",
      priceUgx: null,
      features: ["ROI and payback analysis", "Three-phase systems", "Project management", "Financing support"],
      imageUrl: null,
      isFeatured: false,
    },
    {
      slug: "energy-audits",
      title: "Energy Audits",
      category: "Energy Audits",
      description:
        "A clear, written audit of your consumption with practical recommendations, whether or not you go solar.",
      priceUgx: null,
      features: ["Consumption analysis", "Efficiency recommendations", "Solar sizing report", "Written summary"],
      imageUrl: null,
      isFeatured: false,
    },
  ],

  whyChooseUs: [
    {
      title: "Certified & insured",
      text: "Licensed engineers and full insurance on every job, so you're protected from day one.",
      icon: "ShieldCheck",
    },
    {
      title: "Fixed, written quotes",
      text: "No surprise charges. You get a clear itemised quote before any work begins.",
      icon: "HandCoins",
    },
    {
      title: "Fast response",
      text: "Quotes in 48 hours and emergency call-outs when the lights go out.",
      icon: "Clock",
    },
    {
      title: "Quality you can see",
      text: "Tier-1 equipment, neat cabling and a 5-year workmanship warranty.",
      icon: "BadgeCheck",
    },
  ],

  about: {
    mission:
      "To make reliable, affordable power accessible to every home and business we serve, installed safely and backed by honest advice.",
    story: [
      "Apex Solar & Electrical started in 2013 with two electricians and a simple idea: do the job properly and explain it honestly.",
      "Today we're a team of certified engineers and installers who have powered more than 850 homes and businesses. We still treat every project the way we did our first.",
    ],
    values: [
      { title: "Safety first", text: "Every job follows strict safety and compliance standards.", icon: "ShieldCheck" },
      { title: "Honest advice", text: "We'll tell you if you don't need something.", icon: "BadgeCheck" },
      { title: "Built to last", text: "Quality equipment and workmanship, backed by warranty.", icon: "Award" },
    ],
    // Replace with the client's real licence numbers / certifications.
    credentials: [
      { title: "Licensed & registered", text: "All engineers hold current electrical licences and the company is fully registered.", icon: "BadgeCheck" },
      { title: "Fully insured", text: "Public liability and workmanship cover on every project.", icon: "ShieldCheck" },
      { title: "Compliance certificates", text: "Every installation is tested and handed over with certification.", icon: "Award" },
      { title: "Safe working practice", text: "Site risk assessments, PPE and lock-out procedures as standard.", icon: "Zap" },
    ],
    team: [
      { name: "Daniel Okello", role: "Founder & Lead Engineer" },
      { name: "Sarah Namuli", role: "Head of Solar Design" },
      { name: "Peter Mugisha", role: "Operations Manager" },
      { name: "Grace Atim", role: "Customer Success" },
    ],
  },

  projects: {
    categories: ["Residential Solar", "Commercial", "Electrical Wiring"],
    items: [
      { title: "Hillside Family Home", category: "Residential Solar", location: "Kampala", specs: "5 kW hybrid · 10 kWh battery", summary: "Rooftop solar with battery backup, cutting grid use by around 70%." },
      { title: "Greenfield Supermarket", category: "Commercial", location: "Entebbe", specs: "20 kW rooftop · grid-tied", summary: "Commercial rooftop solar cutting power bills by 60%." },
      { title: "Lakeview Clinic", category: "Commercial", location: "Jinja", specs: "8 kW hybrid · 15 kWh battery", summary: "Battery backup for critical medical equipment." },
      { title: "Sunrise Apartments", category: "Electrical Wiring", location: "Kampala", specs: "24 units · 3-phase boards", summary: "Distribution boards, wiring and earthing for a 24-unit block." },
      { title: "Nile Bottlers Plant", category: "Electrical Wiring", location: "Jinja", specs: "Three-phase upgrade · 45 kVA", summary: "Power upgrade and load monitoring for a production line." },
      { title: "Kololo Villa", category: "Residential Solar", location: "Kampala", specs: "8 kW hybrid · 10 kWh battery", summary: "Whole-home backup with smart monitoring." },
    ],
  },

  testimonials: [
    {
      name: "Moses K.",
      role: "Homeowner, Kampala",
      quote: "Our bills dropped by more than half and the team left the place spotless. Highly recommended.",
      rating: 5,
    },
    {
      name: "Aisha N.",
      role: "Clinic Manager, Jinja",
      quote: "Power cuts used to threaten our equipment. Since the battery backup install we haven't had a single issue.",
      rating: 5,
    },
    {
      name: "David O.",
      role: "Supermarket Owner, Entebbe",
      quote: "Clear quote, on-time install and the numbers worked out exactly as promised.",
      rating: 5,
    },
  ],

  faqs: [
    {
      question: "How much does a solar system cost?",
      answer:
        "It depends on your usage and roof. Home systems typically start from UGX 8.5M. We do a free site survey and send a fixed written quote within 48 hours.",
    },
    {
      question: "How long does installation take?",
      answer: "Most homes are done in 1–3 days. Larger commercial projects are scheduled after the survey.",
    },
    {
      question: "Do you offer a warranty?",
      answer: "Yes. We give a 5-year workmanship warranty, plus manufacturer warranties on panels, inverters and batteries.",
    },
    {
      question: "Can you add batteries to my existing solar system?",
      answer: "In most cases, yes. Send us your inverter model on WhatsApp and we'll confirm compatibility.",
    },
    {
      question: "Do you handle emergency repairs?",
      answer: "Yes, call or WhatsApp us any day. Weekend call-outs are for urgent faults only.",
    },
  ],

  cta: {
    headline: "Ready to cut your power bills?",
    text: "Get a free site survey and a fixed written quote within 48 hours.",
  },

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    linkedin: "",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
};
