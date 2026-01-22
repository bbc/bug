import BugDynamicIcon from "@core/BugDynamicIcon";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CancelIcon from "@mui/icons-material/Cancel";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField,
    Tooltip,
} from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import { useMemo, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import useAsyncEffect from "use-async-effect";
import { useDebounce } from "use-debounce";

const defaultCount = 500;

const PRESET_COLORS = [
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
];

export default function BugEditIconDialog({ onCancel, onSubmit, color = "#ffffff", icon = null }) {
    const [iconFilter, setIconFilter] = useState(icon ? icon : "");
    const [debouncedIconFilter] = useDebounce(iconFilter, 500);
    const [icons, setIcons] = useState({ icons: [], length: null });
    const [selectedIcon, setSelectedIcon] = useState(icon);
    const [variants, setVariants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [iconCount, setIconCount] = useState(defaultCount);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const iconsContent = useRef(null);
    const [selectedColor, setSelectedColor] = useState(color);

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

    const handleClear = () => {
        setIsLoading(true);
        setIconFilter("");
    };

    const scrollEvent = (e) => {
        if (icons.icons.length === icons.length) return;
        const overlap = 10;
        if (e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + overlap) {
            setIconCount(iconCount + 100);
        }
    };

    useAsyncEffect(async () => {
        const postData = { variant: selectedVariant };
        if (iconCount) postData["length"] = iconCount;
        setIcons(await AxiosPost(`/api/icons/${debouncedIconFilter}`, postData));
        setIsLoading(false);
    }, [debouncedIconFilter, selectedVariant, iconCount]);

    useAsyncEffect(async () => {
        setVariants(await AxiosGet(`/api/icons/variants`));
    }, []);

    const handleColorChanged = (newHex) => {
        setSelectedColor(newHex);
        setShowColorPicker(false);
    };

    const iconContainer = () => {
        return (
            <>
                {showColorPicker && (
                    <Box
                        sx={{
                            position: "absolute",
                            zIndex: 2002,
                            right: "28px",
                            marginTop: "-12px",
                            backgroundColor: "#3a3a3a",
                            padding: "10px",
                            borderRadius: "4px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <HexColorPicker color={selectedColor} onChange={handleColorChanged} />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(7, 1fr)",
                                gap: "6px",
                            }}
                        >
                            {PRESET_COLORS.map((c) => (
                                <Box
                                    key={c}
                                    onClick={() => {
                                        handleColorChanged(c);
                                        setShowColorPicker(false);
                                    }}
                                    sx={{
                                        width: "22px",
                                        height: "22px",
                                        backgroundColor: c,
                                        cursor: "pointer",
                                        borderRadius: "2px",
                                        border:
                                            selectedColor.toLowerCase() === c.toLowerCase()
                                                ? "2px solid white"
                                                : "1px solid rgba(0,0,0,0.2)",
                                        "&:hover": { transform: "scale(1.1)" },
                                    }}
                                />
                            ))}
                        </Box>
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
                    >
                        <Grid
                            container
                            sx={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                            }}
                        >
                            <CircularProgress disableShrink />
                        </Grid>
                    </Box>
                )}
                <Box sx={{ position: "relative", height: "350px", opacity: isLoading ? 0.2 : 1 }}>
                    <Box sx={{ overflow: "scroll", height: "100%" }} onScroll={scrollEvent} ref={iconsContent}>
                        <div>
                            <Box sx={{ display: "inline-block" }}>
                                <Button
                                    variant={selectedIcon === null ? "contained" : "outlined"}
                                    color={selectedIcon === null ? "primary" : "inherit"}
                                    disableElevation
                                    sx={{ margin: "4px" }}
                                    onClick={() => setSelectedIcon(null)}
                                    style={{ color: selectedColor }}
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
                            color={selectedIcon === icon ? "primary" : "inherit"}
                            disableElevation
                            sx={{ margin: "4px" }}
                            onClick={() => setSelectedIcon(icon)}
                            style={{ color: selectedColor }}
                        >
                            <BugDynamicIcon title={icon} iconName={icon} />
                        </Button>
                    </Tooltip>
                </Box>
            )),
        [icons, selectedIcon, selectedColor]
    );

    const controls = () => (
        <Box sx={{ paddingBottom: "8px", display: "flex" }}>
            <FormControl sx={{ padding: "4px", flexGrow: 1 }}>
                <TextField
                    label="Filter icons ..."
                    variant="filled"
                    fullWidth
                    autoFocus
                    value={iconFilter}
                    onChange={(e) => handleFilterChanged(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="clear" onClick={handleClear}>
                                    <CancelIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </FormControl>
            <FormControl sx={{ padding: "4px", flexGrow: 1 }}>
                <TextField
                    variant="filled"
                    select
                    fullWidth
                    label="Variant"
                    value={selectedVariant || ""}
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
                        height: "53px",
                        backgroundColor: "rgba(255, 255, 255, 0.09)",
                        borderBottom: "1px solid #c4c4c4",
                        borderRadius: "4px 4px 0 0",
                        padding: "6px 6px 6px 12px",
                    }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                >
                    <Box sx={{ width: "100%", height: "32px", backgroundColor: selectedColor }}></Box>
                    <ArrowDropDownIcon />
                </Button>
            </FormControl>
        </Box>
    );

    return (
        <Dialog open onClose={onCancel} fullWidth maxWidth="md">
            <form onSubmit={(e) => e.preventDefault()}>
                <DialogTitle>Select an Icon</DialogTitle>
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
                        onClick={() => onSubmit(selectedIcon, selectedColor)}
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
