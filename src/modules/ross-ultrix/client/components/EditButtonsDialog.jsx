import BugScrollbars from "@core/BugScrollbars";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import _ from "lodash";
import React from "react";
import useAsyncEffect from "use-async-effect";
import EditButtonsItem from "./EditButtonsItem";
export default function EditButtonsDialog({ open, panelId, onDismiss, groupType, onConfirm, groupIndex, groupId }) {
    const [buttons, setButtons] = React.useState(null);
    const [selectedButtons, setSelectedButtons] = React.useState(null);

    // fetch list of all buttons
    useAsyncEffect(async () => {
        const url = groupType === "source" ? `/container/${panelId}/sources/` : `/container/${panelId}/destinations/`;
        setButtons(await AxiosGet(url));
    }, []);

    // fetch list of selected buttons
    useAsyncEffect(async () => {
        const url =
            groupType === "source"
                ? `/container/${panelId}/sources/-1/${groupIndex}`
                : `/container/${panelId}/destinations/${groupIndex}`;
        const rawSelectedButtons = await AxiosPost(url, { showExcluded: true });
        const filteredSelectedButtons = [];
        for (let eachButton of rawSelectedButtons[`${groupType}s`]) {
            filteredSelectedButtons.push({
                index: eachButton.index,
                label: eachButton.label,
                hidden: eachButton.hidden,
            });
        }
        setSelectedButtons(filteredSelectedButtons);
    }, []);

    const handleToggle = (event, buttonIndex, buttonLabel) => {
        const selected = selectedButtons.filter((button) => button.index === buttonIndex).length > 0;
        if (selected) {
            // remove from array
            setSelectedButtons(selectedButtons.filter((button) => button.index !== buttonIndex));
        } else {
            // push to end
            const localButtons = _.clone(selectedButtons);
            localButtons.push({
                index: buttonIndex,
                label: buttonLabel,
            });

            // then sort by label
            localButtons.sort((a, b) => a.label.localeCompare(b.label));

            // then save it to the state
            setSelectedButtons(localButtons);
        }
        // event.stopPropagation();
    };

    const removeButton = (buttonIndex) => {
        setSelectedButtons(selectedButtons.filter((button) => button.index !== buttonIndex));
    };

    const handleSubmit = async () => {
        const buttonIndexArray = selectedButtons.map((button) => button.index);
        const postData = {
            buttons: buttonIndexArray,
        };
        const url = `/container/${panelId}/groups/set/${groupType}/${groupId}`;
        if (await AxiosPost(url, postData)) {
            onConfirm();
        }
    };

    const handleSelectAll = (event) => {
        if (selectedButtons.length === 0) {
            // select all
            const newSelectedButtons = buttons.map((button, index) => {
                return {
                    index: index,
                    label: button,
                };
            });
            setSelectedButtons(newSelectedButtons);
        } else {
            // remove all
            setSelectedButtons([]);
        }
    };

    const availableButtonsList = () => {
        return (
            <Box
                sx={{
                    backgroundColor: "#303030",
                    borderRadius: "3px",
                    margin: "0.5rem",
                    minWidth: "18rem",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#212121",
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: "1.5rem",
                        textTransform: "uppercase",
                    }}
                >
                    <ListItem
                        role="listitem"
                        button
                        onClick={handleSelectAll}
                        sx={{
                            padding: "4px",
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                paddingLeft: "4px",
                                paddingRight: "4px",
                            }}
                        >
                            <Checkbox
                                checked={selectedButtons.length === buttons.length}
                                indeterminate={selectedButtons.length !== buttons.length && selectedButtons.length > 0}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        <div className="MuiTableHead-root">Available Buttons</div>
                    </ListItem>
                </Box>
                <BugScrollbars>
                    <Box
                        sx={{
                            minHeight: "18rem",
                            maxHeight: "50vh",
                        }}
                    >
                        <List
                            sx={{
                                backgroundColor: "#303030",
                            }}
                            dense
                            component="div"
                            role="list"
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            {buttons.map((button, index) => {
                                return (
                                    <ListItem
                                        sx={{
                                            borderBottom: "1px solid #282828",
                                            height: "51px",
                                            paddingLeft: "8px",
                                            paddingRight: "8px",
                                        }}
                                        key={index}
                                        role="listitem"
                                        button
                                        onClick={(event) => handleToggle(event, index, button)}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                checked={
                                                    selectedButtons.filter((button) => button.index === index).length >
                                                    0
                                                }
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                        </ListItemIcon>
                                        <Box
                                            sx={{
                                                fontSize: "17px",
                                                marginTop: "1px",
                                                paddingRight: "8px",
                                                fontWeight: 900,
                                                opacity: 0.3,
                                            }}
                                        >
                                            {index + 1}
                                        </Box>
                                        <ListItemText primary={button} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </BugScrollbars>
            </Box>
        );
    };

    const selectedButtonsList = () => {
        return (
            <Box
                sx={{
                    minHeight: "18rem",
                    maxHeight: "50vh",
                    backgroundColor: "#303030",
                    borderRadius: "3px",
                    margin: "0.5rem",
                    minWidth: "18rem",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#212121",
                        padding: "13px",
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 500,
                        lineHeight: "1.5rem",
                        textTransform: "uppercase",
                    }}
                >
                    Selected Buttons
                </Box>
                <BugScrollbars>
                    <Box>
                        <List
                            sx={{
                                backgroundColor: "#303030",
                            }}
                            dense
                            component="div"
                            role="list"
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            {selectedButtons.map((button) => (
                                <EditButtonsItem button={button} onRemove={removeButton} key={button.index} />
                            ))}
                        </List>
                    </Box>
                </BugScrollbars>
            </Box>
        );
    };

    const content = () => {
        if (!selectedButtons || !buttons) {
            return (
                <Box
                    sx={{
                        minHeight: "50vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "608px",
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }
        return (
            <Box
                sx={{
                    display: "grid",
                    gridAutoFlow: "column",
                }}
            >
                {availableButtonsList()}
                {selectedButtonsList()}
            </Box>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onDismiss}
            maxWidth={false}
            sx={{
                "& .MuiDialog-paperScrollPaper": {
                    maxWidth: "none",
                },
                "& .MuiDialogContent-root": {
                    padding: "0px 1rem",
                },
            }}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Edit group {groupType}s</DialogTitle>
                <DialogContent>{content()}</DialogContent>
                <DialogActions>
                    <Button onClick={onDismiss} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit} color="primary" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
