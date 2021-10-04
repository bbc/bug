import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

export default function AddGroupDialog({ onCancel, onSubmit, groups }) {
    const [selectedGroup, setSelectedGroup] = React.useState("");

    return (
        <Dialog open onClose={onCancel}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Add to Group</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <Select
                            style={{ width: "20rem" }}
                            value={selectedGroup}
                            onChange={(event) => setSelectedGroup(event.target.value)}
                            label="Select group ..."
                        >
                            {groups.map((group) => (
                                <MenuItem key={group.index} value={group.label}>
                                    {group.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => onSubmit(selectedGroup)}
                        color="primary"
                        autoFocus
                        disabled={selectedGroup === ""}
                    >
                        Add
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
