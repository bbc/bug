//NAME: app.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 23/03/2021
//DESC: Mikrotik Interfaces module

const register = require('module-alias/register')
const app = require("./app");
let port = process.env.MODULE_PORT || 3000;

app.listen(port, () => {
  console.log("tsl-mdu listening on port "+port.toString());
});