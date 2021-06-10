import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

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
                    <FormControl variant="filled">
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
