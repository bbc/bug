import BugCountdownSpinner from "@core/BugCountdownSpinner";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugCountdownSpinner",
    component: BugCountdownSpinner,
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
                component: `A circular progress icon which counts down over a specified duration. <br />
                Useful for indicating when an automated action (like a page refresh or a redirect) is about to occur.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        duration: 5000,
        sx: {},
    },

    argTypes: {
        duration: {
            description: "Duration (in milliseconds) over which the progress should count down",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 5000 },
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
            <BugCountdownSpinner {...args} />
        </div>
    ),
};
