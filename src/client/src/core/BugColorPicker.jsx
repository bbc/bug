import ColorizeIcon from "@mui/icons-material/Colorize";
import { Button, IconButton, Popover } from "@mui/material";
import { useState } from "react";
import { TwitterPicker } from "react-color";
export default function BugColorPicker({ onColorChange, color }) {
    const [isOpen, setIsOpen] = useState(false);
    const [statusEl, setStatusEl] = useState(null);

    const handleClick = (event) => {
        setStatusEl(event.currentTarget);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                sx={{
                    "&:hover": {
                        backgroundColor: color,
                    },
                    height: "1.5em",
                    backgroundColor: color,
                }}
            ></Button>
            <IconButton
                sx={{
                    color: color,
                }}
                aria-label="color picker"
                onClick={handleClick}
                component="span"
            >
                <ColorizeIcon />
            </IconButton>
            <Popover
                sx={{
                    "& .twitter-picker": {
                        backgroundColor: "#3a3a3a !important",
                    },
                }}
                anchorEl={statusEl}
                open={isOpen}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <TwitterPicker
                    sx={{
                        backgroundColor: color,
                    }}
                    triangle="hide"
                    colors={[
                        "#000000",
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
                    color={color}
                    onChangeComplete={onColorChange}
                />
            </Popover>
        </>
    );
}
