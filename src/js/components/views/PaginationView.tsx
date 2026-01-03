import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleSelect } from "@/components/ui/simple-select";
import { evalTS } from "@/lib/utils/bolt";

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
  const [position, setPosition] = useState<PositionCode>("BC");
  const [marginMm, setMarginMm] = useState(3.5);
  const [startFrom, setStartFrom] = useState(1);
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
    setIsLoading(true);
    try {
      const result = await evalTS(
        "insertPageNumbers",
        startFrom,
        marginMm,
        position
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
    <div className="space-y-6 self-start text-left">
      {/* Position Grid */}
      <div className="space-y-2">
        <Label>Position</Label>
        <div className="grid grid-cols-3 gap-1 w-fit">
          {POSITIONS.map((pos) => (
            <button
              key={pos.code}
              onClick={() => setPosition(pos.code)}
              className={`w-10 h-10 rounded border text-lg flex items-center justify-center transition-colors ${
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

      {/* Margin Input */}
      <div className="space-y-2">
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
          className="w-24"
        />
      </div>

      {/* Start From Select */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="start-from">Start from</Label>
          <button
            onClick={handleRefreshArtboards}
            className="text-xs text-muted-foreground hover:text-foreground"
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
      <Button
        onClick={handleInsertNumbers}
        disabled={isLoading || !hasArtboards}
        className="w-full"
      >
        {isLoading ? "Inserting..." : "Insert Page Numbers"}
      </Button>
    </div>
  );
};
