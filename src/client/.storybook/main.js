const path = require("path");
const fs = require("fs");
const { merge } = require("webpack-merge");

function getPackageDir(filepath) {
    let currDir = path.dirname(require.resolve(filepath));
    while (true) {
        if (fs.existsSync(path.join(currDir, "package.json"))) {
            return currDir;
        }
        const { dir, root } = path.parse(currDir);
        if (dir === root) {
            throw new Error(`Could not find package.json in the parent directories starting from ${filepath}.`);
        }
        currDir = dir;
    }
}

module.exports = {
    core: {
        builder: "webpack5",
    },
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@react-theming/storybook-addon",
        "@storybook/preset-create-react-app",
    ],
    framework: "@storybook/react",
    webpackFinal: async (config) => ({
        ...config,
        resolve: {
            ...config.resolve,
            alias: {
                ...config.resolve?.alias,
                "@modules": path.resolve("../modules"),
                "@components": path.resolve("src/components"),
                "@core": path.resolve("src/core"),
                "@data": path.resolve("src/data"),
                "@redux": path.resolve("src/redux"),
                "@utils": path.resolve("src/utils"),
                "@hooks": path.resolve("src/hooks"),
                "@emotion/core": getPackageDir("@emotion/react"),
                "@emotion/styled": getPackageDir("@emotion/styled"),
                "emotion-theming": getPackageDir("@emotion/react"),
            },
        },
    }),
};
