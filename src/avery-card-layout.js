const { DateTime } = require("luxon");
const glob = require("glob");

const { sh, createNewCanvas, addLayer, finalise } = require("./card-lib");

const documentWidth = 3508;
const documentHeight = 2480;

const ItemsPerSheet = 8;

const Positions = {
  0: {
    gravity: "northwest",
    x: `+150`,
    y: `+83`,
  },
  1: {
    gravity: "northwest",
    x: `+950`,
    y: `+83`,
  },
  2: {
    gravity: "northwest",
    x: `+1752`,
    y: `+83`,
  },
  3: {
    gravity: "northwest",
    x: `+2550`,
    y: `+83`,
  },
  4: {
    gravity: "northwest",
    x: `+150`,
    y: `+1282`,
  },
  5: {
    gravity: "northwest",
    x: `+950`,
    y: `+1282`,
  },
  6: {
    gravity: "northwest",
    x: `+1752`,
    y: `+1282`,
  },
  7: {
    gravity: "northwest",
    x: `+2550`,
    y: `+1282`,
  },
};

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

const files = glob.sync("in/card63x88/*.jpg");
const sheets = Math.ceil(files.length / ItemsPerSheet);

Array(sheets)
  .fill(0)
  .forEach((_, i) => {
    console.log(`${i + 1}/${sheets}`);
    createAveryFile(
      `out/${DateTime.now().toFormat("yyyy-MM-dd")}-card63x88-sheet-${i}.png`,
      files.slice(i * ItemsPerSheet, i * ItemsPerSheet + ItemsPerSheet)
    );
  });
