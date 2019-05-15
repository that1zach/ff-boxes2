const boxSchema = require("./" + process.argv[2]);
let output = [];

function Boxes(boxSchema) {
  width = 3;
  height = 3; // careful, it reduces to 2 if there are interior boxes
  pass = 0;

  getDims = (boxArray, start = true) => {
    boxArray.forEach(b => {
      if (typeof b === "object" && b.length > 0) {
        height = start ? 2 : height;
        width += (b[0] === "h" ? b.length - 1 : 1) * 4;
        height +=
          b[1].length > 0 ? 2 : b[0] === "h" ? b.length : (b.length - 1) * 3;
        getDims(b, false);
      }
    });
  };

  createShell = () => {
    // If this is a new pass let's push the row array to output
    if (typeof output[pass] === "undefined") output.push([]);

    // If this is the first or last row
    if (pass === 0 || pass === height - 1) {
      output[pass].push("+");
      for (let x = 1; x < width - 1; x++) output[pass].push("-");
      output[pass].push("+");
    }

    // Everything inside
    else {
      output[pass].push("|");
      for (let x = 1; x < width - 1; x++) output[pass].push(" ");
      output[pass].push("|");
    }

    // Continue until pass === height - 1 (the final row) or reset pass
    if (pass < height - 1) {
      pass++;
      createShell();
    } else {
      pass = 0; // Reset for interior boxes
    }

    // Reset dims to 0 for interior boxes
    width = 3;
    height = 3;
  };

  createBox = (w, h, x, y) => {
    // Corners
    output[y][x] = "+";
    output[y][x + w - 1] = "+";
    output[y + h - 1][x] = "+";
    output[y + h - 1][x + w - 1] = "+";

    // Top
    for (let n = x + 1; n <= w + x - 2; n++) output[y][n] = "-";

    // Bottom
    for (let n = x + 1; n <= w + x - 2; n++) output[y + h - 1][n] = "-";

    // Left
    for (let n = y + 1; n <= h + y - 2; n++) output[n][x] = "|";

    // Right
    for (let n = y + 1; n <= h + y - 2; n++) output[n][x + w - 1] = "|";

    // Reset dims to 0 for interior boxes
    width = 3;
    height = 3;
  };

  injectBoxes = (boxArray, x = 2, y = 1, o = "h") => {
    boxArray.forEach(b => {
      o = typeof b[0] === "string" ? b[0] : o;

      if (typeof b === "object") {
        // check for max depth here
        const maxDepth = b.some(i => typeof i === "object" && i.length === 0);

        if (maxDepth) {
          injectBoxes(b, x, y, o);
          return;
        }

        getDims(b);
        createBox(width, height, x, y);

        if (b[0] === "h") {
          x += b.length === 2 ? 2 : width + 2;
          y += b.length === 2 ? 1 : 0;
        }

        if (b[0] === "v") {
          x += b.length === 2 ? 2 : 0;
          y += b.length === 2 ? 1 : height;
        }

        if (b.length === 0) {
          if (o === "h") {
            x += width + 1;
            y += 0;
          }

          if (o === "v") {
            x += 0;
            y += height;
          }
        }

        injectBoxes(b, x, y, o);
      }
    });
  };

  drawBoxes = () => {
    output.forEach(o => console.log(`${o.join("")}`));
  };

  parseBoxes = boxArray => {
    getDims(boxArray);
    createShell();
    injectBoxes([boxArray[1]]); // inside boxes are always starting at 1
    drawBoxes();
  };

  parseBoxes(boxSchema);
}

Boxes(boxSchema);
