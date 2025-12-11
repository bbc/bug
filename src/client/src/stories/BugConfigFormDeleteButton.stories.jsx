import BugConfigFormDeleteButton from "@core/BugConfigFormDeleteButton";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";

export default {
    title: "BUG Core/Forms/BugConfigFormDeleteButton",
    component: BugConfigFormDeleteButton,
    parameters: {
        docs: {
            description: {
                component: `This is a form control, designed to work within a BugForm.<br/>
                BugForm uses react-hook-form to manage the form state. See https://react-hook-form.com/ for more info.<br />
                A simple delete button to use at the bottom of a form`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        onClick: {
            type: { name: "function", required: true },
            defaultValue: null,
            description: "This callback is called when the button is clicked",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        sx: {
            type: { name: "data" },
            defaultValue: {},
            description:
                "An object containing style overrides - see MaterialUI docs for options: https://mui.com/system/getting-started/the-sx-prop/",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const MyBugConfigFormDeleteButton = (args) => {
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
                <Button variant="contained" color="secondary" onClick={handleSubmit}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Save changes
                </Button>
            </BugForm.Actions>
        </BugForm>
    );
};

MyBugConfigFormDeleteButton.displayName = "BugConfigFormDeleteButton";
MyBugConfigFormDeleteButton.storyName = "BugConfigFormDeleteButton";
MyBugConfigFormDeleteButton.parameters = {
    docs: {
        source: {
            code: `
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
        <BugConfigFormDeleteButton />
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
            Save changes
        </Button>
    </BugForm.Actions>
</BugForm>
        `,
        },
    },
};
