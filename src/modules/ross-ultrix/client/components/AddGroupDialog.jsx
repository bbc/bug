import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    TextField,
} from "@mui/material";
import React from "react";
export default function AddGroupDialog({ onDismiss, onConfirm, groups }) {
    const [selectedGroups, setSelectedGroups] = React.useState([]);

    const modifiedGroups = groups.map((group) => {
        return {
            id: group.id,
            label: group.label,
        };
    });

    return (
        <Dialog open onClose={onDismiss}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Add to Groups</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <Autocomplete
                            sx={{ width: "20rem" }}
                            multiple
                            filterSelectedOptions
                            options={modifiedGroups}
                            fullWidth
                            freeSolo={false}
                            onChange={(event, values) => {
                                setSelectedGroups(values);
                            }}
                            value={selectedGroups}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth variant="standard" label="Select groups ..." />
                            )}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDismiss} color="primary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={(event) =>
                            onConfirm(
                                event,
                                selectedGroups.map((group) => group.id)
                            )
                        }
                        color="primary"
                        autoFocus
                        disabled={selectedGroups.length === 0}
                    >
                        Add
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
