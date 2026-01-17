const { DateTime } = require("luxon");
const glob = require("glob");

const { sh, createNewCanvas, addAndScaleLayer, finalise } = require("./card-lib");

const density = 300;
const mmToPx = (mm) => Math.round((density / 25.4) * mm);
const isBleedEnabled = () => {
  const value = String(process.env.BLEED || "").toLowerCase();
  return value === "1" || value === "true" || value === "yes";
};

const pageWidthMm = 210;
const pageHeightMm = 297;
const fullBleedMm = { w: 65.175, h: 92.175 };
const cutLineMm = { w: 62, h: 89 };
const edgeMarginMm = { x: 7, y: 10 };
const gapMm = 5;

const columns = 3;
const rows = 3;
const ItemsPerSheet = columns * rows;

const pageWidthPx = mmToPx(pageWidthMm);
const pageHeightPx = mmToPx(pageHeightMm);
const pageCenterX = Math.round(pageWidthPx / 2);
const pageCenterY = Math.round(pageHeightPx / 2);

const getSlotCenterMm = ({ row, col, slotWidthMm, slotHeightMm }) => ({
  x: edgeMarginMm.x + slotWidthMm / 2 + col * (slotWidthMm + gapMm),
  y: edgeMarginMm.y + slotHeightMm / 2 + row * (slotHeightMm + gapMm),
});

const formatOffset = (px) => `${px >= 0 ? "+" : "-"}${Math.abs(px)}`;

const buildPositions = () => {
  const { w: slotWidthMm, h: slotHeightMm } = cutLineMm;

  return Array(ItemsPerSheet)
  .fill(0)
  .map((_, i) => {
    const row = Math.floor(i / columns);
    const col = i % columns;

    const { x: centerXmm, y: centerYmm } = getSlotCenterMm({
      row,
      col,
      slotWidthMm,
      slotHeightMm,
    });

    const centerXpx = mmToPx(centerXmm);
    const centerYpx = mmToPx(centerYmm);

    const offsetX = Math.round(centerXpx - pageCenterX);
    const offsetY = Math.round(centerYpx - pageCenterY);

    return {
      index: i,
      gravity: "center",
      x: formatOffset(offsetX),
      y: formatOffset(offsetY),
    };
  })
  .reduce((obj, e) => ({ ...obj, [e.index]: { gravity: e.gravity, x: e.x, y: e.y } }), {});
};

const getTargetSizePx = (bleedEnabled) => {
  const { w, h } = bleedEnabled ? fullBleedMm : cutLineMm;
  return { w: mmToPx(w), h: mmToPx(h) };
};

const createAverage9File = (filename, files) => {
  const bleedEnabled = isBleedEnabled();
  const positions = buildPositions();
  const { w: targetWidthPx, h: targetHeightPx } = getTargetSizePx(bleedEnabled);

  createNewCanvas(pageWidthPx, pageHeightPx, { background: "transparent" });

  files.forEach((file, i) => {
    addAndScaleLayer(file, {
      ...positions[i],
      w: `${targetWidthPx}`,
      h: `${targetHeightPx}>`,
    });
  });

  files.forEach((file, i) => {
    addAndScaleLayer(file, {
      ...positions[i],
      w: `${targetWidthPx}`,
      h: `${targetHeightPx}>`,
    });
  });

  finalise();
  sh(`mv -f temp.png ${filename}`);
};

const files = glob.sync(["in/card62x89/*.jpg", "in/card62x89/*.png"]);
const sheets = Math.ceil(files.length / ItemsPerSheet);

Array(sheets)
  .fill(0)
  .forEach((_, i) => {
    console.log(`${i + 1}/${sheets}`);
    createAverage9File(
      `out/${DateTime.now().toFormat("yyyy-MM-dd")}-average-9-card-sheet-${i}.png`,
      files.slice(i * ItemsPerSheet, i * ItemsPerSheet + ItemsPerSheet)
    );
  });
