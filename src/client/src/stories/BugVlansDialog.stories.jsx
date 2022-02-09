import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import BugVlansDialog from "@core/BugVlansDialog";
import { useBugCustomDialog } from "@core/BugCustomDialog";

export default {
    title: "BUG Core/Dialogs/BugVlansDialog",
    component: "div",
    parameters: {
        docs: {
            description: {
                component: `A custom dialog for displaying untagged and tagged members of network interfaces.<br />
                Uses BugCustomDialog hook to display the dialog.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        untaggedVlan: {
            type: { name: "number" },
            description: "The VLAN ID untagged on this interface",
            defaultValue: 101,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        taggedVlans: {
            type: { name: "data", required: true },
            defaultValue: [],
            description: "An array of VLAN IDs tagged on this interface",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        vlans: {
            type: { name: "data", required: true },
            defaultValue: [
                { id: 101, label: "VLAN 101" },
                { id: 102, label: "VLAN 102" },
                { id: 103, label: "VLAN 103" },
                { id: 104, label: "VLAN 104" },
            ],
            description: "An array of available VLANs. Each VLAN is an object with a label and id property.",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
    },
};

export const MyBugVlansDialog = (args) => {
    const { customDialog } = useBugCustomDialog();
    const [result, setResult] = React.useState(null);

    const showDialog = async () => {
        setResult(
            await customDialog({
                dialog: (
                    <BugVlansDialog
                        vlans={args.vlans}
                        taggedVlans={args.taggedVlans}
                        untaggedVlan={args.untaggedVlan}
                    />
                ),
            })
        );
    };

    return (
        <>
            <Button variant="contained" onClick={showDialog}>
                Show Dialog
            </Button>
            <Box sx={{ margin: "1rem" }}>
                Result: untagged={result?.untaggedVlan}, tagged={JSON.stringify(result?.taggedVlans)}
            </Box>
        </>
    );
};

MyBugVlansDialog.displayName = "BugVlansDialog";
MyBugVlansDialog.storyName = "BugVlansDialog";
