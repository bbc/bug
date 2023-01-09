import BugForm from "@core/BugForm";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CodeIcon from "@mui/icons-material/Code";

export default {
    title: "BUG Core/Wrappers/BugForm",
    component: "div",
    parameters: {
        docs: {
            description: {
                component: `A handy wrapper with header, content and actions areas.<br />
                Ideal for presenting individual form items when navigating from a form (eg interfaces on a switch).<br />
                This component also exports <BugForm.Header>, <BugForm.Body> and <BugForm.Actions>`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        children: {
            control: {
                disable: true,
            },
            type: { name: "data", required: true },
            description: "The form controls to display",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        iconButtons: {
            type: { name: "data", required: false },
            description: "An array of icon buttons to display",
            table: {
                enabled: false,
            },
        },
        onClose: {
            control: {
                disable: true,
            },
            description: "Handles the event when the close button is clicked",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugForm = (args) => (
    <BugForm
        {...args}
        iconButtons={[
            <IconButton
                key="code"
                sx={{
                    padding: "14px",
                }}
            >
                <CodeIcon />
            </IconButton>,
        ]}
    >
        <BugForm.Header>Form Header</BugForm.Header>
        <BugForm.Body>This is the body of the form.</BugForm.Body>
        <BugForm.Actions>
            <Button variant="contained" color="secondary" disableElevation>
                Cancel
            </Button>
            <Button variant="contained" color="primary">
                Save Changes
            </Button>
        </BugForm.Actions>
    </BugForm>
);

MyBugForm.displayName = "BugForm";
MyBugForm.storyName = "BugForm";
MyBugForm.parameters = {
    docs: {
        source: {
            code: `
import BugForm from "@core/BugForm";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CodeIcon from "@mui/icons-material/Code";

<BugForm
    iconButtons={[
        <IconButton
            sx={{
                padding: "14px",
            }}
        >
            <CodeIcon />
        </IconButton>,
    ]}
>
<BugForm.Header>Form Header</BugForm.Header>
<BugForm.Body>This is the body of the form.</BugForm.Body>
<BugForm.Actions>
    <Button variant="contained" color="secondary" disableElevation>
        Cancel
    </Button>
    <Button variant="contained" color="primary">
        Save Changes
    </Button>
</BugForm.Actions>
</BugForm>

`,
        },
    },
};
