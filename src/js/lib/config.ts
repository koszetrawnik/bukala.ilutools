import { PaginationView } from "@/components/views/PaginationView";
import { TextView } from "@/components/views/TextView";
import { ArtView } from "@/components/views/ArtView";

// Typy
export type ViewId = "pagination" | "text" | "art";
export type PaginationPosition = "TL" | "TC" | "TR" | "BL" | "BC" | "BR";
export type PaginationJustify = "left" | "center" | "right";

// Domyślne ustawienia paginacji (do wczytania w UI/bridge)
export const PAGINATION_SETTINGS = {
  fontSize: 8,
  fontFamily: "ArialMT",
  justify: "center" as PaginationJustify,
  position: "BC" as PaginationPosition,
  margin: 3.5, // mm
};

// Konfiguracja
export const TABS_CONFIG: { id: ViewId; label: string; component: React.FC }[] =
  [
    { id: "pagination", label: "Pagination", component: PaginationView },
    { id: "text", label: "Text", component: TextView },
    { id: "art", label: "Art", component: ArtView },
  ];
