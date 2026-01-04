import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleSelect } from "@/components/ui/simple-select";
import { evalTS } from "@/lib/utils/bolt";
import { PAGINATION_SETTINGS } from "@/lib/config";

type PositionCode = "TL" | "TC" | "TR" | "BL" | "BC" | "BR";
type ArtboardOption = { index: number; name: string };

const POSITIONS: { code: PositionCode; label: string }[] = [
  { code: "TL", label: "↖" },
  { code: "TC", label: "↑" },
  { code: "TR", label: "↗" },
  { code: "BL", label: "↙" },
  { code: "BC", label: "↓" },
  { code: "BR", label: "↘" },
];

export const PaginationView = () => {
  const [position, setPosition] = useState<PositionCode>(
    PAGINATION_SETTINGS.position
  );
  const [marginMm, setMarginMm] = useState(PAGINATION_SETTINGS.margin);
  const [startFrom, setStartFrom] = useState(0);
  const [artboards, setArtboards] = useState<ArtboardOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadArtboards = async () => {
    try {
      const boards = await evalTS("getArtboards");
      setArtboards(boards);
      setStartFrom((prev) => {
        if (!boards.length) return 0;
        return prev < boards.length ? prev : 0;
      });
    } catch (e) {
      console.error("Failed to get artboards:", e);
      setArtboards([]);
      setStartFrom(0);
    }
  };

  // Fetch artboards on mount
  useEffect(() => {
    loadArtboards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInsertNumbers = async () => {
    const safeStart = Math.max(
      0,
      Math.min(startFrom, Math.max(artboards.length - 1, 0))
    );
    const safeMargin = Number.isFinite(marginMm) ? marginMm : 0;

    setIsLoading(true);
    try {
      const result = await evalTS(
        "insertPageNumbers",
        safeStart,
        safeMargin,
        position,
        PAGINATION_SETTINGS.fontSize,
        PAGINATION_SETTINGS.fontFamily,
        PAGINATION_SETTINGS.justify,
        PAGINATION_SETTINGS.paginationLayerName
      );
      console.log(result);
    } catch (e) {
      console.error("Failed to insert page numbers:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshArtboards = async () => {
    loadArtboards();
  };

  const hasArtboards = artboards.length > 0;

  return (
    <div className="text-left mt-4">
      {/* Position + Margin */}
      <div className="flex flex-wrap gap-4 mt-4">
        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-3 gap-1 w-fit">
            {POSITIONS.map((pos) => (
              <button
                key={pos.code}
                onClick={() => setPosition(pos.code)}
                className={`w-8 h-8 rounded border text-lg flex items-center justify-center transition-colors ${
                  position === pos.code
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted hover:bg-muted/80 border-border"
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 w-32">
          <Label htmlFor="margin">Margin (mm)</Label>
          <Input
            id="margin"
            type="number"
            value={marginMm}
            onChange={(e) => {
              const nextValue = Number(e.target.value);
              setMarginMm(Number.isNaN(nextValue) ? 0 : nextValue);
            }}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>
      </div>

      {/* Start From Select */}
      <div className="mt-4">
        <div className="flex gap-2 mb-2">
          <Label htmlFor="start-from">Start from</Label>
          <button
            onClick={handleRefreshArtboards}
            className=" text-xs text-muted-foreground hover:text-foreground"
          >
            ↻ refresh
          </button>
        </div>
        <SimpleSelect
          value={startFrom}
          onChange={setStartFrom}
          options={
            hasArtboards
              ? artboards.map(({ index, name }) => ({
                  value: index,
                  label: `${index + 1}: ${name || `Artboard ${index + 1}`}`,
                }))
              : []
          }
          placeholder="No document open"
          disabled={!hasArtboards}
        />
      </div>

      {/* Insert Button */}
      <div className="mt-6">
        <Button
          onClick={handleInsertNumbers}
          disabled={isLoading || !hasArtboards}
          className="w-full"
        >
          {isLoading ? "Inserting..." : "Insert Page Numbers"}
        </Button>
      </div>
    </div>
  );
};
