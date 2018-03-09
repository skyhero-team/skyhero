const fs = require('fs');
const drawing = require('pngjs-draw');
const png = drawing(require('pngjs').PNG);

const ALPHA = 100;

/**
 * Faces example
 * [ { faceId: '3908a769-04b4-4d2e-b9b9-1443cee7174b', faceRectangle: { top: 159, left: 311, width: 48, height: 48 } } ]
 */
function highlight(fileName, targetFileName, faces) {
  fs.createReadStream(fileName)
    .pipe(new png({ filterType: 4 }))
    .on('parsed', function() {
      faces.forEach(face => {
        this.fillRect(
          face.faceRectangle.top,
          face.faceRectangle.left,
          face.faceRectangle.width,
          face.faceRectangle.height,
          this.colors.green(ALPHA)
        );
      });
      this.pack().pipe(fs.createWriteStream(targetFileName));
    });
}

module.exports = {
  highlight
}
