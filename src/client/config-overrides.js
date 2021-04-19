// This file (along with customize-cra) allows us to compile the JSX files in the modules folder
var path = require('path');
const {
    override,
    babelInclude,
    disableEsLint,
    removeModuleScopePlugin,
    addWebpackAlias
} = require("customize-cra");

module.exports = function (config, env) {
    return Object.assign(config, override(
        removeModuleScopePlugin(),
        disableEsLint(),
        babelInclude([
            // include the normal folder
            path.resolve('src'),
            // include the modules folder (all the custom UI components for each module)
            path.resolve('../modules')
        ]),
        addWebpackAlias({
            '@modules': path.resolve('../modules'),
            '@components': path.resolve('src/components'),
            '@data': path.resolve('src/data'),
            '@pages': path.resolve('src/pages'),
            '@data': path.resolve('src/data'),
            '@redux': path.resolve('src/redux'),
            '@utils': path.resolve('src/utils'),
        }),
    )(config, env)
    )
}