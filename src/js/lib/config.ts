import { HomeView } from "@/components/views/HomeView";
import { TextView } from "@/components/views/TextView";
import { ArtView } from "@/components/views/ArtView";

// Typy
export type ViewId = "home" | "text" | "art";

// Konfiguracja
export const TABS_CONFIG: { id: ViewId; label: string; component: React.FC }[] = [
  { id: "home", label: "Home", component: HomeView },
  { id: "text", label: "Text", component: TextView },
  { id: "art", label: "Art", component: ArtView },
];
