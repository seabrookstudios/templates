const { DateTime } = require("luxon");
const fs = require("fs");
const glob = require("glob");

const { sh, createNewCanvas, addAndScaleLayer, finalise } = require("./card-lib");

const density = 300;
const mmToPx = (mm) => Math.round((density / 25.4) * mm);

const pageWidthMm = 210;
const pageHeightMm = 297;
const fullBleedMm = { w: 65.175, h: 92.175 };
const cutLineMm = { w: 62, h: 89 };

const columns = 3;
const rows = 3;
const ItemsPerSheet = columns * rows;

const pageWidthPx = mmToPx(pageWidthMm);
const pageHeightPx = mmToPx(pageHeightMm);
const pageCenterX = Math.round(pageWidthPx / 2);
const pageCenterY = Math.round(pageHeightPx / 2);

const marginXmm = (pageWidthMm - columns * fullBleedMm.w) / 2;
const marginYmm = (pageHeightMm - rows * fullBleedMm.h) / 2;

const formatOffset = (px) => `${px >= 0 ? "+" : "-"}${Math.abs(px)}`;

const Positions = Array(ItemsPerSheet)
  .fill(0)
  .map((_, i) => {
    const row = Math.floor(i / columns);
    const col = i % columns;

    const centerXmm = marginXmm + (col + 0.5) * fullBleedMm.w;
    const centerYmm = marginYmm + (row + 0.5) * fullBleedMm.h;

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

const targetWidthPx = mmToPx(cutLineMm.w);
const targetHeightPx = mmToPx(cutLineMm.h);

const createAverage9File = (filename, files) => {
  createNewCanvas(pageWidthPx, pageHeightPx, { background: "transparent" });

  files.forEach((file, i) => {
    addAndScaleLayer(file, {
      ...Positions[i],
      w: `${targetWidthPx}`,
      h: `${targetHeightPx}>`,
    });
  });

  files.forEach((file, i) => {
    addAndScaleLayer(file, {
      ...Positions[i],
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
