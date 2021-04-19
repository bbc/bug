//NAME: videohub.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 19/03/2021
//DESC: Blackmagic Design VideoHub Module

let matrix_ip = "192.168.1.1";
let matric_port = "9991";

const Videohub = require('io-videohub');
const videohub = new Videohub({host: matrix_ip, port: matric_port});
 
// Make a crosspoint
router.route(0, 10);
 
// Do something when an update is made to the Matrix
router.on('update', callback);
 
// Set a label on an Output
router.setOutputLabel(0, 'Output 1');
 
// Set a label on an Input
router.setIntputLabel(0, 'Camera 1');
 
// Intercept errors from the underlying tcp connection
router.connection.on('error', callback);

module.exports = videohub;