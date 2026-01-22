import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugForm from "@core/BugForm";
import { Grid } from "@mui/material";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import { useArgs } from "@storybook/preview-api";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const AutocompleteFormWrapper = ({ currentArgs, updateArgs, ...args }) => {
    const { control, reset } = useForm({
        defaultValues: {
            [args.name]: currentArgs.defaultValue ?? args.defaultValue,
        },
    });

    // Reset form internal state if Storybook args change manually via Controls table
    useEffect(() => {
        reset({ [args.name]: currentArgs.defaultValue });
    }, [currentArgs.defaultValue, reset, args.name]);

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid item size={{ xs: 12 }}>
                        <BugConfigFormSwitch {...args} control={control} defaultValue={currentArgs.defaultValue} />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

export default {
    title: "BUG Core/Forms/BugConfigFormSwitch",
    component: BugConfigFormSwitch,
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
                A simple switch toggle control.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        name: "control-name",
        label: "My Control Name",
        defaultValue: false,
        helperText: "Choose true ... or false!",
        disabled: false,
    },

    argTypes: {
        control: {
            description: "This should be passed from the parent BugForm",
            control: { disable: true },
            table: { type: { summary: "data" }, defaultValue: { summary: "null" } },
        },
        defaultValue: {
            description: "The selected value when the control is loaded. True or false.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
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
