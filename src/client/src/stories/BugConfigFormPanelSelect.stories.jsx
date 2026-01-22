import BugConfigFormPanelSelect from "@core/BugConfigFormPanelSelect";
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
                        <BugConfigFormPanelSelect {...args} control={control} defaultValue={currentArgs.defaultValue} />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

export default {
    title: "BUG Core/Forms/BugConfigFormPanelSelect",
    component: BugConfigFormPanelSelect,
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
                A dropdown control for selecting a single panel. Often used to select remote panel data sources.<br/>
                Optionally takes a 'capability' field which filters panels by the capability the panel provides.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        name: "control-name",
        label: "Select a panel",
        helperText: "Select a panel source for DHCP data",
        capability: "dhcp-server",
        defaultValue: "1",
        error: false,
        fullWidth: true,
        mockApiData: {
            status: "success",
            data: [
                { id: "1", title: "Cisco Router Bay 1", enabled: true },
                { id: "2", title: "Mikrotik Router Bay 1", enabled: true },
                { id: "3", title: "Mikrotik Router Bay 2", enabled: true },
            ],
        },
    },

    argTypes: {
        control: {
            description: "This should be passed from the parent BugForm",
            control: { disable: true },
            table: { type: { summary: "data" }, defaultValue: { summary: "null" } },
        },
        defaultValue: {
            description: "The selected value when the control is loaded. A single panel ID.",
            table: { type: { summary: "data" }, defaultValue: { summary: "null" } },
        },
        error: {
            description: "Usually handled by parent BugForm but can be set manually.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
        },
        mockApiData: {
            table: { disable: true },
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
