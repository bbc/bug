const Net = require("net");
const convert = require("xml-js");

const host = "172.29.8.8";
const port = 5959;

client = new Net.Socket();

client.connect({ port: port, host: host }, () => {
    console.log("TCP connection established with the server.");
    let message = Buffer.alloc(9);
    console.log(message);
    message.fill("<query/>", 0, 8);

    console.log(message);
    client.write(message);
});

client.on("data", (chunk) => {
    let xml = chunk.toString();
    let result = convert.xml2json(xml, { compact: true, spaces: 4 });
    console.log(result);
});

client.on("end", function () {
    console.log("Connection closed");
});
