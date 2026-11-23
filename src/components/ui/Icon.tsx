import {
  ArrowRight,
  Award,
  BadgeCheck,
  Battery,
  BatteryCharging,
  Building2,
  Check,
  Clock,
  Gauge,
  HandCoins,
  Home,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plug,
  ShieldCheck,
  Star,
  Sun,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/types/site";

const icons: Record<IconName, LucideIcon> = {
  ArrowRight,
  Award,
  BadgeCheck,
  Battery,
  BatteryCharging,
  Building2,
  Check,
  Clock,
  Gauge,
  HandCoins,
  Home,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plug,
  ShieldCheck,
  Star,
  Sun,
  Users,
  Wrench,
  Zap,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = icons[name];
  return <Component className={className} aria-hidden="true" />;
}
