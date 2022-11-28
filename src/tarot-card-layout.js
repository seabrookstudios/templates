const { DateTime } = require("luxon");
const glob = require("glob");

const { sh, createNewCanvas, addLayer, finalise } = require("./card-lib");

const documentWidth = 2480;
const documentHeight = 3508;

const ItemsPerSheet = 4;

const Positions = {
  0: {
    gravity: "northwest",
    x: `+59`,
    y: `+45`,
  },
  1: {
    gravity: "northwest",
    x: `+1524`,
    y: `+47`,
  },
  2: {
    gravity: "northwest",
    x: `+59`,
    y: `+1975`,
  },
  3: {
    gravity: "northwest",
    x: `+1524`,
    y: `+1975`,
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

const files = glob.sync("in/card70x120/*.png");
const sheets = Math.ceil(files.length / ItemsPerSheet);

Array(sheets)
  .fill(0)
  .forEach((_, i) => {
    console.log(`${i + 1}/${sheets}`);
    createAveryFile(
      `out/${DateTime.now().toFormat("yyyy-MM-dd")}-card70x120-sheet-${i}.png`,
      files.slice(i * ItemsPerSheet, i * ItemsPerSheet + ItemsPerSheet)
    );
  });
