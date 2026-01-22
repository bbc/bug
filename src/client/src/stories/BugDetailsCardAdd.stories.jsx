import BugDetailsCardAdd from "@core/BugDetailsCardAdd";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Layout/BugDetailsCardAdd",
    component: BugDetailsCardAdd,
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
                component: `Useful when you want to allow users to add card content.<br />
                Often used in codecs and other devices where you have dynamic content to display.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        width: "10rem",
        sx: {},
    },

    argTypes: {
        onAdd: {
            description: "Provides a callback when the card button is clicked",
            control: { disable: true },
            table: {
                type: { summary: "function" },
                defaultValue: { summary: "null" },
            },
        },
        width: {
            description: "The width of the card - can be in any valid CSS unit",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "10rem" },
            },
        },
        sx: {
            description: "MUI style overrides",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugDetailsCardAdd {...args} onAdd={() => alert("Add button clicked")} />
        </div>
    ),
};
