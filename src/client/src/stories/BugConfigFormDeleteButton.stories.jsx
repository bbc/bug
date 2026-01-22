import BugConfigFormDeleteButton from "@core/BugConfigFormDeleteButton";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import { Button, Grid } from "@mui/material";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import { useArgs } from "@storybook/preview-api";
import { useForm } from "react-hook-form";

const AutocompleteFormWrapper = ({ currentArgs, updateArgs, ...args }) => {
    const { control, handleSubmit } = useForm();

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid item size={{ xs: 12 }}>
                        <BugConfigFormTextField name="title" control={control} fullWidth label="Title" />
                    </Grid>
                </Grid>
            </BugForm.Body>
            <BugForm.Actions>
                <BugConfigFormDeleteButton {...args} />
                <Button variant="contained" color="secondary" onClick={() => {}}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit(() => {})}>
                    Save changes
                </Button>
            </BugForm.Actions>
        </BugForm>
    );
};

export default {
    title: "BUG Core/Forms/BugConfigFormDeleteButton",
    component: BugConfigFormDeleteButton,
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
                component: `This is a form control, designed to work within a BugForm.<br/>
                BugForm uses <b>react-hook-form</b> to manage the form state.<br />
                A simple delete button to use at the bottom of a form.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        sx: {},
    },

    argTypes: {
        onClick: {
            action: "clicked",
            description: "This callback is called when the button is clicked",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: "null" },
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
    render: (args) => {
        const [currentArgs, updateArgs] = useArgs();

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <AutocompleteFormWrapper {...args} currentArgs={currentArgs} updateArgs={updateArgs} />
            </div>
        );
    },
};
