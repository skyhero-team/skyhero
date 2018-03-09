const faces = require('./faces');
const hightlighter = require('./hightlighter');

faces.findPeople('./images_test/people.png', (err, faces) => {
  if (err) {
    console.error('Not able to find people', err);
  } else {
    console.log(faces);
    hightlighter.highlight('./images_test/people.png', './images_test/people_recognize.png', faces);
  }
});