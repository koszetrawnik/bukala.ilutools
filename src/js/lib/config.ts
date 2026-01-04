import { PaginationView } from "@/components/views/PaginationView";
import { TextView } from "@/components/views/TextView";
import { ArtView } from "@/components/views/ArtView";

// Typy
export type ViewId = "pagination" | "text" | "art";
export type PaginationPosition = "TL" | "TC" | "TR" | "BL" | "BC" | "BR";

// Domyślne ustawienia paginacji (do wczytania w UI/bridge)
export const PAGINATION_SETTINGS = {
  fontSize: 5,
  fontFamily: "ArialMT",
  justify: "center" as "left" | "center" | "right",

  //to  jest zmieniane w UI
  position: "BL" as PaginationPosition,
  margin: 4, // mm
};

// Konfiguracja
export const TABS_CONFIG: { id: ViewId; label: string; component: React.FC }[] =
  [
    { id: "pagination", label: "Pagination", component: PaginationView },
    { id: "text", label: "Text", component: TextView },
    { id: "art", label: "Art", component: ArtView },
  ];
