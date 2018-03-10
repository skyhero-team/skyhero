const cognitiveServices = require('cognitive-services');
const fs = require('fs');

if (!process.env.FACES_API_KEY) {
  console.error('no FACES_API_KEY env var found');
  process.exit(1);
}
const config = {
  apiKey: process.env.FACES_API_KEY,
  endpoint: 'westcentralus.api.cognitive.microsoft.com'
};

const face = new cognitiveServices.face(config);

function findPeople(fileName, callback) {
  console.log('Find people in %s', fileName);
  fs.readFile(fileName, (err, body) => {
    if (err) {
      console.error('Not able to read image', err);
      return callback(err);
    }

    // detect up to 64 faces
    const parameters = {
      returnFaceId: "true",
      returnFaceLandmarks: "false"
    };

    const headers = {
      'Content-type': 'application/octet-stream' // application/json + body with an url field to use an url
    };

    console.log('Sending request to the Face API');
    face.detect({parameters, headers, body})
        .then(faces => {
          callback(null, faces);
        })
        .catch(err => callback(err));
  });
}

module.exports = {
  findPeople
}
