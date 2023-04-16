import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import CircularProgress from "@mui/material/CircularProgress";
import EditButtonsDragItem from "./EditButtonsDragItem";
import _ from "lodash";
import AxiosPost from "@utils/AxiosPost";
import Box from "@mui/material/Box";
import BugScrollbars from "@core/BugScrollbars";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function EditButtonsDialog({ open, panelId, onDismiss, groupType, onConfirm, groupIndex }) {
    const [buttons, setButtons] = React.useState(null);
    const [selectedButtons, setSelectedButtons] = React.useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

    // fetch list of all buttons
    useAsyncEffect(async () => {
        const url =
            groupType === "transmitter" ? `/container/${panelId}/transmitters/` : `/container/${panelId}/receivers/`;
        setButtons(await AxiosGet(url));
    }, []);

    // fetch list of selected buttons
    useAsyncEffect(async () => {
        const url =
            groupType === "transmitter"
                ? `/container/${panelId}/transmitters/-1/${groupIndex}`
                : `/container/${panelId}/receivers/${groupIndex}`;
        const rawSelectedButtons = await AxiosPost(url);
        const filteredSelectedButtons = [];
        for (let eachButton of rawSelectedButtons[`${groupType}s`]) {
            filteredSelectedButtons.push({
                index: eachButton.index,
                id: eachButton.id,
                label: eachButton.label,
                hidden: eachButton.hidden,
            });
        }
        setSelectedButtons(filteredSelectedButtons);
    }, []);

    const handleDragEnd = async ({ active, over }) => {
        if (active.id !== over.id) {
            const overId = over.id.split(":")[1];
            const activeId = active.id.split(":")[1];

            const oldIndex = selectedButtons.findIndex((button) => button.index === parseInt(activeId));
            const newIndex = selectedButtons.findIndex((button) => button.index === parseInt(overId));

            const newButtons = arrayMove(selectedButtons, oldIndex, newIndex);

            setSelectedButtons(newButtons);
        }
    };

    const handleToggle = (event, buttonId, buttonLabel) => {
        const selected = selectedButtons.filter((button) => button.id === buttonId).length > 0;
        if (selected) {
            // remove from array
            setSelectedButtons(selectedButtons.filter((button) => button.id !== buttonId));
        } else {
            // push to end
            const localButtons = _.clone(selectedButtons);
            localButtons.push({
                id: buttonId,
                label: buttonLabel,
            });
            setSelectedButtons(localButtons);
        }
        // event.stopPropagation();
    };

    const removeButton = (buttonId) => {
        setSelectedButtons(selectedButtons.filter((button) => button.id !== buttonId));
    };

    const handleSubmit = async () => {
        const buttonIndexArray = selectedButtons.map((button) => button.id);
        const postData = {
            buttons: buttonIndexArray,
        };
        const url = `/container/${panelId}/groups/set/${groupType}/${groupIndex}`;
        if (await AxiosPost(url, postData)) {
            onConfirm();
        }
    };

    const handleSelectAll = (event) => {
        if (selectedButtons.length === 0) {
            // select all
            const newSelectedButtons = buttons;
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
                    minWidth: "22rem",
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
                            // fontWeight: 500,
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
                            minHeight: "22rem",
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
                                        key={button.id}
                                        role="listitem"
                                        button
                                        onClick={(event) => handleToggle(event, button.id, button)}
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
                                            {button.index}
                                        </Box>
                                        <ListItemText primary={`${button.device} - ${button.name}`} />
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
                    minHeight: "22rem",
                    maxHeight: "50vh",
                    backgroundColor: "#303030",
                    borderRadius: "3px",
                    margin: "0.5rem",
                    minWidth: "22rem",
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
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext
                                    items={selectedButtons.map((button) => `button:${button.index}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {selectedButtons.map((button) => (
                                        <EditButtonsDragItem button={button} onRemove={removeButton} key={button.id} />
                                    ))}
                                </SortableContext>
                            </DndContext>
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
