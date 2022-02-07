import BugConfigFormSelect from "@core/BugConfigFormSelect";
import { useForm } from "react-hook-form";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default {
    title: "BUG Core/Forms/BugConfigFormSelect",
    component: BugConfigFormSelect,
    parameters: {
        docs: {
            description: {
                component: `This is a form control, designed to work within a BugForm.<br/>
                BugForm uses react-hook-form to manage the form state. See https://react-hook-form.com/ for more info.<br />
                A simple select dropdown with BUG styling. Items are passed as a javascript object.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {},
};

export const MyBugConfigFormSelect = (args) => {
    const { control } = useForm();

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid item xs={12}>
                        <BugConfigFormSelect
                            name="color"
                            control={control}
                            fullWidth
                            label="Color"
                            helperText="Select a nice color"
                            items={{
                                blue: "Blue",
                                green: "Green",
                                red: "Red",
                            }}
                        />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

MyBugConfigFormSelect.displayName = "BugConfigFormSelect";
MyBugConfigFormSelect.storyName = "BugConfigFormSelect";
MyBugConfigFormSelect.parameters = {
    docs: {
        source: {
            code: `
<BugForm>
    <BugForm.Header>My Form</BugForm.Header>
    <BugForm.Body>
        <Grid container>
            <Grid item xs={12}>
                <BugConfigFormSelect
                name="title"
                control={control}
                fullWidth
                label="Title"
                items={{
                    blue: "Blue",
                    green: "Green",
                    red: "Red",
                }}
            />
            </Grid>
        </Grid>
    </BugForm.Body>
    <BugForm.Actions>
        <BugConfigFormSelect />
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
