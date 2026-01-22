import BugApiSwitch from "@core/BugApiSwitch";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/API Controls/BugApiSwitch",
    component: BugApiSwitch,
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
                component: `A switch control which is designed for use with an API.<br />
                Triggers the onChange event, and disables the control to allow the new value to be updated.<br />
                If the value hasn't changed within the timeout period the control is re-enabled and the previous state loaded.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },
    args: {
        checked: false,
        color: "primary",
        disabled: false,
        timeout: 10000,
        sx: {},
    },
    argTypes: {
        onChange: {
            action: "changed",
            table: { disable: true },
        },
        checked: {
            description: "Whether the control is checked",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        color: {
            options: ["primary", "secondary", "default"],
            description: "The color to pass to the Switch control - see MaterialUI for options",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "primary" },
            },
        },
        disabled: {
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        sx: {
            description: "An object containing style overrides - see MaterialUI docs for options",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
        timeout: {
            description: "Duration to wait (in milliseconds) before reverting to previous state",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "10000" },
            },
        },
    },
};

export const Default = {
    name: "BugApiSwitch",
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugApiSwitch {...args} />
        </div>
    ),
};
