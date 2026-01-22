import BugConfigWrapper from "@core/BugConfigWrapper";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Wrappers/BugConfigWrapper",
    component: BugConfigWrapper,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Source
                        language="jsx"
                        dark
                        code={`
import BugConfigWrapper from "@core/BugConfigWrapper";
import { Grid } from "@mui/material";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import { useSelector } from "react-redux";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    return (
        <BugConfigWrapper config={panelConfig.data} handleSubmit={handleSubmit}>
            <Grid item xs={12}>
                <BugConfigFormTextField
                    name="title"
                    control={control}
                    rules={{ required: true }}
                    fullWidth
                    error={errors.title}
                    defaultValue={panelConfig.data.title}
                    label="Panel Title"
                />
            </Grid>
        </BugConfigWrapper>
    );
}
      `}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `This component provides a handy wrapper for module config pages.<br />
                It takes BugConfig components as children and handles pushing the config back to the API endpoint for you.<br/>
                A JSON-editor is also available for editing the config.`,
            },
        },
    },

    args: {
        config: { title: "Example Config" },
    },

    argTypes: {
        children: {
            control: { disable: true },
            description: "The form controls to display",
            table: { type: { summary: "node" } },
        },
        config: {
            control: { disable: true },
            description: "The panelconfig data object (from redux)",
            table: { type: { summary: "object" } },
        },
        handleSubmit: {
            control: { disable: true },
            description: "Handles the form submit event sent from the form wrapper hook",
            table: { type: { summary: "function" } },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px" }}>
            <div style={{ border: "1px dashed #ccc", padding: "20px" }}>
                <BugConfigWrapper {...args}>
                    <div style={{ textAlign: "center", padding: "20px" }}>[ BugConfig Components Go Here ]</div>
                </BugConfigWrapper>
            </div>
        </div>
    ),
};
