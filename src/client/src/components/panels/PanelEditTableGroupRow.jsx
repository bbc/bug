import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    groupHeaderInputBase: {
        fontSize: "0.875rem",
        fontWeight: 500,
        color: theme.palette.primary.main,
        "& .MuiInputBase-input": {
            textTransform: "uppercase",
            padding: 12,
        },
    },
    groupHeaderRow: {
        height: 48,
    },
}));

export default function PanelTableGroupRow({ title, handleNewGroupName }) {
    const classes = useStyles();
    const inputRef = useRef();
    const [groupName, setGroupName] = useState(title);

    const handleGroupNameChanged = (event) => {
        setGroupName(event.target.value);
    };

    const handleGroupNameCancel = (event) => {
        setGroupName(title);
    };

    const handleGroupNameSave = () => {
        handleNewGroupName(groupName);
    };

    const renderGroup = () => {
        return (
            <>
                <TextField
                    inputRef={inputRef}
                    fullWidth
                    style={{ width: "26rem" }}
                    value={groupName}
                    onChange={handleGroupNameChanged}
                    placeholder={title}
                    type="text"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    autoFocus
                    variant="filled"
                    InputProps={{
                        className: classes.groupHeaderInputBase,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="Save Group Name" onClick={handleGroupNameSave}>
                                    <CheckIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="Cancel and don't save group name"
                                    onClick={handleGroupNameCancel}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                ></TextField>
            </>
        );
    };

    return (
        <TableRow className={classes.groupHeaderRow}>
            <TableCell colSpan={8}>{renderGroup()}</TableCell>
        </TableRow>
    );
}
