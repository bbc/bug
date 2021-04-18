//NAME: app.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 23/03/2021
//DESC: Mikrotik Interfaces module

//server.js
const app = require("./app");
let port = process.env.MODULE_PORT || 3000;

app.listen(port, () => {
  console.log("tsl-mdu-3es listening on port "+port.toString());
});