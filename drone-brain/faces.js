// brew install cmake
// install xquarz
// brew install openblas

const fr = require('face-recognition');

// const image = fr.loadImage('happy-people-1050x600.jpg');
const image = fr.loadImage('drone_1520531395020.png');

// const win = new fr.ImageWindow()
// win.setImage(image)

const detector = fr.FaceDetector();

const faceRectangles = detector.locateFaces(image);

console.log(faceRectangles);


// Endpoint: https://westcentralus.api.cognitive.microsoft.com/face/v1.0
// Key 1: 2f57993394ab4825aff6f1c9986d6c78
// Key 2: a98300a5c58f4852916a004be53f06e8