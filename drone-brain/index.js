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

// init image streaming
pngStream.on('data', (buffer) => {
  console.log('new image received from the dron');

  // XXX we could use the buffer without an intermediate local file
  const fileName = './imagen/drone_' + Date.now() + '.png';
  sharp(buffer).toFile(fileName).then(() => {
    faces.findPeople(fileName, (err, faces) => {
      if (err) {
        console.error('Not able to find people', err);
        return;
      }

      console.log(faces);
    });
  })
});

app.post('/', (req, res) => {
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

process.on('SIGINT', function() {
  console.log( "Gracefully shutting down from SIGINT (Ctrl-C)" );

  // try to land the drone. we don't need an uncontrolled drone killing humans
  if (client) {
    client.land();
  }

  process.exit(0);
});

app.post('/test', (req, res) => {
  res.send('Hello World!');
})