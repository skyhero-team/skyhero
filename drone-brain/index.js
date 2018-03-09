const drone = require('ar-drone');
const sharp = require('sharp');

var client  = drone.createClient({
  ip: '192.168.43.86'
});

// client.land();
client.animateLeds('blinkGreen', 5, 2)

/**
// image streaming
var pngStream = client.getPngStream();
pngStream.on('data', (buffer) => {
    console.log('new image');
    sharp(buffer).toFile('drone_' + Date.now() + '.png');
});
*/

/**
client
  .after(5000, function() {
    this.stop();
  })
  .after(5000, function() {
    this.land();
    console.log('END')
  });
*/