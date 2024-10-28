const glob = require("glob");

const { sh } = require("./card-lib");

const background = "#FDB81C";

const files = glob.sync(["resize/*.png", "resize/*.jpg"]);

files.forEach((file) => {
  const filename = file.split("resize/").join("");

  console.log(filename);

  sh(
    `convert 'resize/${filename}' -quality 100 -gravity center -units PixelsPerInch -density 300 -background '${background}' -extent 825x1125 'in/card63x88/${filename}'`
  );
});
