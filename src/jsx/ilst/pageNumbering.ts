/**
 * Page Numbering module for Adobe Illustrator
 * Handles automatic page number insertion on artboards
 */

type PositionCode = "TL" | "TC" | "TR" | "BL" | "BC" | "BR";
type ArtboardInfo = { index: number; name: string };

const PAGINATION_LAYER_NAME = "__PAGINATION__";
const POINTS_PER_MM = 72 / 25.4;

const mmToPoints = (mm: number): number => mm * POINTS_PER_MM;

const recreatePaginationLayer = (doc: Document): Layer => {
  try {
    const existing = doc.layers.getByName(PAGINATION_LAYER_NAME);
    existing.locked = false;
    existing.visible = true;
    existing.remove();
  } catch (e) {
    // layer doesn't exist yet; that's fine
  }

  const layer = doc.layers.add();
  layer.name = PAGINATION_LAYER_NAME;
  layer.locked = false;
  layer.visible = true;
  return layer;
};

/**
 * Gets the number of artboards in the active document
 */
export const getArtboardCount = (): number => {
  if (app.documents.length === 0) return 0;
  return app.activeDocument.artboards.length;
};

/**
 * Gets the list of artboards with their names
 */
export const getArtboards = (): ArtboardInfo[] => {
  if (app.documents.length === 0) return [];

  const doc = app.activeDocument;
  const boards: ArtboardInfo[] = [];

  for (let i = 0; i < doc.artboards.length; i++) {
    boards.push({ index: i, name: doc.artboards[i].name });
  }

  return boards;
};

/**
 * Inserts page numbers on artboards
 * @param startFromIndex - 0-based index of first artboard to number
 * @param marginMm - margin from edge in millimeters
 * @param positionCode - position code: TL, TC, TR, BL, BC, BR
 */
export const insertPageNumbers = (
  startFromIndex: number,
  marginMm: number,
  positionCode: string
): { success: boolean; message: string } => {
  if (app.documents.length === 0) {
    return { success: false, message: "No document open" };
  }

  const doc = app.activeDocument;
  const artboards = doc.artboards;
  const fontSize = 8;
  const marginPoints = mmToPoints(isNaN(marginMm) ? 0 : marginMm);
  const paginationLayer = recreatePaginationLayer(doc);

  if (startFromIndex < 0 || startFromIndex >= artboards.length) {
    return { success: false, message: "Invalid start artboard" };
  }

  // Try to get Arial font, fallback to first available
  let textFont: TextFont;
  try {
    textFont = app.textFonts.getByName("ArialMT");
  } catch (e) {
    textFont = app.textFonts[0];
  }

  for (let i = 0; i < artboards.length; i++) {
    // Skip artboards before startFromIndex
    if (i < startFromIndex) continue;

    const artboard = artboards[i];
    const rect = artboard.artboardRect;
    // rect = [left, top, right, bottom]
    const left = rect[0];
    const top = rect[1];
    const right = rect[2];
    const bottom = rect[3];
    const width = right - left;

    // Calculate position
    let x: number;
    let y: number;
    let justification: Justification;

    // Parse position code
    const vPos = positionCode.charAt(0); // T or B
    const hPos = positionCode.charAt(1); // L, C, or R

    // Horizontal position and justification
    if (hPos === "L") {
      x = left + marginPoints;
      justification = Justification.LEFT;
    } else if (hPos === "C") {
      x = left + width / 2;
      justification = Justification.CENTER;
    } else {
      // R
      x = right - marginPoints;
      justification = Justification.RIGHT;
    }

    // Vertical position
    if (vPos === "T") {
      y = top - marginPoints;
    } else {
      // B
      y = bottom + marginPoints + fontSize;
    }

    // Create text frame
    const textFrame = paginationLayer.textFrames.add();
    textFrame.contents = String(i + 1); // Page number (1-based)

    // Style the text
    const textRange = textFrame.textRange;
    textRange.characterAttributes.size = fontSize;
    textRange.characterAttributes.textFont = textFont;

    // Set CMYK black color
    const blackColor = new CMYKColor();
    blackColor.cyan = 0;
    blackColor.magenta = 0;
    blackColor.yellow = 0;
    blackColor.black = 100;
    textRange.characterAttributes.fillColor = blackColor;

    // Set justification
    textRange.paragraphAttributes.justification = justification;

    // Position the text frame
    textFrame.position = [x, y];

  }

  const numberedCount = artboards.length - startFromIndex;
  return {
    success: true,
    message: `Inserted ${numberedCount} page numbers`,
  };
};
