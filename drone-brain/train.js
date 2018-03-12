// THIS FILE IS A WORK IN PROGRESS
// WE DIDN'T FINISH IT DURING THE HACKFORGOOD HACKATON
// OUR INTENTION WAS TO BE ABLE TO IDENTIFY A SPECIFIC PERSON ONLY

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

const PERSON_GROUP = 'skyhero-person-group';

const parameters = {
  personGroupId: PERSON_GROUP
};

const body = {
  name: PERSON_GROUP
};

let promise = face
  .createAPersonGroup({parameters, body})
  .catch(err => {
    if (err.statusCode !== 409) {
      console.err(err);
    } else {
      console.log('Person group already exists');
    }
  });

promise
  .then(() => {
    console.log('create person');
    const parametersPerson = {
      personGroupId: PERSON_GROUP
    };

    const bodyPerson = {
      personGroupId: PERSON_GROUP,
      name: 'jorgesanz'
    };

    return face.createAPerson({parametersPerson, bodyPerson});
  })
  .then(() => {
    console.log('create face');
    const parametersPersonFace = {
      personGroupId: PERSON_GROUP
    };

    const bodyPersonFace = {
      name: 'jorgesanz'
    };

    // TODO
    return face.addAPersonFace({parametersPersonFace, bodyPersonFace});
  })
  .then(() => {
    const parametersTrain = {
      personGroupId: PERSON_GROUP
    };

    const bodyTrain = {
      name: 'jorgesanz'
    };

    // TODO
    face.trainPersonGroup({parametersTrain, bodyTrain});
  })
  .catch(err => console.error(err));
