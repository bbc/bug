const path = require("path");
const {
    override,
    addBabelPlugin,
    babelInclude,
    disableEsLint,
    removeModuleScopePlugin,
    addWebpackAlias,
} = require("customize-cra");

module.exports = function (config, env) {
    // Apply all your overrides
    const overriddenConfig = override(
        removeModuleScopePlugin(),
        disableEsLint(),
        babelInclude([
            path.resolve("src"),
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
    )(config, env);

    // Add watchOptions to ignore node_modules
    overriddenConfig.watchOptions = {
        ...(overriddenConfig.watchOptions || {}),
        ignored: /node_modules/,
    };

    return overriddenConfig;
};