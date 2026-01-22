import BugVolumeBar from "@core/BugVolumeBar";
import { Stack } from "@mui/material";
import { Controls, Description, Stories, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugVolumeBar",
    component: BugVolumeBar,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <div class="story-no-header">
                        <Story />
                    </div>
                    <Controls />
                    <Stories />
                </>
            ),
            description: {
                component: `A vertical audio level meter. It is designed to be high-density, typically used in groups to monitor multiple channels of audio simultaneously.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        value: 70,
        min: 0,
        max: 100,
        height: "150px",
        width: "8px",
        sx: {},
    },

    argTypes: {
        value: {
            description: "The current audio level to display.",
            table: { type: { summary: "number" } },
        },
        min: {
            description: "The minimum value (floor) of the meter.",
            table: { type: { summary: "number" }, defaultValue: { summary: 0 } },
        },
        max: {
            description: "The maximum value (ceiling) of the meter.",
            table: { type: { summary: "number" }, defaultValue: { summary: 100 } },
        },
        height: {
            description: "Total vertical height (e.g., '100px', '10rem').",
            table: { type: { summary: "string" }, defaultValue: { summary: "100px" } },
        },
        width: {
            description: "Thickness of the bar.",
            table: { type: { summary: "string" }, defaultValue: { summary: "6px" } },
        },
        sx: {
            description: "MUI style overrides.",
            table: { type: { summary: "object" } },
        },
    },
};

export const Mono = {
    render: (args) => (
        <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
            <BugVolumeBar {...args} />
        </div>
    ),
};

export const StereoPair = {
    render: (args) => (
        <Stack style={{ padding: "20px", display: "flex", justifyContent: "center" }} spacing={1} direction="row">
            <BugVolumeBar {...args} value={75} />
            <BugVolumeBar {...args} value={72} />
        </Stack>
    ),
};
