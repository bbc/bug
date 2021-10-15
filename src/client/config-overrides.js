// This file (along with customize-cra) allows us to compile the JSX files in the modules folder
var path = require("path");
const {
    override,
    addBabelPlugin,
    babelInclude,
    disableEsLint,
    removeModuleScopePlugin,
    addWebpackAlias,
} = require("customize-cra");

module.exports = function (config, env) {
    return Object.assign(
        config,
        override(
            removeModuleScopePlugin(),
            disableEsLint(),
            babelInclude([
                // include the normal folder
                path.resolve("src"),
                // include the modules folder (all the custom UI components for each module)
                path.resolve("../modules"),
            ]),
            addWebpackAlias({
                "@modules": path.resolve("../modules"),
                "@components": path.resolve("src/components"),
                "@core": path.resolve("src/core"),
                "@data": path.resolve("src/data"),
                "@pages": path.resolve("src/pages"),
                "@redux": path.resolve("src/redux"),
                "@utils": path.resolve("src/utils"),
                "@hooks": path.resolve("src/hooks"),
            }),
            addBabelPlugin("babel-plugin-bulk-import")
        )(config, env)
    );
};
