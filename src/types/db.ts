import type { IconName } from "@/types/site";

export type WhyChooseUsItemDb = {
  title: string;
  text: string;
  icon: IconName;
};

export type TestimonialItemDb = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export type FaqItemDb = {
  question: string;
  answer: string;
};

/** Row shapes of the Supabase tables (see supabase/schema.sql). */
export type SiteSettingsRow = {
  id: number;
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: { days: string; time: string }[];
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string | null;
  hero_video_url?: string | null;
  why_choose_us?: WhyChooseUsItemDb[];
  testimonials?: TestimonialItemDb[];
  faqs?: FaqItemDb[];
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  updated_at?: string;
};

export type OfferingRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  price_ugx: number | null;
  features_list: string[];
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
};

export type ProjectRow = {
  id: string;
  title: string;
  category: string;
  location: string;
  specs: string | null;
  summary: string | null;
  image_url: string | null;
  created_at: string;
};
