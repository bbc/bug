import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import { useForm } from "react-hook-form";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";

export default {
    title: "BUG Core/Forms/BugConfigFormPasswordTextField",
    component: BugConfigFormPasswordTextField,
    parameters: {
        docs: {
            description: {
                component: `This is a form control, designed to work within a BugForm.<br/>
                BugForm uses react-hook-form to manage the form state. See https://react-hook-form.com/ for more info.<br />
                A password textfield control with BUG styling.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        type: {
            table: { disable: true },
        },
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
        fullWidth: {
            type: { name: "boolean" },
            defaultValue: true,
            description: "Expands the control to fill available horizontal space",
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
        allowShowPassword: {
            type: { name: "boolean", required: false },
            defaultValue: true,
            description:
                "Allows viewing of the password using the icon button. This is only available when the control is not disabled.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
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

export const MyBugConfigFormPasswordTextField = (args) => {
    const { control } = useForm();

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid item xs={12}>
                        <BugConfigFormPasswordTextField
                            name={args.name}
                            label={args.label}
                            control={control}
                            disabled={args.disabled}
                            defaultValue={args.defaultValue}
                            fullWidth={args.fullWidth}
                            rules={args.rules}
                            error={args.error}
                            helperText={args.helperText}
                            variant={args.variant}
                            allowShowPassword={args.allowShowPassword}
                        />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

MyBugConfigFormPasswordTextField.displayName = "BugConfigFormPasswordTextField";
MyBugConfigFormPasswordTextField.storyName = "BugConfigFormPasswordTextField";
MyBugConfigFormPasswordTextField.parameters = {
    docs: {
        source: {
            code: `
<BugForm>
    <BugForm.Header>My Form</BugForm.Header>
    <BugForm.Body>
        <Grid container>
            <Grid item xs={12}>
                <BugConfigFormPasswordTextField
                    name="control-name"
                    control={control}
                    label="My Control Name"
                    helperText="Tell me something interesting"
                    fullWidth={true}
                    defaultValue="This is some text"
                    supportsValidation={false}
                    disabled={false}
                    variant="standard"
                    allowShowPassword={true}
                    rules={{ required: true }}
                    error={false}
                />
            </Grid>
        </Grid>
    </BugForm.Body>
</BugForm>
        `,
        },
    },
};
