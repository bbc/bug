'use strict';

const path = require('path');
const logger = require('@utils/logger');
const docker = require('@utils/docker');
const writeDockerfile = require('@utils/write-dockerfile');
const moduleList = require('@services/module-list')
const config = require('@services/panel-getconfig');

module.exports = async (moduleName) => {
    try {
        let status = {
            module: moduleName,
            tag: moduleName+':latest'
        }

        //Get all modules
        let list = await moduleList()
             
        //Isolate just module names in a list
        for(var i=0; i < list.length; i++){
            list[i] = list[i].name
        }
        
        //Check if module name is valid
        if(list.includes(moduleName)){

            //Get full path in container
            status.modulePath = path.join(__dirname,'..','modules',moduleName);

            //Write a dockerfile for the module
            writeDockerfile(status.modulePath)

            //Build the image with dockerode
            const stream = await docker.buildImage(
                {
                    context: status.modulePath,
                    src: ['/']
                },
                {
                    t: moduleName
                }
            )   
            
            //Get some status information
            // await new Promise((resolve, reject) => {
            //     dockerode.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
            //   });
        }
        else{
            status.error = 'Module not found.'
            logger.error('module-build: Module "'+moduleName+'" not found.')
        }

        return status

    } catch (error) {
        logger.warn(`module-build: ${error.trace || error || error.message}`);
    }

}