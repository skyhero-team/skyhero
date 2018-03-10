const fs = require('fs');
const drone = require('ar-drone');
const sharp = require('sharp');
const faces = require('./faces');
const hightlighter = require('./hightlighter')
const express = require('express');
const app = express();

const HIGHLIGHTED_IMAGE_PATH = `${__dirname}/public/photo.png`;
fs.unlink(HIGHLIGHTED_IMAGE_PATH, () => { console.log('removed', HIGHLIGHTED_IMAGE_PATH); });

app.use(express.static('public'));

const DRONE_IP_DEFAULT='192.168.43.86';
if (!process.env.DRONE_IP) {
  console.log('No DRONE_IP env var found. Using the default value %s', DRONE_IP_DEFAULT)
}

const client  = drone.createClient({
  ip: process.env.DRONE_IP || DRONE_IP_DEFAULT,
  frameRate: 5,
  imageSize: "640x360" // 480x270, 640x360 (default), 1280x720
});

// client.config('general:navdata_demo', 'FALSE');
// client.on('navdata', console.log);

// disabled for now
// require('ar-drone-png-stream')(client, { port: 8000 }); // expose the stream to the public UI

const pngStream = client.getPngStream();

const IMAGE_PROCESSING_ENABLED = true;

let imagesProcessed = 0;
let analyzing = false; // we don't want to analyze more than 1 image at the same time

// init image streaming
if (IMAGE_PROCESSING_ENABLED) {
  pngStream.on('data', (buffer) => {
    sharp(buffer).toFile('./public/drone.png');

    // This is a protection to avoid the 20 req/sec imposed by Face API
    imagesProcessed++;
    if (imagesProcessed % (5 * 5) !== 0) {
      return;
    }

    if (!analyzing) {
      analyzing = true;
      console.log('New image received from the drone: anzlyzing');

      // XXX we could use the buffer without an intermediate local file (might be faster)
      const fileName = './images/drone_' + Date.now() + '.png';
      sharp(buffer)
        .toFile(fileName)
        .then(() => {
            faces.findPeople(fileName, (err, faces) => {
              if (err) {
                console.error('Not able to process the image', err);
              } else {
                console.log(faces);

                if (faces.length > 0) {
                  // client.animateLeds('blinkGreenRed', 5, 5)
                  hightlighter.highlight(fileName, './public/people.png', faces); // fire & forget
                }
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
}

app.post('/', (req, res) => {
  console.log('Takeoff request received');
  res.send('ok alexa');

  client.animateLeds('blinkGreen', 5, 2)

  client
    .after(2000, function() {
      console.log('drone: take off');
      this.takeoff();
    })
    .after(5000, function() {
       this.up(0.2);
    })
    .after(1000, function() {
      this.stop();
    })
    .after(20000, function() {
      console.log('land');
      this.land();
      console.log('Mission complete');
    });
});

app.listen(3000, () => {
  console.log('Sky Hero app listening on port 3000');
});

process.on('SIGINT', () => {
  console.log('Gracefully shutting down');

  // try to land the drone. we don't need an uncontrolled drone killing humans
  if (client) {
    console.log('Landing drone');
    client.land();
  }

  process.exit(0);
});

app.post('/test', (req, res) => {
  res.send('Hello World!');
})