import BugPowerIcon from "@core/BugPowerIcon";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Icons/BugPowerIcon",
    component: BugPowerIcon,
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
                component: `A handy power state icon to use in tables to indicate that the item is online or powered.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        disabled: false,
        activeColor: "primary.main",
        sx: {},
    },

    argTypes: {
        disabled: {
            description: "Whether the icon represents a powered-off or disabled state.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        activeColor: {
            control: "color",
            description: "The icon color when enabled (MUI palette key or CSS color).",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "primary.main" },
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
            <BugPowerIcon {...args} />
        </div>
    ),
};
