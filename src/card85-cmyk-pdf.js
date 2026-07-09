const { execSync } = require("child_process");
const fs = require("fs");
const glob = require("glob");
const { DateTime } = require("luxon");

const { bleed, density, mmToPx } = require("./card-lib");

const cardWidthMm = 63.5;
const cardHeightMm = 88.9;
const inputDir = "tmp";
const background = process.env.BACKGROUND || "#ffffff";
const iccProfile = process.env.ICC_PROFILE || process.argv[2];

if (!iccProfile) {
  console.error("ICC profile path required.");
  console.error("  ICC_PROFILE=/path/to/profile.icc npm run card85-cmyk-pdf");
  console.error("  npm run card85-cmyk-pdf -- /path/to/profile.icc");
  process.exit(1);
}

if (!fs.existsSync(iccProfile)) {
  console.error(`ICC profile not found: ${iccProfile}`);
  process.exit(1);
}

const targetWidthPx = mmToPx(cardWidthMm + bleed * 2);
const targetHeightPx = mmToPx(cardHeightMm + bleed * 2);
const extent = `${targetWidthPx}x${targetHeightPx}`;

const files = glob.sync([`${inputDir}/*.png`, `${inputDir}/*.jpg`]);
if (files.length === 0) {
  console.error(`No PNG or JPG files found in ${inputDir}`);
  process.exit(1);
}

fs.mkdirSync("out", { recursive: true });

const output = `out/${DateTime.now().toFormat("yyyy-MM-dd")}-card63.5x88.9mm-cmyk.pdf`;
const inputs = files.map((file) => `'${file}'`).join(" ");

console.log(`${files.length} files → ${extent}px @ ${density}dpi`);
console.log(`Profile: ${iccProfile}`);
console.log(`Output: ${output}`);

execSync(
  `magick -density ${density} ${inputs} -resize ${extent}\\> -background '${background}' -gravity center -extent ${extent} -quality 100 -units PixelsPerInch -colorspace sRGB -profile '${iccProfile}' -type ColorSeparation -compress Zip '${output}'`,
  { stdio: "inherit" }
);
