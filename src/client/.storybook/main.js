import { resolve } from "path";
import { mergeConfig } from "vite";

const config = {
    stories: ["../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],

    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],

    framework: {
        name: "@storybook/react-vite",
        options: {},
    },

    async viteFinal(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@components": resolve(__dirname, "../src/components"),
            "@redux": resolve(__dirname, "../src/redux"),
            "@utils": resolve(__dirname, "../src/utils"),
            "@hooks": resolve(__dirname, "../src/hooks"),
            "@data": resolve(__dirname, "../src/data"),
            "@core": resolve(__dirname, "../src/core"),
        };

        return mergeConfig(config, {
            base: "/storybook/",
        });
    },

    docs: {
        defaultName: "Documentation",
        autodocs: true,
        docsMode: true,
    },

    typescript: {
        reactDocgen: "react-docgen",
    },
};

export default config;
