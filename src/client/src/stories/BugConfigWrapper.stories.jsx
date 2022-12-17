import { Source } from "@storybook/addon-docs/blocks";
import { Title, Subtitle, Description, ArgsTable, Stories, PRIMARY_STORY } from "@storybook/addon-docs";

export default {
    title: "BUG Core/Wrappers/BugConfigWrapper",
    component: "div",
    parameters: {
        docs: {
            description: {
                component: `This component provides a handy wrapper for module config pages.<br />
                It takes BugConfig components as children and handles pushing the config back to the API endpoint for you.<br/>
                A JSON-editor is also available for editing the config.`,
            },
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />

                    <Source
                        language="jsx"
                        code={`
import BugConfigWrapper from "@core/BugConfigWrapper";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import { useSelector } from "react-redux";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    return (
        <>
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
        </>
    );
}
      `}
                    />
                    <br />
                    <ArgsTable story={PRIMARY_STORY} />
                </>
            ),
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        children: {
            control: {
                disable: true,
            },
            type: { name: "data", required: true },
            description: "The form controls to display",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        config: {
            control: {
                disable: true,
            },
            type: { name: "data", required: true },
            description: "The panelconfig data object (from redux)",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        handleSubmit: {
            control: {
                disable: true,
            },
            description: "Handles the form submit event send from the form wrapper hook",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugConfigWrapper = (args) => <>YAY</>;

MyBugConfigWrapper.displayName = "BugConfigWrapper";
MyBugConfigWrapper.storyName = "BugConfigWrapper";
