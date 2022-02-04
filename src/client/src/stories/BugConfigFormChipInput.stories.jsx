import BugConfigFormChipInput from "@core/BugConfigFormChipInput";
import { useForm } from "react-hook-form";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";
import { action } from "@storybook/addon-actions";

export default {
    title: "BUG Core/Forms/BugConfigFormChipInput",
    component: BugConfigFormChipInput,
    parameters: {
        docs: {
            description: {
                component: `This is a form control, designed to work within a BugForm.<br/>
                BugForm uses react-hook-form to manage the form state. See https://react-hook-form.com/ for more info.<br />
                An autocomplete dropdown to display multiple items.<br />
                Can be used with a simple array of strings, or with a custom object with an id and label properties.`,
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
            defaultValue: "Select a number of animals",
            description: "Optional helper text to be shown below the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        control: {
            type: { name: "data", required: false },
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
        sort: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description:
                "Whether the selected values should be sorted alphabetically (only applies when control is first loaded)",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        defaultValue: {
            type: { name: "data", required: false },
            defaultValue: ["zebra"],
            description:
                "The selected value when the control is loaded. Can be an array of strings or objects with id and label properties.",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        options: {
            type: { name: "data", required: true },
            description: "An array of available values to be selected",
            defaultValue: ["zebra", "caterpillar", "horse"],
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        freeSolo: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to allow 'free' text input",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        fullWidth: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Expands the control to fill available horizontal space",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
    },
};

export const MyBugConfigFormChipInput = (args) => {
    const { control } = useForm();

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid item xs={12}>
                        <BugConfigFormChipInput
                            name={args.name}
                            label={args.label}
                            error={args.error}
                            control={control}
                            fullWidth
                            freeSolo={args.freeSolo}
                            sort={args.sort}
                            options={args.options}
                            defaultValue={args.defaultValue}
                            helperText={args.helperText}
                            fullWidth={args.fullWidth}
                        />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

MyBugConfigFormChipInput.displayName = "BugConfigFormChipInput";
MyBugConfigFormChipInput.storyName = "BugConfigFormChipInput";
MyBugConfigFormChipInput.parameters = {
    docs: {
        source: {
            code: `
<BugForm>
    <BugForm.Header>My Form</BugForm.Header>
    <BugForm.Body>
        <Grid container>
            <Grid item xs={12}>
                <BugConfigFormChipInput
                    name="control-name"
                    label="My Control Name"
                    error={false}
                    control={control}
                    fullWidth={true}
                    freeSolo={false}
                    sort={true}
                    options={["zebra", "caterpillar", "horse"]}
                    defaultValue={["zebra"]}
                    helperText="Optional helper text to be shown below the control"
                    fullWidth={false}
                />
            </Grid>
        </Grid>
    </BugForm.Body>
</BugForm>`,
        },
    },
};
