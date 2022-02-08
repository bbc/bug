import React from "react";
import BugEditIconDialog from "@core/BugEditIconDialog";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default {
    title: "BUG Core/Dialogs/BugEditIconDialog",
    component: BugEditIconDialog,
    parameters: {
        docs: {
            description: {
                component: `A dialog for selecting icons. There's no hook for this one - instead you have to conditionally show it using your own logic and state.<br />
**Please Note**: The dialog icons are provided by the application API, and are therefore not available in this storybook.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        icon: {
            type: { name: "string", required: false },
            defaultValue: "bugle",
            description: "Pre-select an icon by setting this prop",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        color: {
            control: "color",
            description: "Pre-select the color of the icons",
            defaultValue: "#ff3822",
            table: {
                type: { summary: "color" },
                defaultValue: { summary: "#ffffff" },
            },
        },
        onCancel: {
            control: {
                disable: true,
            },
            description: "Handles when the cancel button is clicked or the dialog closed",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
            },
        },
        onSubmit: {
            control: {
                disable: true,
            },
            description: "Handles when the dialog OK button is clicked",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugEditIconDialog = (args) => {
    const [result, setResult] = React.useState(null);
    const [showDialog, setShowDialog] = React.useState(false);

    const handleCancel = () => {
        setShowDialog(false);
    };

    const handleSubmit = (icon, color) => {
        setShowDialog(false);
        setResult(`you have selected icon: ${icon} in color: ${color}`);
    };

    return (
        <>
            <Button variant="contained" onClick={() => setShowDialog(true)}>
                Show Dialog
            </Button>
            <Box sx={{ margin: "1rem" }}>Result: {result}</Box>
            {showDialog && (
                <BugEditIconDialog
                    icon={args.icon}
                    color={args.color}
                    onCancel={handleCancel}
                    onSubmit={(icon, color) => handleSubmit(icon, color)}
                />
            )}
        </>
    );
};

MyBugEditIconDialog.displayName = "BugEditIconDialog";
MyBugEditIconDialog.storyName = "BugEditIconDialog";
MyBugEditIconDialog.parameters = {
    docs: {
        source: {
            code: `
import React from "react";
import BugEditIconDialog from "@core/BugEditIconDialog";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";            

export const MyBugEditIconDialog = (args) => {
    const [result, setResult] = React.useState(null);
    const [showDialog, setShowDialog] = React.useState(false);

    const handleCancel = () => {
        setShowDialog(false);
    };

    const handleSubmit = (icon, color) => {
        setShowDialog(false);
        setResult(\`you have selected icon: \${icon} in color: \${color}\`);
    };

    return (
        <>
            <Button variant="contained" onClick={() => setShowDialog(true)}>
                Show Dialog
            </Button>
            <Box sx={{ margin: "1rem" }}>Result: {result}</Box>
            {showDialog && (
                <BugEditIconDialog
                    icon="bugle"
                    color="#ff3822"
                    onCancel={handleCancel}
                    onSubmit={(icon, color) => handleSubmit(icon, color)}
                />
            )}
        </>
    );
};
`,
        },
    },
};
