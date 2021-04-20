//NAME: app.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 19/03/2021
//DESC: Blackmagic Design VideoHub Module

//server.js
const app = require("./app");
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("weather listening on port "+port.toString());
});