import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
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
                        <BugConfigFormPanelGroup {...args} control={control} defaultValue={currentArgs.defaultValue} />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

export default {
    title: "BUG Core/Forms/BugConfigFormPanelGroup",
    component: BugConfigFormPanelGroup,
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
                A dropdown control listing all available panel groups. Can also be used to add a new group.<br />
                **Please Note**: The control will not be populated with live panel group data in this Storybook environment.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        name: "control-name",
        defaultValue: "Group 1",
    },

    argTypes: {
        name: {
            description: "Field name to use for this control eg 'group'",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        control: {
            description: "This should be passed from the parent BugForm",
            control: { disable: true },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "null" },
            },
        },
        defaultValue: {
            description: "The selected value when the control is loaded.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
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
