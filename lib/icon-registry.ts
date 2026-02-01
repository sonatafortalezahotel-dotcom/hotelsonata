import type { LucideIcon } from "lucide-react";
import {
  Waves,
  Dumbbell,
  Bike,
  Trophy,
  Sparkles,
  Heart,
  Eye,
  MapPin,
  Users,
  Award,
  Leaf,
  Coffee,
  UtensilsCrossed,
  ChefHat,
  Recycle,
  Droplets,
  Sun,
  Briefcase,
  PartyPopper,
  Building2,
  Lightbulb,
  Wind,
  ParkingCircle,
  Bed,
  Home,
  Dog,
  Star,
  Music,
  Palette,
  Clock,
  Key,
  Shield,
  Baby,
  Ban,
} from "lucide-react";

/**
 * Registry of icon names to Lucide components for use in the visual editor.
 * Icons are stored in page_content as string names (e.g. "Waves"); this map
 * resolves them to components for rendering.
 */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Waves,
  Dumbbell,
  Bike,
  Trophy,
  Sparkles,
  Heart,
  Eye,
  MapPin,
  Users,
  Award,
  Leaf,
  Coffee,
  UtensilsCrossed,
  ChefHat,
  Recycle,
  Droplets,
  Sun,
  Briefcase,
  PartyPopper,
  Building2,
  Lightbulb,
  Wind,
  ParkingCircle,
  Bed,
  Home,
  Dog,
  Star,
  Music,
  Palette,
  Clock,
  Key,
  Shield,
  Baby,
  Ban,
};

export type IconName = keyof typeof ICON_REGISTRY;

/**
 * Returns the Lucide component for the given icon name, or undefined if not in registry.
 */
export function getIcon(name: string): LucideIcon | undefined {
  if (!name || typeof name !== "string") return undefined;
  const key = name.trim();
  return ICON_REGISTRY[key];
}

/**
 * Returns sorted icon names for use in the icon picker.
 */
export function getIconNames(): IconName[] {
  return (Object.keys(ICON_REGISTRY) as IconName[]).sort();
}
