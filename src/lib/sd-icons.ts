import {
  Database,
  Zap,
  MessageSquare,
  Network,
  Calculator,
  Layers,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the stored icon-name string (from the DB / seed) to the
 * actual Lucide React component.  Keep this in sync with sd-seed.ts.
 */
export const SD_ICON_MAP: Record<string, LucideIcon> = {
  Database,
  Zap,
  MessageSquare,
  Network,
  Calculator,
  Layers,       // fallback / generic
};

/** Resolve an icon name to a Lucide component, defaulting to Layers. */
export function getSDIcon(name: string): LucideIcon {
  return SD_ICON_MAP[name] ?? Layers;
}
