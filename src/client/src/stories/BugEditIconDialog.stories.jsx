import BugEditIconDialog from "@core/BugEditIconDialog";
import { Box, Button } from "@mui/material";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";
import { useState } from "react";

export default {
    title: "BUG Core/Dialogs/BugEditIconDialog",
    component: BugEditIconDialog,
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
import React, { useState } from "react";
import BugEditIconDialog from "@core/BugEditIconDialog";
import { Button, Box } from "@mui/material";

export default function MyComponent() {
    const [result, setResult] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const handleCancel = () => setShowDialog(false);

    const handleSubmit = (icon, color) => {
        setShowDialog(false);
        setResult(\`Selected icon: \${icon} in color: \${color}\`);
    };

    return (
        <>
            <Button variant="contained" onClick={() => setShowDialog(true)}>
                Show Dialog
            </Button>
            <Box sx={{ mt: 2 }}>Result: {result}</Box>
            {showDialog && (
                <BugEditIconDialog
                    icon="bugle"
                    color="#ff3822"
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
}`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A dialog for selecting icons. There's no hook for this one - instead you have to conditionally show it using your own logic and state.<br />
                **Please Note**: The dialog icons are provided by the application API, and are therefore not available in this storybook environment.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        icon: "bugle",
        color: "#ff3822",
    },

    argTypes: {
        icon: {
            description: "Pre-select an icon by setting this prop",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        color: {
            control: "color",
            description: "Pre-select the color of the icons",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "#ffffff" },
            },
        },
        onCancel: {
            control: { disable: true },
            description: "Handles when the cancel button is clicked or the dialog closed",
            table: { type: { summary: "function" } },
        },
        onSubmit: {
            control: { disable: true },
            description: "Handles when the dialog OK button is clicked",
            table: { type: { summary: "function" } },
        },
    },
};

export const Default = {
    render: (args) => {
        const [result, setResult] = useState(null);
        const [showDialog, setShowDialog] = useState(false);

        const handleCancel = () => setShowDialog(false);

        const handleSubmit = (icon, color) => {
            setShowDialog(false);
            setResult(`you have selected icon: ${icon} in color: ${color}`);
        };

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <Button variant="contained" onClick={() => setShowDialog(true)}>
                    Show Icon Dialog
                </Button>
                <Box sx={{ mt: 2, fontWeight: "bold" }}>
                    Result: <span style={{ color: "#1976d2" }}>{result || "No selection yet"}</span>
                </Box>
                {showDialog && <BugEditIconDialog {...args} onCancel={handleCancel} onSubmit={handleSubmit} />}
            </div>
        );
    },
};
