const drone = require('ar-drone');
const sharp = require('sharp');
const faces = require('./faces');

const express = require('express');
const app = express();

app.use(express.static('public'));

const DRONE_IP_DEFAULT='192.168.43.86';
if (!process.env.DRONE_IP) {
  console.log('No DRONE_IP env var found. Using the default value %s', DRONE_IP_DEFAULT)
}

const client  = drone.createClient({
  ip: process.env.DRONE_IP || DRONE_IP_DEFAULT
});

require('ar-drone-png-stream')(client, { port: 8000 }); // expose the stream to the public UI

const pngStream = client.getPngStream();

const analyzing = false; // we don't want to analyze more than 1 image at the same time

// init image streaming
pngStream.on('data', (buffer) => {
  if (!analyzing) {
    analyzing = true;
    console.log('New image received from the dron: anzlyzing');

    // XXX we could use the buffer without an intermediate local file (might be faster)
    const fileName = './imagen/drone_' + Date.now() + '.png';
    sharp(buffer)
      .toFile(fileName)
      .then(() => {
          faces.findPeople(fileName, (err, faces) => {
            if (err) {
              console.error('Not able to find people', err);
            } else {
              console.log(faces);
            }

            analyzing = false; // free the token to be able to process another picture
          });
      })
      .catch(err => {
          console.error('Something went wrong saving the image', err);
          analyzing = false; // free the token to be able to process another picture
      });
  };
});

app.post('/', (req, res) => {
  console.log('Takeoff request received');

  client.takeoff();
  client.animateLeds('blinkGreen', 5, 2)

  client
    .after(5000, () => {
      this.land();
      console.log('Mission finished');
    });

  res.send('ok alexa');
});

app.listen(3000, () => {
  console.log('Sky Hero app listening on port 3000');
});

process.on('SIGINT', () => {
  console.log("Gracefully shutting down");

  // try to land the drone. we don't need an uncontrolled drone killing humans
  if (client) {
    client.land();
  }

  process.exit(0);
});