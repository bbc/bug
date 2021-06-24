import React, { useMemo } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import AxiosPost from "@utils/AxiosPost";
import AxiosGet from "@utils/AxiosGet";
import DynamicIcon from "@core/DynamicIcon";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { useDebounce } from "use-debounce";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { TwitterPicker } from "react-color";
import useAsyncEffect from "use-async-effect";

const useStyles = makeStyles((theme) => ({
    buttonIcon: {
        margin: 4,
    },
    iconContainer: {
        display: "inline-block",
    },
    content: {
        padding: "0px 16px",
        height: 420,
    },
    iconScroller: {
        overflow: "scroll",
        height: "100%",
    },
    controls: {
        paddingBottom: 8,
        display: "flex",
    },
    formControl: {
        padding: 4,
    },
    backdrop: {
        backgroundColor: "#262626",
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
        opacity: 0.8,
        height: "22rem",
        position: "absolute",
        left: 0,
        right: 0,
    },
    iconWrapper: {
        position: "relative",
        height: 350,
    },
    colourButton: {
        height: 56,
        backgroundColor: "rgba(255, 255, 255, 0.09)",
        borderBottom: "1px solid #c4c4c4",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        padding: "6px 6px 6px 12px",
    },
    colourBlock: {
        width: "100%",
        height: 32,
    },
    colourPicker: {
        position: "absolute",
        zIndex: 2002,
        right: 28,
        marginTop: -12,
        "& .twitter-picker": {
            backgroundColor: "#3a3a3a !important",
        },
    },
    dialogContent: {
        padding: 4,
    },
}));

const defaultCount = 500;

export default function EditIconDialog({ onCancel, onSubmit, colour = "#ffffff", icon = null }) {
    const [iconFilter, setIconFilter] = React.useState(icon ? icon : "");
    const [debouncedIconFilter] = useDebounce(iconFilter, 500);
    const [icons, setIcons] = React.useState({ icons: [], length: null });
    const [selectedIcon, setSelectedIcon] = React.useState(icon);
    const [variants, setVariants] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedVariant, setSelectedVariant] = React.useState(null);
    const [iconCount, setIconCount] = React.useState(defaultCount);
    const [showColourPicker, setShowColourPicker] = React.useState(false);
    const classes = useStyles();
    const iconsContent = React.useRef(null);
    const [selectedColour, setSelectedColour] = React.useState(colour);

    const handleFilterChanged = (value) => {
        setIsLoading(true);
        setIconFilter(value);
    };

    const handleVariantChanged = (value) => {
        setIsLoading(true);
        setIconCount(defaultCount);
        setSelectedVariant(value);
        iconsContent.current.scrollTo(0, 0);
    };

    const scrollEvent = (e) => {
        if (icons.icons.length === icons.length) {
            return;
        }
        const overlap = 10; // pixels
        if (e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + overlap) {
            setIconCount(iconCount + 100);
        }
    };

    useAsyncEffect(async () => {
        const postData = {
            variant: selectedVariant,
        };
        if (iconCount) {
            postData["length"] = iconCount;
        }
        setIcons(await AxiosPost(`/api/icons/${debouncedIconFilter}`, postData));
        setIsLoading(false);
    }, [debouncedIconFilter, selectedVariant, iconCount]);

    useAsyncEffect(async () => {
        setVariants(await AxiosGet(`/api/icons/variants`));
    }, []);

    const handleColourChanged = (colour, event) => {
        setSelectedColour(colour.hex);
        setShowColourPicker(false);
    };

    const iconContainer = () => {
        return (
            <>
                {showColourPicker && (
                    <div className={classes.colourPicker}>
                        <TwitterPicker
                            triangle="hide"
                            color={selectedColour}
                            onChange={handleColourChanged}
                            colors={[
                                "#FFFFFF",
                                "#ABB8C3",
                                "#888888",
                                "#FF6900",
                                "#FFFF00",
                                "#FCB900",
                                "#58dcb9",
                                "#2bd649",
                                "#8ED1FC",
                                "#0693E3",
                                "#0000FF",
                                "#DE2424",
                                "#F78DA7",
                                "#9900EF",
                            ]}
                        />
                    </div>
                )}
                {isLoading && (
                    <div className={classes.backdrop} open={true}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                            style={{ height: "100%" }}
                        >
                            <Grid item xs={3}>
                                <CircularProgress disableShrink />
                            </Grid>
                        </Grid>
                    </div>
                )}
                <div className={classes.iconWrapper}>
                    <div className={classes.iconScroller} onScroll={scrollEvent} ref={iconsContent}>
                        <div className={classes.iconScrollerContents}>
                            <div className={classes.iconContainer}>
                                <Button
                                    variant={selectedIcon === null ? "contained" : "outlined"}
                                    color={selectedIcon === null ? "primary" : "default"}
                                    disableElevation
                                    className={classes.buttonIcon}
                                    onClick={() => setSelectedIcon(null)}
                                    style={{ color: selectedColour }}
                                >
                                    &nbsp;
                                </Button>
                            </div>

                            {memoizedIcons}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const memoizedIcons = useMemo(
        () =>
            icons.icons.map((icon) => (
                <div key={icon} className={classes.iconContainer}>
                    <Tooltip title={icon}>
                        <Button
                            variant={selectedIcon === icon ? "contained" : "outlined"}
                            color={selectedIcon === icon ? "primary" : "default"}
                            disableElevation
                            className={classes.buttonIcon}
                            onClick={() => setSelectedIcon(icon)}
                            style={{ color: selectedColour }}
                        >
                            <DynamicIcon title={icon} className={classes.icon} iconName={icon} />
                        </Button>
                    </Tooltip>
                </div>
            )),
        [icons, selectedIcon, selectedColour, classes.iconContainer, classes.icon, classes.buttonIcon]
    );

    const controls = () => (
        <div className={classes.controls}>
            <FormControl className={classes.formControl} style={{ flexGrow: 1 }}>
                <TextField
                    label="Filter icons ..."
                    fullWidth
                    autoFocus
                    value={iconFilter}
                    onChange={(e) => handleFilterChanged(e.target.value)}
                />
            </FormControl>
            <FormControl className={classes.formControl} style={{ flexGrow: 1 }}>
                <TextField
                    select
                    fullWidth
                    label="Variant"
                    value={selectedVariant ? selectedVariant : ""}
                    onChange={(e) => handleVariantChanged(e.target.value)}
                >
                    <MenuItem value={""}>- none -</MenuItem>
                    {variants.map((variant) => (
                        <MenuItem key={variant} value={variant}>
                            {variant}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
            <FormControl className={classes.formControl} style={{ width: 120 }}>
                <Button
                    className={classes.colourButton}
                    onClick={(e) => {
                        setShowColourPicker(!showColourPicker);
                    }}
                    // variant="contained"
                >
                    <div className={classes.colourBlock} style={{ backgroundColor: selectedColour }}></div>
                    <ArrowDropDownIcon />
                </Button>
            </FormControl>
        </div>
    );

    return (
        <Dialog open onClose={onCancel} fullWidth maxWidth="md">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Select an Icon</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <div className={classes.content}>
                        {controls()}
                        {iconContainer()}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => onSubmit(selectedIcon, selectedColour)}
                        color="primary"
                        autoFocus
                    >
                        Select
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
