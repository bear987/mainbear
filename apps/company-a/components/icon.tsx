import {
  Handshake,
  TrendingUp,
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Check,
  type LucideProps,
} from "lucide-react";

const map = {
  Handshake,
  TrendingUp,
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Check,
} as const;

export type IconName = keyof typeof map;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = map[name];
  return <Cmp aria-hidden {...props} />;
}
