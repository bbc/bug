import React, { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import AxiosPost from "@utils/AxiosPost";
import AxiosGet from "@utils/AxiosGet";
import BugDynamicIcon from "@core/BugDynamicIcon";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { useDebounce } from "use-debounce";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { TwitterPicker } from "react-color";
import useAsyncEffect from "use-async-effect";

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
                    <Box
                        sx={{
                            position: "absolute",
                            zIndex: 2002,
                            right: "28px",
                            marginTop: "-12px",
                            "& .twitter-picker": {
                                backgroundColor: "#3a3a3a !important",
                            },
                        }}
                    >
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
                    </Box>
                )}
                {isLoading && (
                    <Box
                        sx={{
                            backgroundColor: "#262626",
                            zIndex: "drawer + 1",
                            color: "#fff",
                            opacity: 0.8,
                            height: "22rem",
                            position: "absolute",
                            left: 0,
                            right: 0,
                        }}
                        open={true}
                    >
                        <Grid
                            container
                            spacing={0}
                            sx={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                            }}
                        >
                            <Grid item xs={3}>
                                <CircularProgress disableShrink />
                            </Grid>
                        </Grid>
                    </Box>
                )}
                <Box sx={{ position: "relative", height: "350px" }}>
                    <Box sx={{ overflow: "scroll", height: "100%" }} onScroll={scrollEvent} ref={iconsContent}>
                        <div>
                            <Box
                                sx={{
                                    display: "inline-block",
                                }}
                            >
                                <Button
                                    variant={selectedIcon === null ? "contained" : "outlined"}
                                    color={selectedIcon === null ? "primary" : "default"}
                                    disableElevation
                                    sx={{ margin: "4px" }}
                                    onClick={() => setSelectedIcon(null)}
                                    style={{ color: selectedColour }}
                                >
                                    &nbsp;
                                </Button>
                            </Box>

                            {memoizedIcons}
                        </div>
                    </Box>
                </Box>
            </>
        );
    };

    const memoizedIcons = useMemo(
        () =>
            icons.icons.map((icon) => (
                <Box key={icon} sx={{ display: "inline-block" }}>
                    <Tooltip title={icon}>
                        <Button
                            variant={selectedIcon === icon ? "contained" : "outlined"}
                            color={selectedIcon === icon ? "primary" : "default"}
                            disableElevation
                            sx={{
                                margin: "4px",
                            }}
                            onClick={() => setSelectedIcon(icon)}
                            style={{ color: selectedColour }}
                        >
                            <BugDynamicIcon title={icon} iconName={icon} />
                        </Button>
                    </Tooltip>
                </Box>
            )),
        [icons, selectedIcon, selectedColour]
    );

    const controls = () => (
        <Box sx={{ paddingBottom: "8px", display: "flex" }}>
            <FormControl sx={{ padding: "4px", flexGrow: 1 }}>
                <TextField
                    label="Filter icons ..."
                    variant="standard"
                    fullWidth
                    autoFocus
                    value={iconFilter}
                    onChange={(e) => handleFilterChanged(e.target.value)}
                />
            </FormControl>
            <FormControl sx={{ padding: "4px", flexGrow: 1 }}>
                <TextField
                    variant="standard"
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
            <FormControl sx={{ padding: "4px", width: "120px", flexGrow: 1 }}>
                <Button
                    sx={{
                        height: "56px",
                        backgroundColor: "rgba(255, 255, 255, 0.09)",
                        borderBottom: "1px solid #c4c4c4",
                        borderBottomLeftRadius: "0px",
                        borderBottomRightRadius: "0px",
                        padding: "6px 6px 6px 12px",
                    }}
                    onClick={(e) => {
                        setShowColourPicker(!showColourPicker);
                    }}
                >
                    <Box sx={{ width: "100%", height: "32px", backgroundColor: selectedColour }}></Box>
                    <ArrowDropDownIcon />
                </Button>
            </FormControl>
        </Box>
    );

    return (
        <Dialog open onClose={onCancel} fullWidth maxWidth="md">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Select an Icon</DialogTitle>
                <DialogContent sx={{ padding: "4px" }}>
                    <Box sx={{ padding: "0px 16px", height: "420px" }}>
                        {controls()}
                        {iconContainer()}
                    </Box>
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
