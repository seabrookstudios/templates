const glob = require("glob");

const { sh } = require("./card-lib");

const euro = "825x1125";
const tile45 = "608x608";

const cards63x88 = "in/card63x88";
const square45 = "in/square45";

const background = "#ffffff";
const size = tile45;
const out = square45;

const files = glob.sync(["resize/*.png", "resize/*.jpg"]);

files.forEach((file) => {
  const filename = file.split("resize/").join("");

  console.log(filename);

  sh(
    `convert 'resize/${filename}' -quality 100 -gravity center -units PixelsPerInch -density 300 -background '${background}' -extent ${size} '${out}/${filename}'`
  );
});
