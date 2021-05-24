import React from "react";
import AxiosCommand from "@utils/AxiosCommand";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useAlert } from "@utils/Snackbar";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { useSelector } from "react-redux";
import _ from "lodash";

const filter = createFilterOptions();

export default function PanelGroupDialog({ panelId, panelTitle, panelGroup, onClose }) {
    const [value, setValue] = React.useState(panelGroup);
    const [inputValue, setInputValue] = React.useState("");
    const sendAlert = useAlert();
    const panelList = useSelector((state) => state.panelList);

    let panelListGroups = _.uniq(panelList.data.map((a) => a.group));
    _.pull(panelListGroups, "");

    const handleGroupConfirm = async () => {
        onClose();
        if (await AxiosCommand(`/api/panel/group/${panelId}/${value}`)) {
            sendAlert(`Updated group for panel ${panelTitle}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to delete panel: ${panelTitle}`, { variant: "error" });
        }
    };

    const handleGroupDialogClose = () => {
        onClose();
    };

    return (
        <Dialog open onClose={handleGroupDialogClose}>
            <DialogTitle id="alert-dialog-title">Change panel group</DialogTitle>
            <DialogContent>
                <Autocomplete
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue ? newValue : "");
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                        setValue(newInputValue ? newInputValue : "");
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    options={panelListGroups}
                    style={{ width: 300 }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField {...params} label="Search or enter a new group" variant="filled" />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleGroupDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleGroupConfirm} color="primary" autoFocus>
                    Change
                </Button>
            </DialogActions>
        </Dialog>
    );
}
