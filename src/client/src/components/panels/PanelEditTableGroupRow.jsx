import React, { useState, useRef } from "react";
import { makeStyles } from "@mui/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

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
                    variant="standard"
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
