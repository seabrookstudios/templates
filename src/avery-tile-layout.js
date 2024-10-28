const { DateTime } = require("luxon");
const glob = require("glob");

const { sh, createNewCanvas, addLayer, finalise } = require("../../18holes/tile-builder/card-lib");

const cardWidth = 606;
const cardHeight = 606;
const startOffsetX = 0;
const startOffsetY = 0;
const tileGapX = -15;
const tileGapY = -15;

//69 -> 638, 660, 1251

const TilesPerSheet = 20;
const ItemsPerRow = 4;
const ItemsPerCol = TilesPerSheet / ItemsPerRow;

// const documentWidth = 2480;
// const documentHeight = 3508;
const documentWidth = cardWidth * ItemsPerRow + tileGapX * (ItemsPerRow - 1);
const documentHeight = cardHeight * ItemsPerCol + tileGapX * (ItemsPerCol - 1);

const Positions = Array(TilesPerSheet)
  .fill(0)
  .map((_, i) => {
    const row = Math.floor(i / ItemsPerRow);
    const col = Math.floor(i % ItemsPerRow);

    const x = startOffsetX + cardWidth * col + col * tileGapX;
    const y = startOffsetY + cardHeight * row + row * tileGapY;

    return {
      index: i,
      gravity: "northwest",
      x: `+${x}`,
      y: `+${y}`,
    };
  })
  .reduce((obj, e) => ({ ...obj, [e.index]: { gravity: e.gravity, x: e.x, y: e.y } }), {});

const createAveryFile = (filename, files) => {
  createNewCanvas(documentWidth, documentHeight, { background: "transparent" });
  files.forEach((file, i) => {
    addLayer(file, Positions[i]);
  });

  files.forEach((file, i) => {
    addLayer(file, Positions[i]);
  });

  finalise();

  sh(`mv -f temp.png ${filename}`);
};

const files = glob.sync(["in/square45/*.png", "in/square45/*.jpg"]);
const sheets = Math.ceil(files.length / TilesPerSheet);

Array(sheets)
  .fill(0)
  .forEach((_, i) => {
    console.log(i);
    createAveryFile(
      `out/${DateTime.now().toFormat("yyyy-MM-dd")}-square45-sheet-${i}.png`,
      files.slice(i * TilesPerSheet, i * TilesPerSheet + TilesPerSheet)
    );
  });
