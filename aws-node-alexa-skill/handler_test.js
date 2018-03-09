const hanlder = require('./handler');

const event = {};
const context = {};

hanlder.takeoff(event, context, (err, data) => {
    console.log(err);
    console.log(data);
});