const path = require("path");

console.log(path.resolve("src/core"));

module.exports = {
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@react-theming/storybook-addon"],
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
                "@pages": path.resolve("src/pages"),
                "@redux": path.resolve("src/redux"),
                "@utils": path.resolve("src/utils"),
                "@hooks": path.resolve("src/hooks"),
            },
        },
    }),
};
