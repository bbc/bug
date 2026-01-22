import { useState } from "react";
// 1. Ensure the import name is unique
import { useBugCustomDialog } from "@core/BugCustomDialog";
import BugVlansDialogComponent from "@core/BugVlansDialog";
import { Box, Button, Typography } from "@mui/material";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Dialogs/BugVlansDialog",
    // 2. Use the imported component here
    component: BugVlansDialogComponent,
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
        },
    },
    args: {
        untaggedVlan: 101,
        taggedVlans: [102, 103],
        vlans: [
            { id: 101, label: "VLAN 101" },
            { id: 102, label: "VLAN 102" },
            { id: 103, label: "VLAN 103" },
        ],
    },
};

export const Default = {
    render: (args) => {
        const { customDialog } = useBugCustomDialog();
        const [result, setResult] = useState(null);

        const handleOpen = async () => {
            // 3. Use the uniquely named import here to avoid initialization conflicts
            const data = await customDialog({
                title: "VLAN Configuration",
                dialog: (
                    <BugVlansDialogComponent
                        vlans={args.vlans}
                        taggedVlans={args.taggedVlans}
                        untaggedVlan={args.untaggedVlan}
                    />
                ),
            });
            if (data) setResult(data);
        };

        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Button variant="contained" onClick={handleOpen}>
                    Open VLAN Settings
                </Button>

                {result && (
                    <Box sx={{ mt: 2, p: 2, border: "1px dashed #666" }}>
                        <Typography variant="caption">Return Data:</Typography>
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                    </Box>
                )}
            </Box>
        );
    },
};
