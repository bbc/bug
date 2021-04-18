//NAME:  tsl-mdu12-3es.js
//AUTH:  Ryan McCartney <ryan.mccartney01@bbc.co.uk>
//DATE:  16/11/2020
//DESC:  TSL MDU Connection Class

const jssoup = require('jssoup').default;
const http = require('http');

class TSL_MDU {
    constructor({ username='root', password='telsys', frequency=10 }) {

        this.model = "TSL-MDU12-3ES"
        
        this.username = username
        this.password = password
        this.host = host
        this.outputsCount = 12
        this.outputs = []

        this.names = []
        this.states = []
        this.locks = []
        this.delays = []
        this.fuses = [] * this.outputs
        this.status = None

        //Get Initial State
        this.refreshState()
        
        //Start periodic update
        setInterval(this.refreshState,frequency);

    }

    async setDelay(output,delay){
        this.delays[output-1] = int(delay)
        const status = await this.sendRequest()
        return status
    }

    async setLock(output,state){
        this.locks[output-1] = state
        const status = await this.sendRequest()
        return status
    }

    async setOutput(output,state){
        this.states[output-1] = state
        const status = await this.sendRequest()
        return status
    }

    async setName(output,state){
        this.names[output-1] = state
        const status = await this.sendRequest()
        return status
    }


    getTags(){
        state = this.getState()
        tags = state.get("name")+" "+state.get("location")+" "+state.get("address")+" "+state.get("model")

        if(state.get("status") === 200){
            tags += " Connected"
        }
        else{
            tags += " Disconnected"
        }
        
        for output in state.get("outputs"):
            if output.get("name"):
                tags += " "
                tags += str(output.get("name"))

        return tags.lower()
    }

    refreshState(){     
        outputsPageAddress = "http://"+this.address+"/outputs.htm"

        try{
            response = requests.get(outputsPageAddress,auth=(this.username,this.password),timeout=5)
            this.status = response.status_code
        }
        catch(error){
            console.log("INFO: Can't contact "+this.address+" - connection timed out.")
            this.status = 404
        }

        if(this.status === 200){
            soup = BeautifulSoup(response.content,'html.parser')
            soup = soup.find('form')
            first = True
            
            for row in soup.find_all('tr'):

                if first:
                    first = False
                else:
                    items = row.find_all('td')
                    i = int(items[0].text) - 1
                        
                    this.names[i] = items[0].input.get('value')
                    this.fuses[i]= items[1].text.replace('\xa0','')

                    if 'checked' in str(items[2].find_all('input')[0]):
                        this.states[i] = 1 
                    else:
                        this.states[i] = 0
        
                    if 'checked' in str(items[3]):
                        this.locks[i] = 1 
                    else:
                        this.locks[i] = 0

                    this.delays[i] = int(items[4].input.get('value'))
        }      
        return this.status
    }

    getState(){
        let state = {
            address: this.address,
            model: this.model,
            outputs: this.outputs,
            name: this.name,
            location: this.location,
            id: this.id,
            status: this.status,
            text: ""
        }

        for i in range(0,this.outputs):
            output = {}
            output['number'] = i+1
            output['name'] = this.names[i]
            output['fuse'] = this.fuses[i]
            output['state'] = this.states[i]
            output['lock'] = this.locks[i]
            output['delay'] = this.delays[i]
            output['text'] = this.fuses[i]
            outputs.append(output)

            state['outputs'] = outputs
 
        return state
    }

    async sendRequest(){

        dataString = this.buildRequest(this.names,this.states,this.delays,this.locks)

        const options = {
            host: 'http://'+this.address,
            path: '/op_config',
            port: 80,
            timeout: 5000,
            method: 'POST',
            data: dataString
            auth:{this.username,this.password}
        };

        http.get(options, (response) => {
            let data = '';
    
            response.on('data', (chunk) => {
                data += chunk;
            });
    
            response.on('end', () => {
                return data;
            });
    
            }).on("error", (err) => 
            {
                return error;
            });

        response = http.post(postAddress,data=dataString,auth=(this.username,this.password))
        this.status = response.status_code

        return this.status
    }

    buildRequest(names,states,delays,locks){
        let requestData = null
        for( let i=0; i<length.names; i++){

            const output = (i+1).toString()

            requestData += "output"+output+"="
            requestData += names[i].replace(' ','+')
            requestData += "&swooop"+output+"="
                
            if(states[i] === true){
                requestData += 'on'
            }
            else{
                requestData += 'off'
            }
                
            requestData += "&opdelay"+output+"="
            requestData += delays[i].toString()
            requestData += "&oplock"+output+"="
            
            if( locks[i] === true ){
                requestData += 'on'
            }
            else{
                requestData += 'off'
            }
    
            if(output !== this.outputs){
                requestData += "&"
            }
        }
        return requestData
    }
}

module.exports.TSL_MDU