import React from "react";
import BugRenameDialog from "@core/BugRenameDialog";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useBugRenameDialog } from "@core/BugRenameDialog";

export default {
    title: "BUG Core/Dialogs/BugRenameDialog",
    component: BugRenameDialog,
    parameters: {
        docs: {
            description: {
                component: `A hook for displaying a rename dialog for simple text fields.<br />
                The message, title and button text are customizable.<br />
                If the text value is unchanged, then FALSE is returned (the same as cancelling the dialog).`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        allowBlank: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description: "Whether to allow blank values",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        confirmButtonText: {
            type: { name: "string", required: false },
            defaultValue: "Rename",
            description: "Text to show in the confirmation button",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Rename" },
            },
        },
        defaultValue: {
            type: { name: "string", required: true },
            defaultValue: "Previous Value",
            description: "The existing value to load into the textfield control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        label: {
            type: { name: "string", required: false },
            defaultValue: "Rename me",
            description: "The label to use in the textfield control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        onDismiss: {
            control: {
                disable: true,
            },
            description: "Handles when the cancel button is clicked or the dialog closed",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
            },
        },
        onRename: {
            control: {
                disable: true,
            },
            description: "Handles when the dialog confirmation button is clicked",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
            },
        },
        placeholder: {
            type: { name: "string", required: false },
            defaultValue: "Enter a new name",
            description:
                "Text to show in the textfield control when empty. Can be used to show default value to be used when blank.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        textFieldProps: {
            type: { name: "data", required: false },
            defaultValue: {},
            description: "Any other props to pass to the textfield control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "{}" },
            },
        },
        title: {
            type: { name: "string", required: false },
            defaultValue: "Rename",
            description: "Text to show in the title bar of the dialog",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Rename" },
            },
        },
    },
};

export const MyBugRenameDialog = (args) => {
    const { renameDialog } = useBugRenameDialog();
    const [result, setResult] = React.useState(null);

    const showDialog = async () => {
        const renameResult = await renameDialog({
            allowBlank: args.allowBlank,
            confirmButtonText: args.confirmButtonText,
            defaultValue: args.defaultValue,
            label: args.label,
            placeholder: args.placeholder,
            title: args.title,
        });

        if (renameResult === false) {
            setResult("you clicked 'Cancel'");
        } else {
            setResult(`you renamed to "${renameResult}"`);
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

MyBugRenameDialog.displayName = "BugRenameDialog";
MyBugRenameDialog.storyName = "BugRenameDialog";
MyBugRenameDialog.parameters = {
    docs: {
        source: {
            code: `
import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import BugRenameDialog from "@core/BugRenameDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";

export default () => {

    const { confirmDialog } = useBugRenameDialog();
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
