import BugConfigFormPanelSelect from "@core/BugConfigFormPanelSelect";
import { useForm } from "react-hook-form";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";

export default {
    title: "BUG Core/Forms/BugConfigFormPanelSelect",
    component: BugConfigFormPanelSelect,
    parameters: {
        docs: {
            description: {
                component: `This is a form control, designed to work within a BugForm.<br/>
                BugForm uses react-hook-form to manage the form state. See https://react-hook-form.com/ for more info.<br />
                A dropdown control for selecting panels. Often used to select remote panel data sources.<br/>
                Optionally takes a 'capability' field which filters panels by the capability they provide.`,
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
        label: {
            type: { name: "string", required: true },
            defaultValue: "Select Panels",
            description: "Short description to be shown in the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        helperText: {
            type: { name: "string", required: false },
            defaultValue: "Select a panel source for DHCP data",
            description: "Optional helper text to be shown below the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        capability: {
            type: { name: "string", required: false },
            defaultValue: "dhcp-server",
            description: "This value is used to search available panels by capability",
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
            defaultValue: [1, 2],
            description: "The selected value when the control is loaded. An array of panel IDs.",
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
        mockApiData: {
            table: { disable: true },
        },
    },
};

export const MyBugConfigFormPanelSelect = (args) => {
    const { control } = useForm();

    return (
        <BugForm>
            <BugForm.Header>My Form</BugForm.Header>
            <BugForm.Body>
                <Grid container>
                    <Grid item xs={12}>
                        <BugConfigFormPanelSelect
                            name={args.name}
                            control={control}
                            defaultValue={args.defaultValue}
                            label={args.label}
                            error={args.error}
                            fullWidth
                            options={args.options}
                            defaultValue={args.defaultValue}
                            helperText={args.helperText}
                            fullWidth={args.fullWidth}
                            mockApiData={args.mockApiData}
                        />
                    </Grid>
                </Grid>
            </BugForm.Body>
        </BugForm>
    );
};

MyBugConfigFormPanelSelect.displayName = "BugConfigFormPanelSelect";
MyBugConfigFormPanelSelect.storyName = "BugConfigFormPanelSelect";
MyBugConfigFormPanelSelect.args = {
    mockApiData: {
        status: "success",
        data: [
            {
                id: 1,
                title: "Cisco Router Bay 1",
                enabled: true,
            },
            {
                id: 2,
                title: "Mikrotik Router Bay 1",
                enabled: true,
            },
            {
                id: 3,
                title: "Mikrotik Router Bay 2",
                enabled: true,
            },
        ],
    },
};
MyBugConfigFormPanelSelect.parameters = {
    docs: {
        source: {
            code: `
<BugForm>
    <BugForm.Header>My Form</BugForm.Header>
    <BugForm.Body>
        <Grid container>
            <Grid item xs={12}>
                <BugConfigFormPanelSelect
                    name="control-name"
                    label="Select Panels"
                    helperText="Select a panel source for DHCP data"
                    capability="dhcp-server"
                    control={control}
                    error={false}
                    rules={{ required: true }}
                    defaultValue={[1, 2]}
                    fullWidth={true}
                />
            </Grid>
        </Grid>
    </BugForm.Body>
</BugForm>`,
        },
    },
};
