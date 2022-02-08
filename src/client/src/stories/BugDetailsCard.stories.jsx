import BugDetailsCard from "../core/BugDetailsCard";

export default {
    title: "BUG Core/Layout/BugDetailsCard",
    component: BugDetailsCard,
    parameters: {
        docs: {
            description: {
                component: `A card control for displaying name/value-style content in a card.<br />
                Uses a BugDetailsTable to display the content`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        title: {
            type: { name: "string", required: true },
            defaultValue: "My Details Card",
            description: "Text to show at the top of the card",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        width: {
            type: { name: "string", required: false },
            defaultValue: "10rem",
            description: "The width of the card - can be in any valid CSS unit",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "10rem" },
            },
        },
        items: {
            type: { name: "data", required: true },
            defaultValue: [
                { name: "Voltage 1", value: "12.3 V" },
                { name: "Voltage 2", value: "12.3 V" },
            ],
            description:
                "An array of objects with name and value properties to display in the card. The value can be a string, or a React component",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        collapsible: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description: "Whether the card can be collapsed. Cannot be used with the collapsible prop.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        closable: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description:
                "Whether the card can be closed. Make sure to set the 'onClose' prop to handle the close event. Cannot be used with the closable prop.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        collapsed: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description: "Whether the card should be collapsed by default.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
    },
};

export const MyBugDetailsCard = (args) => <BugDetailsCard {...args} />;

MyBugDetailsCard.displayName = "BugDetailsCard";
MyBugDetailsCard.storyName = "BugDetailsCard";
