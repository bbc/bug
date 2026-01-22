import BugSparkCell from "@core/BugSparkCell";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugSparkCell",
    component: BugSparkCell,
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
                component: `A sparkline control optimized for use in a <b>BugApiTable</b> cell to show data trends (e.g., bitrate, CPU usage) over time.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        value: "10 Mbps",
        height: "50px",
        showEmpty: false,
        history: [
            { timestamp: "2022-02-09T09:58:11.635Z", value: 0 },
            { timestamp: "2022-02-09T09:58:14.468Z", value: 10 },
            { timestamp: "2022-02-09T09:58:15.468Z", value: 20 },
            { timestamp: "2022-02-09T09:58:16.468Z", value: 3 },
            { timestamp: "2022-02-09T09:58:17.212Z", value: 5 },
            { timestamp: "2022-02-09T09:58:19.961Z", value: 25 },
        ],
        sx: {},
    },

    argTypes: {
        history: {
            description: "An array of data points. Each point requires a **timestamp** and a **value**.",
            table: {
                type: { summary: "array" },
                defaultValue: { summary: "[]" },
            },
        },
        value: {
            description: "A text label to overlay on the sparkline (e.g., the current real-time value).",
            table: {
                type: { summary: "string" },
            },
        },
        height: {
            description: "The height of the sparkline. Accepts any valid CSS unit.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "100%" },
            },
        },
        showEmpty: {
            description: "If false, the control will remain hidden if all values in history are zero.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        sx: {
            description: "MUI style overrides.",
            table: {
                type: { summary: "object" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div
            style={{
                padding: "20px",
            }}
        >
            <div
                style={{
                    padding: "10px",
                    maxWidth: "300px",
                    background: "#111",
                }}
            >
                <BugSparkCell {...args} />
            </div>
        </div>
    ),
};
