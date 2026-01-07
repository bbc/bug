import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";

export default {
    title: "BUG Core/Forms/BugConfigFormTextField",
    component: BugConfigFormTextField,
    parameters: {
        docs: {
            description: {
                component: `This is a form control, designed to work within a BugForm.<br/>
                BugForm uses react-hook-form to manage the form state. See https://react-hook-form.com/ for more info.<br />
                A simple textfield control with optional filtering and styling.`,
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
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to disable the control",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        defaultValue: {
            type: { name: "data", required: false },
            defaultValue: "This is some text",
            description: "The selected value when the control is loaded.",
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
        filter: {
            type: { name: "string", required: false },
            defaultValue: null,
            description:
                "Can either be a callback function (which is passed a value) or a regular expression which removes the specified characters.",
            table: {
                type: { summary: "string" },
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
        helperText: {
            type: { name: "string", required: false },
            defaultValue: "Tell me something interesting",
            description: "Optional helper text to be shown below the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        max: {
            type: { name: "number" },
            defaultValue: null,
            description: "Enforces a maximum value for the control (NOTE - only works if 'numeric' is enabled)",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        min: {
            type: { name: "number" },
            defaultValue: null,
            description: "Enforces a minimum value for the control (NOTE - only works if 'numeric' is enabled)",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        numeric: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description:
                "Enables support for min/max rules, and enforces only numerical values when control loses focus",
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
        supportsValidation: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description:
                "If enabled, colors the helperText red on error, green on no error (used for module validation)",
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
        type: {
            type: { name: "string", required: false },
            defaultValue: "text",
            description: "HTML5 input type",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "text" },
            },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            description: "The MUI variant of the button. Always use 'standard' in config forms.",
            defaultValue: "standard",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "standard" },
            },
        },
        InputProps: {
            type: { name: "data" },
            defaultValue: {},
            description: "Optional React props object to be passed to the Input control",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const MyBugConfigFormTextField = (args) => {
    const { control } = useForm();

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid size={{ xs: 12 }}>
                        <BugConfigFormTextField
                            name={args.name}
                            label={args.label}
                            control={control}
                            disabled={args.disabled}
                            defaultValue={args.defaultValue}
                            fullWidth={args.fullWidth}
                            rules={args.rules}
                            error={args.error}
                            helperText={args.helperText}
                            numeric={args.numeric}
                            min={args.min}
                            max={args.max}
                            supportsValidation={args.supportsValidation}
                            variant={args.variant}
                        />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

MyBugConfigFormTextField.displayName = "BugConfigFormTextField";
MyBugConfigFormTextField.storyName = "BugConfigFormTextField";
MyBugConfigFormTextField.parameters = {
    docs: {
        source: {
            code: `
<BugForm>
    <BugForm.Header>My Form</BugForm.Header>
    <BugForm.Body>
        <Grid container>
            <Grid size={{ xs: 12 }}>
                <BugConfigFormTextField
                    name="control-name"
                    label="My Control Name"
                    control={control}
                    disabled={false}
                    defaultValue="This is some text"
                    fullWidth={true}
                    helperText="Tell me something interesting"
                    numeric={false}
                    min={null}
                    max={null}
                    supportsValidation={false}
                    variant="standard"
                />
            </Grid>
        </Grid>
    </BugForm.Body>
</BugForm>
        `,
        },
    },
};
