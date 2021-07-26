import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    groupHeader: {
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        fontSize: "0.875rem",
        fontWeight: 500,
        textTransform: "uppercase",
        color: theme.palette.primary.main,
    },
    groupHeaderRow: {
        height: 48,
    },
}));

export default function PanelTableGroupRow({ title, handleNewGroupName }) {
    const classes = useStyles();
    const inputRef = React.useRef();
    const [groupActive, setGroupActive] = useState(false);
    const [groupName, setGroupName] = useState(title);

    const handleGroupNameChanged = (event) => {
        setGroupName(event.target.value);
    };

    const handleGroupNameCancel = (event) => {
        setGroupName(title);
        setGroupActive(false);
    };

    const handleGroupNameEdit = (event) => {
        setGroupActive(!groupActive);
        inputRef.current.focus();
    };

    const handleGroupNameSave = () => {
        handleNewGroupName(groupName);
        setGroupActive(false);
    };

    const renderGroup = () => {
        if (groupActive) {
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
                        InputProps={{
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
        }
        return (
            <>
                <TextField
                    inputRef={inputRef}
                    disabled
                    fullWidth
                    style={{ width: "26rem" }}
                    value={groupName}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    placeholder={title}
                    type="text"
                    autoFocus
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="Edit Group Name" onClick={handleGroupNameEdit}>
                                    <EditIcon />
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
            <TableCell className={classes.groupHeader} colSpan={8}>
                {renderGroup()}
            </TableCell>
        </TableRow>
    );
}
