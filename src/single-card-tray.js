const fs = require("fs");

const trayDepth = 40;
const trayWidth = 210;
const trayHeight = 50;
const markLength = 2;

const doubleTrayDepth = trayDepth * 2;
const trayDepth150 = doubleTrayDepth * 0.75;

const totalHeight = trayHeight + doubleTrayDepth + doubleTrayDepth;
const totalWidth = trayWidth + doubleTrayDepth + doubleTrayDepth;

const td = trayDepth;
const td150 = trayDepth150;
const td200 = doubleTrayDepth;
const rhs = doubleTrayDepth + trayWidth;
const th = totalHeight;
const tw = totalWidth;
const top3qrter = doubleTrayDepth - trayDepth / 2;
const startBottomY = trayHeight + doubleTrayDepth;
const bottom3qrter = startBottomY + trayDepth / 2;
const rightSideFold = doubleTrayDepth + trayWidth + trayDepth;
const bottomFoldLine = doubleTrayDepth + trayHeight + trayDepth;

const markCentreLeft = doubleTrayDepth + markLength;
const markCentreRight = doubleTrayDepth + trayWidth - markLength;
const markLeftTop = trayDepth150 + markLength;
const markBottomY = bottom3qrter - markLength;

const path = [
  `M ${td200} ${td200}`,
  `L ${td200} ${td}`,
  `L ${markCentreLeft} ${td}`,
  `L ${td200} ${td}`,
  `L ${td200} 0`,
  `L ${rhs} 0`,
  `L ${rhs} ${td}`,
  `L ${markCentreRight} ${td}`,
  `L ${rhs} ${td}`,
  `L ${rhs} ${td200}`,
  `M ${rhs} ${td150}`,
  `L ${rightSideFold} ${td150}`,
  `L ${rightSideFold} ${markLeftTop}`,
  `L ${rightSideFold} ${td150}`,
  `L ${tw} ${td150}`,
  `L ${tw} ${bottom3qrter}`,
  `L ${rightSideFold} ${bottom3qrter}`,
  `L ${rightSideFold} ${markBottomY}`,
  `L ${rightSideFold} ${bottom3qrter}`,
  `L ${rhs} ${bottom3qrter}`,
  `M ${rhs} ${startBottomY}`,
  `L ${rhs} ${bottomFoldLine}`,
  `L ${markCentreRight} ${bottomFoldLine}`,
  `L ${rhs} ${bottomFoldLine}`,
  `L ${rhs} ${th}`,
  `L ${td200} ${th}`,
  `L ${td200} ${bottomFoldLine}`,
  `L ${markCentreLeft} ${bottomFoldLine}`,
  `L ${td200} ${bottomFoldLine}`,
  `L ${td200} ${startBottomY}`,
  `M ${td200} ${bottom3qrter}`,
  `L ${td} ${bottom3qrter}`,
  `L ${td} ${markBottomY}`,
  `L ${td} ${bottom3qrter}`,
  `L 0 ${bottom3qrter}`,
  `L 0 ${td150}`,
  `L ${td} ${td150}`,
  `L ${td} ${markLeftTop}`,
  `L ${td} ${td150}`,
  `L ${td200} ${td150}`,
].join(" ");

const svg = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><path d="${path}" style="stroke: rgb(0, 0, 0); fill: none;" /></svg>`;

fs.writeFileSync(`./out/card-tray-${trayWidth}x${trayHeight}x${trayDepth}.svg`, svg);
