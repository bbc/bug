import React, { useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

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
    controls: {
        padding: "1rem",
        height: "100%",
    },
    dragIcon: {
        opacity: 0.6,
        color: theme.palette.primary.main,
    },
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function EditButtonsDialog({ panelId, onCancel, groupType, onSubmit, groups, groupIndex }) {
    const [buttons, setButtons] = React.useState(null);
    const [selectedButtons, setSelectedButtons] = React.useState(null);

    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([0, 1, 2, 3]);
    const [right, setRight] = React.useState([4, 5, 6, 7]);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    const classes = useStyles();

    // fetch list of all buttons
    useAsyncEffect(async () => {
        const url = groupType === "source" ? `/container/${panelId}/sources/` : `/container/${panelId}/destinations/`;
        setButtons(await AxiosGet(url));
    }, []);

    // fetch list of selected buttons
    useAsyncEffect(async () => {
        const url =
            groupType === "source"
                ? `/container/${panelId}/sources/${groupIndex}`
                : `/container/${panelId}/destinations/${groupIndex}`;
        setSelectedButtons(await AxiosGet(url));
    }, []);

    // copy the labels of the selected buttons into a handy array
    const selectedLabels = [];
    if (selectedButtons) {
        for (let eachButton of selectedButtons[`${groupType}s`]) {
            selectedLabels.push(eachButton.label);
        }
    }

    // const handleToggle = (value) => () => {
    //     console.log(value);
    //     const currentIndex = checked.indexOf(value);
    //     const newChecked = [...checked];

    //     if (currentIndex === -1) {
    //         newChecked.push(value);
    //     } else {
    //         newChecked.splice(currentIndex, 1);
    //     }

    //     setChecked(newChecked);
    // };

    // const handleAllRight = (event) => {
    //     setRight(right.concat(left));
    //     setLeft([]);
    //     event.stopPropagation();
    // };

    // const handleCheckedRight = (event) => {
    //     setRight(right.concat(leftChecked));
    //     setLeft(not(left, leftChecked));
    //     setChecked(not(checked, leftChecked));
    //     event.stopPropagation();
    // };

    // const handleCheckedLeft = (event) => {
    //     setLeft(left.concat(rightChecked));
    //     setRight(not(right, rightChecked));
    //     setChecked(not(checked, rightChecked));
    //     event.stopPropagation();
    // };

    // const handleAllLeft = (event) => {
    //     setLeft(left.concat(right));
    //     setRight([]);
    //     event.stopPropagation();
    // };

    const availableButtonsList = () => {
        console.log("buttons", buttons);
        if (!buttons) {
            return null;
        }
        return (
            <div className={classes.listWrapper}>
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
                                // onClick={handleToggle(value)}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={selectedLabels.indexOf(button) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        onClick={(event) => {
                                            // event.stopPropagation();
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={`${index + 1} : ${button}`} />
                            </ListItem>
                        );
                    })}
                    <ListItem />
                </List>
            </div>
        );
    };

    const selectedButtonsList = () => {
        if (!selectedButtons) {
            return null;
        }
        return (
            <div className={classes.listWrapper}>
                <List
                    className={classes.list}
                    dense
                    component="div"
                    role="list"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    {selectedLabels.map((label) => (
                        <ListItem
                            className={classes.listItem}
                            key={label}
                            role="listitem"
                            button
                            // onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <DragIndicatorIcon className={classes.dragIcon} fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItem>
                    ))}
                    <ListItem />
                </List>
            </div>
        );
    };

    const content = () => {
        return (
            <div className={classes.root}>
                {availableButtonsList()}
                <div className={classes.controls}>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            // onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            // onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            // onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            // onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </div>
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
                    <Button
                        type="submit"
                        onClick={() => onSubmit(right)}
                        color="primary"
                        autoFocus
                        disabled={right.length > 0}
                    >
                        Add
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
