'use strict';

const Docker = require('dockerode');
const logger = require('@utils/logger');
const path = require('path');
const socketPath =  process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock'

let docker = new Docker({socketPath: socketPath});

async function listContainers(networkName){
    const containers = await docker.listContainers()
    let containersNetwork = []

    if(containers.length > 0){
        for(const container of containers){
            const networks = container.NetworkSettings.Networks
            for ( var network in networks ) {
                if(network === networkName){
                    containersNetwork.push(container)
                }
            }
        }
    }
    return containersNetwork
}

async function listImages(){
    const images = await docker.listImages()
    return images
}

async function buildImage(moduleName){
    const stream = await docker.buildImage(
        {
            context: path.join(__dirname,'..','modules',moduleName),
            src: ['Dockerfile','package.json','/server']
        },
        {
            t: moduleName
        }
    )
    return progress
}

async function stopContainer(containerName){
    docker.getContainer(containerInfo.Id).stop(cb)
}

async function removeContainer(containerName){

    const container = await docker.getContainer(containerName);
    const data = await container.inspect()
        
    container.remove();
  
}

async function startContainer(panelConfig){
    let state = {
        config: panelConfig
    }

    //STEP 1 - Build the image for the module, if it's already been done this will be quick
    state.image = buildImage(panelConfig.module)

    //STEP 2 - Check if the container already exists, if not create one

    //STEP 3 - Launch the Container


    //STEP 4 - Pass the config

    state.container = docker.getContainer(panelConfig.id);


    // console.log(data)

    return state
}

module.exports = {
    listContainers: listContainers,
    listImages: listImages,
    buildImage: buildImage,
    startContainer: startContainer,
    stopContainer: stopContainer
}