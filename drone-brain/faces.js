const cognitiveServices = require('cognitive-services');

const config = {
    apiKey: process.env.FACES_API_KEY || 'xxx',
    endpoint: 'westcentralus.api.cognitive.microsoft.com'
};

const face = new cognitiveServices.face(config);

const SATYA_NADELLA_IMAGE_URL = "http://s3.amazonaws.com/digitaltrends-uploads-prod/2014/02/Satya-Nadella-quotes.jpg";

// detect up to 64 faces
const parameters = {
    returnFaceId: "true",
    returnFaceLandmarks: "false",
    // returnFaceAttributes: "age,gender,headPose,smile,facialHair,glasses"
};

const headers = {
    'Content-type': 'application/json'
};

const body = {
    "url": SATYA_NADELLA_IMAGE_URL
};

face.detect({parameters, headers, body}).then((faces) => {
    console.log(faces);
});

/**
face.listFaceLists()
    .then((lists) => {
        console.log(lists);
    }).catch((e) => console.error(e));
*/