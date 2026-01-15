const { execSync } = require("child_process");
const sh = (cmd) => {
  try {
    // console.log(cmd);
    execSync(cmd);
  } catch (e) {}
};

const bleed = 3;
const density = 300;

const mmToPx = (mm) => Math.ceil((density / 25.4) * mm);

const addOverlay = (overlay, mode, density = 300) => {
  sh(
    `composite -quality 100 -gravity center -compose ${mode} temp.png ${overlay} -units PixelsPerInch -density ${density} -type TrueColorAlpha temp.png`
  );
};

const addLayer = (layer, { gravity = "center", x = "+0", y = "+0" } = {}) => {
  sh(`composite -quality 100 -gravity ${gravity} '${layer}' -geometry ${x}${y} temp.png -type TrueColorAlpha temp.png`);
};

const addAndScaleLayer = (layer, { gravity = "center", w = "100%", h = "100%", x = "+0", y = "+0" } = {}) => {
  sh(
    `composite -quality 100 -gravity ${gravity} '${layer}' -geometry '${w}x${h}${x}${y}' temp.png -type TrueColorAlpha temp.png`
  );
};

const deleteWorkingFile = () => {
  sh(`rm -f temp.png`);
};

const createNewCanvas = (width, height, { density = 300, background = "blue" } = {}) => {
  sh(
    `convert -quality 100 -size ${width}x${height} -units PixelsPerInch -density ${density} xc:${background} -define png:color-type=6 temp.png`
  );
};

const cropToSize = (width, height, density = 300) => {
  sh(
    `convert temp.png -quality 100 -gravity center -units PixelsPerInch -density ${density} +repage -crop ${width}x${height}+0+0 temp.png`
  );
};

const padToSize = (width, height, density = 300, color = "white") => {
  sh(
    `convert temp.png -quality 100 -gravity center -units PixelsPerInch -density ${density} -background '${color}' -extent ${width}x${height} temp.png`
  );
};

const resizeBy = (width, height) => {
  sh(
    `convert temp.png -quality 100 -gravity center -units PixelsPerInch -density ${density} -resize ${width}x${height}% temp.png`
  );
};

const cutCard = (inFilename, outFilename, template = "card-cut-template.png") => {
  sh(`composite -quality 100 -compose copy-opacity ${template} '${inFilename}' '${outFilename}'`);
};

const finalise = () => {
  sh(`convert temp.png -background white -alpha remove -alpha off -type TrueColor temp.png`);
};

module.exports = {
  addAndScaleLayer,
  addLayer,
  addOverlay,
  createNewCanvas,
  cropToSize,
  cutCard,
  deleteWorkingFile,
  padToSize,
  resizeBy,
  sh,
  finalise,
};
