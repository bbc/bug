import { resolve } from "path";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
    stories: ["../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],

    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions" // Recommended for SB8 + @storybook/test
    ],

    framework: {
        // Updated to standard string format for SB8
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

        return config;
    },

    docs: {
        autodocs: true
    },

    typescript: {
        // 'react-docgen' is significantly faster in SB8 than 'react-docgen-typescript'
        reactDocgen: "react-docgen"
    }
};

export default config;