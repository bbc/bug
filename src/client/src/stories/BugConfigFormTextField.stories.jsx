import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import { Grid } from "@mui/material";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import { useArgs } from "@storybook/preview-api";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const AutocompleteFormWrapper = ({ currentArgs, updateArgs, ...args }) => {
    const { control, reset } = useForm({
        defaultValues: {
            [args.name]: currentArgs.defaultValue || args.defaultValue,
        },
    });

    useEffect(() => {
        reset({ [args.name]: currentArgs.defaultValue });
    }, [currentArgs.defaultValue, reset, args.name]);

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid item size={{ xs: 12 }}>
                        <BugConfigFormTextField {...args} control={control} defaultValue={currentArgs.defaultValue} />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

export default {
    title: "BUG Core/Forms/BugConfigFormTextField",
    component: BugConfigFormTextField,
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
                BugForm uses <b>react-hook-form</b> to manage the form state. <br />
                A simple textfield control with optional filtering and styling.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        name: "control-name",
        label: "My Control Name",
        defaultValue: "This is some text",
        helperText: "Tell me something interesting",
        disabled: false,
        fullWidth: true,
        numeric: false,
        min: null,
        max: null,
        error: false,
        supportsValidation: false,
        variant: "standard",
        rules: { required: true },
        type: "text",
        sx: {},
        InputProps: {},
    },

    argTypes: {
        control: {
            description: "This should be passed from the parent BugForm",
            control: { disable: true },
            table: { type: { summary: "data" }, defaultValue: { summary: "null" } },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            control: { type: "select" },
            table: { type: { summary: "string" }, defaultValue: { summary: "standard" } },
        },
        filter: {
            description: "Callback function or regex to filter input characters",
            table: { type: { summary: "string | function" }, defaultValue: { summary: "null" } },
        },
        sx: {
            description: "MUI style overrides",
            table: { type: { summary: "object" }, defaultValue: { summary: "{}" } },
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
