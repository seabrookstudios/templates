const fs = require("fs");

const boxWidth = 225;
const boxHeight = 295;
const boxDepth = 50;

const boxTopWidth = boxWidth;
const boxTopHeight = boxHeight;
const boxTopDepth = boxDepth;

const boxBottomWidth = boxWidth - 5;
const boxBottomHeight = boxHeight - 5;
const boxBottomDepth = boxDepth - 2;

const getCutlines = (w, h, d) => {
  const twp1 = w + d; //45+135 = 180
  const twp2 = w + d + d; // 225
  const thp1 = h + d; // 230
  const thp2 = h + d + d; // 275

  const cutlines = [
    `M ${d} ${d}`,
    `L ${d} 0`,
    `L ${twp1} 0`,
    `L ${twp1} ${d} M ${twp1} ${d}`,
    `L ${twp2} ${d}`,
    `L ${twp2} ${thp1}`,
    `L ${twp1} ${thp1} M ${twp1} ${thp1}`,
    `L ${twp1} ${thp2}`,
    `L ${d} ${thp2}`,
    `L ${d} ${thp1} M ${d} ${thp1}`,
    `L 0 ${thp1}`,
    `L 0 ${d}`,
    `L ${d} ${d}`,
  ].join(" ");

  return cutlines;
};

const getFoldlines = (w, h, d) => {
  const twp1 = w + d;
  const thp1 = h + d;

  const foldlines = [`M ${d} ${d}`, `L ${twp1} ${d}`, `L ${twp1} ${thp1}`, `L ${d} ${thp1}`, `L ${d} ${d} Z`].join(" ");

  return foldlines;
};

const cutStyle = "stroke: rgb(0, 77, 255); fill: none;";
const foldStyle = "fill: none; stroke: rgb(255, 0, 0);";

const topSvg = [
  `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">`,
  `<path d="${getCutlines(boxTopWidth, boxTopHeight, boxTopDepth)}" style="${cutStyle}"/>`,
  `<path d="${getFoldlines(boxTopWidth, boxTopHeight, boxTopDepth)}" style="${foldStyle}"/>`,
  `</svg>`,
].join("");
const bottomSvg = [
  `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">`,
  `<path d="${getCutlines(boxBottomWidth, boxBottomHeight, boxBottomDepth)}" style="${cutStyle}"/>`,
  `<path d="${getFoldlines(boxBottomWidth, boxBottomHeight, boxBottomDepth)}" style="${foldStyle}"/>`,
  `</svg>`,
].join("");

fs.writeFileSync(`./out/${boxWidth}x${boxHeight}x${boxDepth}-box-top.svg`, topSvg);
fs.writeFileSync(`./out/${boxWidth}x${boxHeight}x${boxDepth}-box-bottom.svg`, bottomSvg);
