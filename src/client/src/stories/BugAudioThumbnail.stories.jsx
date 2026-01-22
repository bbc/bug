import BugAudioThumbnail from "@core/BugAudioThumbnail";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugAudioThumbnail",
    component: BugAudioThumbnail,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A control which adds audio levels to either side of an image`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        src: "",
        sx: {},
        leftLevel: 50,
        rightLevel: 50,
        min: 0,
        max: 100,
    },

    argTypes: {
        src: {
            description: "The source of the image to be displayed",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
        sx: {
            description: "An object containing style overrides - see MaterialUI docs for options",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
        leftLevel: {
            description: "The level of the left audio meter",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "50" },
            },
        },
        rightLevel: {
            description: "The level of the right audio meter",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "50" },
            },
        },
        min: {
            description: "The minimum level of the meters",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "0" },
            },
        },
        max: {
            description: "The maximum level of the meters",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "100" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugAudioThumbnail {...args} />
        </div>
    ),
};
