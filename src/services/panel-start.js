'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');
const getConfig = require('@services/panel-getconfig');
const setConfig = require('@services/panel-setconfig');
const buildImage = require('@services/module-build')
const panelStart = require('@services/panel-start')
const nodeEnv = process.env.NODE_ENV || 'production';

module.exports = async (panelId) => {

    let response = {
        panel_id: panelId
    }

    try {
        response.config = await getConfig(panelId);
        let container = undefined;

        if( response.config.error === undefined ){

            //STEP 1 - Build the image for the module, if it's already been done this will be quick
            const image = await buildImage(response.config.module);

            //STEP 2 - Check if container exisits     
            if(response.config.container_id === undefined){
                
                //STEP 2a - Create a container     
                container = await docker.createContainer({Image: image.tag, Cmd: ['npm','run',nodeEnv], Hostname: response.config.id, name: response.config.id});
                
                //STEP 2b - Get the containe ID and save it in the config
                response.config.container_id = container.id;
                setConfig(response.config);

                //STEP 2c - Remove container from the default network
                let network = await docker.getNetwork('bridge');
                await network.disconnect({"Container": response.config.id});
                
                //STEP 2d - Add container to the bug network
                network = await docker.getNetwork('bug');
                await network.connect({"Container": response.config.id});

            }
            else{
                //STEP 2a - Get container info
                try {
                    container = await docker.getContainer(response.config.container_id);
                } 
                catch {
                    console.log("HERE")
                    //If container_id exists but not coresponding container is found remove the refernce and recursion
                    delete response.config.container_id
                    await setConfig(response.config)
                    response = await panelStart(panelId)
                }

            }   
            //STEP 3 - Launch the Container
            response.state = await container.start();
        }
        else{
            throw {message:"Invalid Panel ID. Does the panel exist?"}
        }

    } catch (error) {
        response.error = error
        logger.warn(`panel-start: ${error.trace || error || error.message}`);
    }

    return response
}