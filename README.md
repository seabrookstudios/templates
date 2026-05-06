# templates
Templates for prototyping

## Card Tray

```
1. edit src/single-card-tray.js to set the tray depth, width and height
2. node src/single-card-tray.js
3. import SVG into your laser cutter. Your svg is in the `out/` folder.
```

## Other scripts

### Convert a folder of files into a single PDF 63x88mm plus 3mm bleed
```
magick -density 300 *.png -resize 815x1110^ -gravity center -quality 100 -units PixelsPerInch  -profile ../../../../FINAL/ISOcoated_v2_300_eci.icc FINAL-cards-front-v3.pdf
```

### Convert a single file into a 60 page PDF 63x88mm plus 3mm bleed
```
magick -density 300 Cards_back.png -duplicate 59 -resize 815x1110^ -gravity center -quality 100 -units PixelsPerInch  -profile ../../../../FINAL/ISOcoated_v2_300_eci.icc FINAL-cards-back.pdf    
```
