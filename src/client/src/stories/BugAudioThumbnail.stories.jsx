import BugAudioThumbnail from "../core/BugAudioThumbnail";

export default {
    title: "BUG Core/Data/BugAudioThumbnail",
    component: BugAudioThumbnail,
    parameters: {
        docs: {
            description: {
                component: `A control which adds audio levels to either side of an image`,
            },
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        src: {
            type: { name: "string", required: true },
            defaultValue: "",
            description: "The source of the image to be displayed",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
        leftLevel: {
            type: { name: "number", required: true },
            description: "The level of the left audio meter",
            defaultValue: 50,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        rightLevel: {
            type: { name: "number", required: true },
            description: "The level of the right audio meter",
            defaultValue: 50,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        min: {
            type: { name: "number", required: true },
            description: "The minimum level of the meters",
            defaultValue: 0,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        max: {
            type: { name: "number", required: true },
            description: "The maximum level of the meters",
            defaultValue: 100,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugAudioThumbnail = (args) => <BugAudioThumbnail {...args} />;
MyBugAudioThumbnail.displayName = "BugAudioThumbnail";
MyBugAudioThumbnail.storyName = "BugAudioThumbnail";
