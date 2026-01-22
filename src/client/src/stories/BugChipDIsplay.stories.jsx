import BugChipDisplay from "@core/BugChipDisplay";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugChipDisplay",
    component: BugChipDisplay,
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
                component: `A control for displaying content such as tags<br />`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        options: ["Option 1", "Option 2", "Option 3"],
        sx: {},
    },

    argTypes: {
        avatar: {
            description: "An optional element containing an avatar image to display",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "null" },
            },
        },
        options: {
            description: "An array of strings to display inside the control",
            table: {
                type: { summary: "array" },
                defaultValue: { summary: "[]" },
            },
        },
        sx: {
            description: "An object containing style overrides - see MaterialUI docs for options",
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
            <BugChipDisplay {...args} />
        </div>
    ),
};
