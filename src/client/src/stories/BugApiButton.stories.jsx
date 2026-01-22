import BugApiButton from "@core/BugApiButton";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/API Controls/BugApiButton",
    component: BugApiButton,
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
                component: `A simple button which is designed for use with an API.<br />
                Triggers the onClick event, and disables the control to allow the new value to be updated.<br />
                If the value hasn't changed within the timeout period the control is re-enabled.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },
    args: {
        disabled: false,
        timeout: 5000,
        variant: "contained",
        sx: {},
    },
    argTypes: {
        disabled: {
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        icon: {
            description: "Optional icon to display at the start. Pass a valid React element.",
            control: { disable: true },
            table: {
                type: { summary: "ReactNode" },
                defaultValue: { summary: "null" },
            },
        },
        onClick: {
            description: "This callback is called when the button is clicked",
            control: { disable: true },
            table: {
                type: { summary: "function" },
            },
        },
        sx: {
            description: "MaterialUI sx prop for style overrides.",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
        timeout: {
            description: "Duration to wait (ms) before reverting state",
            control: { type: "number" },
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "5000" },
            },
        },
        variant: {
            options: ["contained", "outlined", "text"],
            description: "The MUI variant of the button",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "contained" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugApiButton
                {...args}
                onClick={() => {
                    alert("thank you!");
                }}
            >
                Click Me!
            </BugApiButton>
        </div>
    ),
};
