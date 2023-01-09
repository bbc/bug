import BugVolumeBar from "@core/BugVolumeBar";

export default {
    title: "BUG Core/Controls/BugVolumeBar",
    component: BugVolumeBar,
    parameters: {
        docs: {
            description: {
                component: `A control which displays audio levels in a vertical bar`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        height: {
            type: { name: "string", required: false },
            defaultValue: "100px",
            description: "The height of the control - can be in any valid CSS unit",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "100px" },
            },
        },
        max: {
            type: { name: "number", required: false },
            description: "The maximum level of the audio meter",
            defaultValue: 100,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 100 },
            },
        },
        min: {
            type: { name: "number", required: false },
            description: "The minimum level of the audio meter",
            defaultValue: 0,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 0 },
            },
        },
        sx: {
            type: { name: "data" },
            defaultValue: {},
            description:
                "An object containing style overrides - see MaterialUI docs for options: https://mui.com/system/getting-started/the-sx-prop/",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "{}" },
            },
        },
        value: {
            type: { name: "number", required: true },
            description: "The volume level of the audio meter",
            defaultValue: 70,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        width: {
            type: { name: "string", required: false },
            defaultValue: "6px",
            description: "The width of the control - can be in any valid CSS unit",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "6px" },
            },
        },
    },
};

export const MyBugVolumeBar = (args) => <BugVolumeBar {...args} />;
MyBugVolumeBar.displayName = "BugVolumeBar";
MyBugVolumeBar.storyName = "BugVolumeBar";
