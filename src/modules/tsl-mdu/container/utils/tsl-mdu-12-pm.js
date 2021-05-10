//NAME:  tsl-mdu12-3es.js
//AUTH:  Ryan McCartney <ryan.mccartney01@bbc.co.uk>
//DATE:  16/11/2020
//DESC:  TSL MDU Connection Class

const JSSoup = require('jssoup').default;
const axios = require('axios');

class TSL_MDU {
    constructor(config) {


        this.poller = null;
        this.model = "TSL-MDU12-3ES";
        this.username = config.username || 'root';
        this.password = config.password || 'telsys';
        this.host = config.ip_address;
        this.port = config.port || 80;
        this.status = null;
        this.outputsCount = config.outputs || 12;
        this.outputs = [];
        this.frequency = config.frequency || 5000;

        //Get Initial State
        this.refreshState();

        //Start periodic update
        this.start();

    }

    async start() {
        this.poller = await setInterval(this.refreshState, this.frequency);
    }

    async stop() {
        await clearInterval(this.poller);
    }

    async setDelay(output, delay) {
        this.outputs[output - 1].delay = parseInt(delay);
        const status = await this.sendRequest();
        return status
    }

    async setLock(output, lock) {
        this.outputs[output - 1].lock = lock;
        const status = await this.sendRequest();
        return status
    }

    async setOutput(output, state) {
        this.outputs[output - 1].state = state;
        const status = await this.sendRequest();
        return status
    }

    async setName(output, name) {
        this.outputs[output - 1].name = name;
        const status = await this.sendRequest();
        return status
    }

    async refreshState() {
        const outputsPageAddress = `http://${this.host}/Output.htm`;    
        let response;
        
        try {
            response = await axios.get(outputsPageAddress, {
                auth: {
                    username: this.username,
                    password: this.password
                }
            });
            this.status = response.status;
        }
        catch (error) {
            console.log(`INFO: Can't contact ${this.host} - connection timed out.`)
            this.status = 400
        }

        if (this.status === 200) {
            const soup = await new JSSoup(response?.data);
            const table = await soup.find('table','boxTable');
            
            let first = true;

            for (let row of table.findAll('tr')) {
                
                if (first) {
                    first = false;
                }
                else {
                    const items = row.findAll('td');
                    const index = parseInt(items[0].getText()) - 1;
                    
                    let output = {
                        name: items[1].nextElement.attrs.value,
                        fuses: items[2].getText().toLowerCase(),
                        number: index+1,
                    }
      
                    if (items[3]?.nextElement?.attrs?.checked === 'checked') {
                        output.state = 1;
                    }
                    else {
                        output.state = 0;
                    }

                    if (items[4].nextElement.attrs.checked === 'checked') {
                        output.lock = 1;
                    }
                    else {
                        output.lock = 0;
                    }

                    output.delay = parseInt(items[5].nextElement.attrs.value)
                    this.outputs[index] = { ...this.outputs[index], ...output };
                }
            }
        }
        return this.status
    }

    getStatus() {
        const state = {
            address: this.host,
            model: this.model,
            count: this.outputsCount,
            name: this.name,
            location: this.location,
            id: this.id,
            status: this.status,
            outputs: this.getOutputs()
        };

        return state;
    }

    getOutputs() {
        return this.outputs;
    }

    getOutput(outputIndex) {
        return this.output[outputIndex];
    }

    async sendRequest() {

        const dataString = this.buildRequest(this.names, this.states, this.delays, this.locks);
        const url = `http://${this.host}/op_config:${this.port}`;
        const response = await axios.post(url, auth = { username: this.username, password: this.password },dataString);
        this.status = response.status;

        return this.status
    }

    buildRequest(names, states, delays, locks) {
        let requestData = null
        for (let i = 0; i < length.names; i++) {

            const output = (i + 1).toString()

            requestData += "output" + output + "="
            requestData += names[i].replace(' ', '+')
            requestData += "&swooop" + output + "="

            if (states[i] === true) {
                requestData += 'on'
            }
            else {
                requestData += 'off'
            }

            requestData += "&opdelay" + output + "="
            requestData += delays[i].toString()
            requestData += "&oplock" + output + "="

            if (locks[i] === true) {
                requestData += 'on'
            }
            else {
                requestData += 'off'
            }

            if (output !== this.outputs) {
                requestData += "&"
            }
        }
        return requestData
    }
}

module.exports = TSL_MDU;