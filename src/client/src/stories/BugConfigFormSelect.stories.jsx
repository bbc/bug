import BugConfigFormSelect from "@core/BugConfigFormSelect";
import { useForm } from "react-hook-form";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";

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
            defaultValue: "Select an animal",
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
        error: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description:
                "This is usually handled by the parent BugForm but can also be set manually. Change the helperText to add additional error information.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        rules: {
            type: { name: "data", required: false },
            defaultValue: { required: true },
            description:
                "Optional validation rules in object format. See https://react-hook-form.com/api/usecontroller/controller for more information.",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        defaultValue: {
            type: { name: "data", required: false },
            defaultValue: "zebra",
            description:
                "The selected value when the control is loaded. This should be a valid ID listed in the items array.",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        options: {
            type: { name: "data", required: true },
            description:
                "An array of available values to be selected. Each array item should contain an id and lebel property.",
            defaultValue: [
                { id: "zebra", label: "Zebra" },
                { id: "caterpillar", label: "Caterpillar" },
                { id: "horse", label: "Horse" },
            ],
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        fullWidth: {
            type: { name: "boolean" },
            defaultValue: true,
            description: "Expands the control to fill available horizontal space",
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

export const MyBugConfigFormSelect = (args) => {
    const { control } = useForm();

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid item xs={12}>
                        <BugConfigFormSelect
                            name={args.name}
                            control={control}
                            fullWidth={args.fullWidth}
                            label={args.label}
                            helperText={args.helperText}
                            options={args.options}
                            error={args.error}
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
                    name="control-name"
                    control={control}
                    label="My Control Name"
                    helperText="Select an animal"
                    fullWidth={true}
                    defaultValue="zebra"
                    options={[
                        {id: "zebra", label: "Zebra"},
                        {id: "caterpillar", label: "Caterpillar"},
                        {id: "horse", label: "Horse"},
                    ]}
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
