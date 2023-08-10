import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function AddGroupDialog({ onDismiss, onConfirm, groups }) {
    const [selectedGroups, setSelectedGroups] = React.useState([]);

    const modifiedGroups = groups.map((group) => {
        return {
            id: group.index,
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
