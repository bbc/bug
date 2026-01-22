import { resolve } from "path";
import { mergeConfig } from "vite";

/** @type { import('@storybook/react-vite').StorybookConfig } */
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

        // FIX: correct base path for GitHub Pages repo site
        return mergeConfig(config, {
            base: "/bug/storybook/",
        });
    },

    docs: {
        defaultName: "Documentation",
        autodocs: true,
    },

    typescript: {
        reactDocgen: "react-docgen",
    },
};

export default config;
