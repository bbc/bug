import BugConfirmDialog, { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { Box, Button } from "@mui/material";
import React from "react";
export default {
    title: "BUG Core/Dialogs/BugConfirmDialog",
    component: BugConfirmDialog,
    parameters: {
        docs: {
            description: {
                component: `A hook for displaying a modal confirmation dialog<br />
                The message, title and button text are customizable`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        title: {
            type: { name: "string", required: false },
            defaultValue: "Confirm your action",
            description: "Text to show in the title bar of the dialog",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Confirm" },
            },
        },
        message: {
            type: { name: "string", required: false },
            defaultValue: "Are you sure you want to do this thing?",
            description:
                "Text to show in the main body of the dialog. Can be a string, or an array of strings to show multiple lines",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        confirmButtonText: {
            type: { name: "string", required: false },
            defaultValue: "Confirm",
            description: "Text to show in the confirmation button",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Confirm" },
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

export const MyBugConfirmDialog = (args) => {
    const { confirmDialog } = useBugConfirmDialog();
    const [result, setResult] = React.useState(null);

    const showDialog = async () => {
        const confirmResult = await confirmDialog({
            title: args.title,
            message: args.message,
            confirmButtonText: args.confirmButtonText,
        });

        if (confirmResult !== false) {
            setResult(`you clicked '${args.confirmButtonText}'`);
        } else {
            setResult("you clicked 'Cancel'");
        }
    };

    return (
        <>
            <Button variant="contained" onClick={showDialog}>
                Show Dialog
            </Button>
            <Box sx={{ margin: "1rem" }}>Result: {result}</Box>
        </>
    );
};

MyBugConfirmDialog.displayName = "BugConfirmDialog";
MyBugConfirmDialog.storyName = "BugConfirmDialog";
MyBugConfirmDialog.parameters = {
    docs: {
        source: {
            code: `
import React from "react";
import {Button} from "@mui/material";;
import {Box} from "@mui/material";;
import BugConfirmDialog from "@core/BugConfirmDialog";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";

export default () => {

    const { confirmDialog } = useBugConfirmDialog();
    const [result, setResult] = React.useState(null);

    const showDialog = async () => {
        const confirmResult = await confirmDialog({
            open: true,
            title: "Confirm your action",
            message: "Are you sure you want to do this thing?",
            confirmButtonText: "Confirm",
        });

        if (confirmResult !== false) {
            setResult("you clicked 'Confirm');
        } else {
            setResult("you clicked 'Cancel'");
        }
    };

    return (
        <>
            <Button variant="contained" onClick={showDialog}>
                Show Dialog
            </Button>
            <Box sx={{ margin: "1rem" }}>Result: {result}</Box>
        </>
    );
}`,
        },
    },
};
