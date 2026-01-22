import ColorizeIcon from "@mui/icons-material/Colorize";
import { Box, Button, IconButton, Popover } from "@mui/material";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

const PRESET_COLORS = [
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
];

export default function BugColorPicker({ onColorChange, color }) {
    const [statusEl, setStatusEl] = useState(null);
    const isOpen = Boolean(statusEl);

    const handleClick = (event) => setStatusEl(event.currentTarget);
    const handleClose = () => setStatusEl(null);

    return (
        <>
            <Button
                onClick={handleClick}
                sx={{
                    "&:hover": { backgroundColor: color },
                    height: "1.5em",
                    backgroundColor: color,
                    minWidth: "30px",
                    border: "1px solid rgba(0,0,0,0.1)",
                }}
            />
            <IconButton sx={{ color: color }} aria-label="color picker" onClick={handleClick}>
                <ColorizeIcon />
            </IconButton>

            <Popover
                anchorEl={statusEl}
                open={isOpen}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Box sx={{ p: 2, backgroundColor: "#3a3a3a", display: "flex", flexDirection: "column", gap: 2 }}>
                    <HexColorPicker color={color} onChange={(newColor) => onColorChange({ hex: newColor })} />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            gap: "8px",
                            width: "200px",
                        }}
                    >
                        {PRESET_COLORS.map((presetColor) => (
                            <Box
                                key={presetColor}
                                onClick={() => onColorChange({ hex: presetColor })}
                                sx={{
                                    width: "30px",
                                    height: "30px",
                                    backgroundColor: presetColor,
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    border:
                                        color === presetColor ? "2px solid white" : "1px solid rgba(255,255,255,0.2)",
                                    "&:hover": { transform: "scale(1.1)" },
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Popover>
        </>
    );
}
