//NAME:  tsl-mdu12-3es.js
//AUTH:  Ryan McCartney <ryan.mccartney01@bbc.co.uk>
//DATE:  16/11/2020
//DESC:  TSL MDU Connection Class

const JSSoup = require("jssoup").default;
const axios = require("axios");
const formurlencoded = require("form-urlencoded");

class TSL_MDU {
    constructor(config) {
        this.username = config.username || "root";
        this.password = config.password || "telsys";
        this.host = config.address;
        this.port = config.port || 80;
        this.status = null;
        this.outputsCount = 12;
        this.outputs = [];
        this.frequency = config.frequency || 5000;

        //Get Initial State
        this.getOutputs();
    }

    async setDelay(output, delay) {
        await this.getOutputs();
        const previousState = this.outputs[output - 1].delay;
        this.outputs[output - 1].delay = delay;
        const status = await this.sendRequest();

        if (status !== 200) {
            this.outputs[output - 1].delay = previousState;
        }
        return { status: status, output: this.outputs[output - 1] };
    }

    async setLock(output, lock) {
        await this.getOutputs();
        const previousLock = this.outputs[output - 1].lock;
        this.outputs[output - 1].lock = lock;
        const status = await this.sendRequest();

        if (status !== 200) {
            this.outputs[output - 1].lock = previousLock;
        }
        return { status: status, output: this.outputs[output - 1] };
    }

    async setOutput(output, state) {
        await this.getOutputs();
        const previousState = this.outputs[output - 1].state;
        this.outputs[output - 1].state = state;
        const status = await this.sendRequest();

        if (status !== 200) {
            this.outputs[output - 1].state = previousState;
        }
        return { status: status, output: this.outputs[output - 1] };
    }

    async setName(output, name) {
        await this.getOutputs();
        const previousName = this.outputs[output - 1].name;
        this.outputs[output - 1].name = name;
        const status = await this.sendRequest();

        if (status !== 200) {
            this.outputs[output - 1].name = previousName;
        }

        return { status: status, output: this.outputs[output - 1] };
    }

    async getOutputs() {
        const outputsPageAddress = `http://${this.host}/Output.htm`;
        let response;

        try {
            response = await axios.get(outputsPageAddress, {
                auth: {
                    username: this.username,
                    password: this.password,
                },
            });
            this.status = response.status;
        } catch (error) {
            console.log(`tsl-mdu-12-pm: Can't contact ${this.host} - connection timed out.`);
            this.status = 400;
        }

        if (this.status === 200) {
            const soup = await new JSSoup(response?.data);
            const table = await soup.find("table", "boxTable");

            let first = true;

            for (let row of table.findAll("tr")) {
                if (first) {
                    first = false;
                } else {
                    const items = row.findAll("td");
                    const index = parseInt(items[0].getText()) - 1;

                    let output = {
                        name: items[1].nextElement.attrs.value,
                        fuse: items[2].getText().toLowerCase(),
                        number: index + 1,
                    };

                    if (items[3]?.nextElement?.attrs?.checked === "checked") {
                        output.state = true;
                    } else {
                        output.state = false;
                    }

                    if (items[4].nextElement.attrs.checked === "checked") {
                        output.lock = true;
                    } else {
                        output.lock = false;
                    }

                    output.delay = parseInt(items[5].nextElement.attrs.value);
                    this.outputs[index] = {
                        ...this.outputs[index],
                        ...output,
                    };
                }
            }
        }
        return this.outputs;
    }

    async getStatus() {
        const systemPageAddress = `http://${this.host}/System.htm`;
        const status = {};
        let response;

        try {
            response = await axios.get(systemPageAddress, {
                auth: {
                    username: this.username,
                    password: this.password,
                },
            });
            this.status = response.status;
        } catch (error) {
            console.log(`tsl-mdu-12-pm: Can't contact ${this.host} - connection timed out.`);
            this.status = 400;
        }

        if (this.status === 200) {
            const soup = await new JSSoup(response?.data);
            const table = await soup.find("table", "boxTable");

            for (let row of table.findAll("td")) {
                if (row.getText() === "Temperature:") {
                    status.temperature = row.nextSibling.getText().split(" ")[0];
                }
                if (row.getText() === "Version:") {
                    status.version = row.nextSibling.getText();
                }
            }
        }
        return status;
    }

    getOutput(outputIndex) {
        return this.output[outputIndex];
    }

    async sendRequest() {
        const bodyData = await this.buildRequest(this.outputs);
        const formData = await formurlencoded(bodyData);

        const url = `http://${this.host}/OutputUpdate`;

        try {
            const response = await axios.post(url, formData, {
                port: this.port,
                auth: {
                    username: this.username,
                    password: this.password,
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (response.data === "Update finished") {
                this.status = 200;
            } else {
                this.status = 500;
            }
        } catch (error) {
            console.log(`tsl-mdu-12-pm: Can't contact ${this.host} - connection timed out.`);
            this.status = 400;
        }

        return this.status;
    }

    buildRequest(outputs) {
        const requestBody = {};
        for (let output of outputs) {
            requestBody[`gpName${output.number}`] = output.name;

            let state = "off";
            if (output.state) {
                state = "on";
            }
            requestBody[`gpSwitch${output.number}`] = state;

            let lock = "off";
            if (output.lock) {
                lock = "on";
            }
            requestBody[`snmpCheck${output.number}`] = lock;
            requestBody[`gpDelay${output.number}`] = output.delay;
        }

        return requestBody;
    }
}

module.exports = TSL_MDU;
