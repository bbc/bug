import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditButtonsDragItem from "./EditButtonsDragItem";
import _ from "lodash";
import { useAlert } from "@utils/Snackbar";
import AxiosPost from "@utils/AxiosPost";

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

const useStyles = makeStyles((theme) => ({
    dialog: {
        "& .MuiDialog-paperScrollPaper": {
            maxWidth: "none",
        },
    },
    list: {
        minWidth: "18rem",
        backgroundColor: "#303030",
    },
    listWrapper: {
        backgroundColor: "#303030",
        borderRadius: 5,
        margin: "0.5rem",
    },
    listScrollContainer: {
        minHeight: "18rem",
        maxHeight: "50vh",
        overflow: "auto",
    },
    listItem: {
        borderBottom: "1px solid #282828",
        height: 51,
    },
    root: {
        display: "grid",
        gridAutoFlow: "column",
    },
    listHeader: {
        backgroundColor: "#212121",
        fontWeight: 500,
        lineHeight: "1.5rem",
        textTransform: "uppercase",
    },
    availableHeader: {
        padding: 4,
        fontWeight: 500,
    },
    availableCheckbox: {
        paddingLeft: 4,
        paddingRight: 4,
    },
    listHeaderPadded: {
        backgroundColor: "#212121",
        padding: 13,
        fontWeight: 500,
        lineHeight: "1.5rem",
        textTransform: "uppercase",
    },
    loading: {
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 608,
    },
    indexText: {
        paddingRight: 8,
        fontWeight: 900,
        opacity: 0.3,
    },
}));

export default function EditButtonsDialog({ panelId, onCancel, groupType, onSubmit, groups, groupIndex }) {
    const [buttons, setButtons] = React.useState(null);
    const [selectedButtons, setSelectedButtons] = React.useState(null);
    const classes = useStyles();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );
    const sendAlert = useAlert();

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
        const rawSelectedButtons = await AxiosGet(url);
        const filteredSelectedButtons = [];
        for (let eachButton of rawSelectedButtons[`${groupType}s`]) {
            filteredSelectedButtons.push({
                index: eachButton.index,
                label: eachButton.label,
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
            buttons: buttonIndexArray.join(","),
        };
        const url = `/container/${panelId}/groups/set/${groupType}/${groupIndex}`;

        if (await AxiosPost(url, postData)) {
            onSubmit();
        } else {
            sendAlert(`Failed to save group`, { variant: "error" });
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
            <div className={classes.listWrapper}>
                <div className={classes.listHeader}>
                    <ListItem role="listitem" button onClick={handleSelectAll} className={classes.availableHeader}>
                        <ListItemIcon className={classes.availableCheckbox}>
                            <Checkbox
                                checked={selectedButtons.length === buttons.length}
                                indeterminate={selectedButtons.length !== buttons.length && selectedButtons.length > 0}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        Available Buttons
                    </ListItem>
                </div>
                <div className={classes.listScrollContainer}>
                    <List
                        className={classes.list}
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
                                    className={classes.listItem}
                                    key={button}
                                    role="listitem"
                                    button
                                    onClick={(event) => handleToggle(event, index, button)}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={
                                                selectedButtons.filter((button) => button.index === index).length > 0
                                            }
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <div className={classes.indexText}>{index + 1}</div>
                                    <ListItemText primary={button} />
                                </ListItem>
                            );
                        })}
                    </List>
                </div>
            </div>
        );
    };

    const selectedButtonsList = () => {
        return (
            <div className={classes.listWrapper}>
                <div className={classes.listHeaderPadded}>Selected Buttons</div>
                <div className={classes.listScrollContainer}>
                    <List
                        className={classes.list}
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
                                    <EditButtonsDragItem button={button} onRemove={removeButton} key={button.index} />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </List>
                </div>
            </div>
        );
    };

    const content = () => {
        if (!selectedButtons || !buttons) {
            return (
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
            );
        }
        return (
            <div className={classes.root}>
                {availableButtonsList()}
                {selectedButtonsList()}
            </div>
        );
    };

    return (
        <Dialog
            open
            // onClose={onCancel}
            disableBackdropClick={true}
            className={classes.dialog}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Edit group {groupType}s</DialogTitle>
                <DialogContent>{content()}</DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
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
