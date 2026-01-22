import BugPoeIcon from "@core/BugPoeIcon";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Icons/BugPoeIcon",
    component: BugPoeIcon,
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
                component: `A handy power icon to use in tables to indicate that the item has POE power state.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        active: false,
        disabled: false,
        error: false,
        sx: {},
    },

    argTypes: {
        active: {
            description: "Whether the control is active (usually renders in a 'power on' color).",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        disabled: {
            description: "Whether the control is disabled.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        error: {
            description: "Whether the control is in an error state.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        sx: {
            description: "MUI style overrides (the sx prop).",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px" }}>
            <BugPoeIcon {...args} />
        </div>
    ),
};
