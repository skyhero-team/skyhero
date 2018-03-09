const faces = require('./faces');

faces.findPeople('./images_test/people.png', (err, faces) => {
  if (err) {
    console.error('Not able to find people', err);
  } else {
    console.log(faces);
  }
});