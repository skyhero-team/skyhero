'use strict';

module.exports.takeoff = (event, context, callback) => {
  console.log(event);

  const response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: 'Taking off. Here we go',
      },
      shouldEndSession: true
    },
  };

  callback(null, response);
};
