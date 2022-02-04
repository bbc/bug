import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useForm } from "react-hook-form";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";

export default {
    title: "BUG Core/Forms/BugConfigFormPanelGroup",
    component: BugConfigFormPanelGroup,
    parameters: {
        docs: {
            description: {
                component: `This is a form control, designed to work within a BugForm.<br/>
                BugForm uses react-hook-form to manage the form state. See https://react-hook-form.com/ for more info.<br />
                A dropdown control listing all available panel groups. Can also be used to add a new group.<br />
**Please Note**: the control will not be populated with data on this storybook`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        name: {
            type: { name: "string", required: true },
            defaultValue: "control-name",
            description: "Field name to use for this control eg 'group'",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        control: {
            type: { name: "data", required: true },
            defaultValue: {},
            description: "This should be passed from the parent BugForm",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        defaultValue: {
            type: { name: "string", required: false },
            defaultValue: "Group 1",
            description: "The selected value when the control is loaded.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugConfigFormPanelGroup = (args) => {
    const { control } = useForm();

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid item xs={12}>
                        <BugConfigFormPanelGroup name={args.name} control={control} defaultValue={args.defaultValue} />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

MyBugConfigFormPanelGroup.displayName = "BugConfigFormPanelGroup";
MyBugConfigFormPanelGroup.storyName = "BugConfigFormPanelGroup";
MyBugConfigFormPanelGroup.parameters = {
    docs: {
        source: {
            code: `
<BugForm>
    <BugForm.Header>My Form</BugForm.Header>
    <BugForm.Body>
        <Grid container>
            <Grid item xs={12}>
                <BugConfigFormPanelGroup
                    name="control-name"
                    control={control}
                    defaultValue="Group 1"
                />
            </Grid>
        </Grid>
    </BugForm.Body>
</BugForm>`,
        },
    },
};
