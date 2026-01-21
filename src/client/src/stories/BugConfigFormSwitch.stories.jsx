import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugForm from "@core/BugForm";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";

export default {
    title: "BUG Core/Forms/BugConfigFormSwitch",
    component: BugConfigFormSwitch,
    parameters: {
        docs: {
            description: {
                component: `This is a form control, designed to work within a BugForm.<br/>
                BugForm uses react-hook-form to manage the form state. See https://react-hook-form.com/ for more info.<br />
                A switch control. Items are passed as a javascript object.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        name: {
            type: { name: "string", required: true },
            defaultValue: "control-name",
            description: "Field name to use for this control eg 'tags' or 'categories'",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        label: {
            type: { name: "string", required: true },
            defaultValue: "My Control Name",
            description: "Short description to be shown in the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        helperText: {
            type: { name: "string", required: false },
            defaultValue: "Choose true ... or false!",
            description: "Optional helper text to be shown below the control",
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
        rules: {
            type: { name: "data", required: false },
            defaultValue: null,
            description:
                "Optional validation rules in object format. See https://react-hook-form.com/api/usecontroller/controller for more information.",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        defaultValue: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description: "The selected value when the control is loaded. True or false.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to disable the control",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
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

export const MyBugConfigFormSwitch = (args) => {
    const { control } = useForm();

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid size={{ xs: 12 }}>
                        <BugConfigFormSwitch
                            name={args.name}
                            control={control}
                            label={args.label}
                            helperText={args.helperText}
                            rules={args.rules}
                            defaultValue={args.defaultValue}
                            disabled={args.disabled}
                        />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

MyBugConfigFormSwitch.displayName = "BugConfigFormSwitch";
MyBugConfigFormSwitch.storyName = "BugConfigFormSwitch";
MyBugConfigFormSwitch.parameters = {
    docs: {
        source: {
            code: `
<BugForm>
    <BugForm.Header>My Form</BugForm.Header>
    <BugForm.Body>
        <Grid container>
            <Grid size={{ xs: 12 }}>
                <BugConfigFormSwitch
                    name="control-name"
                    control={control}
                    label="My Control Name"
                    helperText="Choose true ... or false!"
                    defaultValue={false}
                    disabled={false}
                />
            </Grid>
        </Grid>
    </BugForm.Body>
</BugForm>
        `,
        },
    },
};
