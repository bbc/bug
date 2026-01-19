import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React from "react";

export default function SetGroupDialog({ onDismiss, onConfirm, groups, value }) {
    // initialize state with the passed value or empty string
    const [selectedGroup, setSelectedGroup] = React.useState(value || "");

    const handleSubmit = (event) => {
        event.preventDefault();
        // ensure we don't submit if empty
        if (selectedGroup?.trim()) {
            onConfirm(event, selectedGroup.trim());
        }
    };

    return (
        <Dialog open onClose={onDismiss} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit}>
                <DialogTitle>Set Group</DialogTitle>
                <DialogContent
                    sx={{
                        pt: 2,
                        pb: 2,
                        "&.MuiDialogContent-root": {
                            paddingTop: "16px !important",
                        },
                    }}
                >
                    <Autocomplete
                        value={selectedGroup}
                        freeSolo
                        options={groups}
                        // handle selection from the dropdown
                        onChange={(event, newValue) => {
                            setSelectedGroup(newValue);
                        }}
                        // handle manual typing for new groups
                        onInputChange={(event, newInputValue) => {
                            setSelectedGroup(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} autoFocus label="Group name" variant="standard" />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDismiss} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" variant="contained" disabled={!selectedGroup?.trim()}>
                        Change
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
