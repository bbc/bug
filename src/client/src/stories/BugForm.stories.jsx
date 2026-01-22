import BugForm from "@core/BugForm";
import CodeIcon from "@mui/icons-material/Code";
import { Button, IconButton } from "@mui/material";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Wrappers/BugForm",
    component: BugForm,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Source
                        language="jsx"
                        dark
                        code={`
import BugForm from "@core/BugForm";
import { IconButton, Button } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";

export default function MyForm() {
    return (
        <BugForm
            iconButtons={[
                <IconButton key="code" sx={{ padding: "14px" }}>
                    <CodeIcon />
                </IconButton>,
            ]}
        >
            <BugForm.Header>Form Header</BugForm.Header>
            <BugForm.Body>This is the body of the form.</BugForm.Body>
            <BugForm.Actions>
                <Button variant="contained" color="secondary">Cancel</Button>
                <Button variant="contained" color="primary">Save Changes</Button>
            </BugForm.Actions>
        </BugForm>
    );
}`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A handy wrapper with header, content and actions areas.<br />
                Ideal for presenting individual form items when navigating from a form (e.g., interfaces on a switch).<br />
                This component also exports <b>BugForm.Header</b>, <b>BugForm.Body</b>, and <b>BugForm.Actions</b>.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        children: {
            control: { disable: true },
            description: "The form controls to display",
            table: { type: { summary: "ReactNode" } },
        },
        onClose: {
            control: { disable: true },
            description: "Handles the event when the close button is clicked",
            table: { type: { summary: "function" } },
        },
        iconButtons: {
            description: "An array of icon buttons to display in the header",
            table: { disable: true },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "400px" }}>
            <BugForm
                {...args}
                iconButtons={[
                    <IconButton key="code" sx={{ padding: "14px" }}>
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
        </div>
    ),
};
