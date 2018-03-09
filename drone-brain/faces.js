const cognitiveServices = require('cognitive-services');
const fs = require('fs');

const config = {
    apiKey: process.env.FACES_API_KEY || 'xxx',
    endpoint: 'westcentralus.api.cognitive.microsoft.com'
};

const face = new cognitiveServices.face(config);

function findPeople(file, callback) {
    fs.readFile(file, (err, body) => {
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

        face.detect({parameters, headers, body})
            .then(faces => {
                callback(null, faces);
            })
            .catch(err => callback(err));
    });
}

/**
// TODO use face lists to recognize people
face.listFaceLists()
    .then((lists) => {
        console.log(lists);
    }).catch((e) => console.error(e));
*/

module.exports = {
    find
}
