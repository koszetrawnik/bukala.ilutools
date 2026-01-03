import { PaginationView } from "@/components/views/PaginationView";
import { TextView } from "@/components/views/TextView";
import { ArtView } from "@/components/views/ArtView";

// Typy
export type ViewId = "pagination" | "text" | "art";

// Konfiguracja
export const TABS_CONFIG: { id: ViewId; label: string; component: React.FC }[] =
  [
    { id: "pagination", label: "Pagination", component: PaginationView },
    { id: "text", label: "Text", component: TextView },
    { id: "art", label: "Art", component: ArtView },
  ];
