'use strict';

const logger = require('@utils/logger');
const modulePackage = require('@models/module-package');
const docker = require('@utils/docker');

module.exports = async () => {
    try {
        const images =  await docker.listImages()
        let modules = await modulePackage.list();
        modules.sort(function (a, b) {
            return (a.longname < b.longname) ? -1 : 1;
        });

        let list = []
        for(let module of modules){
            for(const image of images){
                const tag = image.RepoTags[0].split(':')[0]
                if(tag === module.name){
                    module.image = image
                }
            }
            list.push(module)
        }
        return list;
    } catch (error) {
        logger.warn(`module-list: ${error.trace || error || error.message}`);
    }
}