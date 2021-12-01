import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import Toolbar from "@components/toolbars/ToolbarRouter";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@components/Menu";
import Box from "@mui/material/Box";
import useSounds from "@hooks/Sounds";

const NavMobile = (props) => {
    const [open, setOpen] = useState(false);
    const menuSound = useSounds("/sounds/menu-open.mp3");

    const handleDrawerToggle = () => {
        menuSound();
        setOpen(!open);
    };

    return (
        <Box
            sx={{
                display: "none",
                width: "100%",
                "@media (max-width:600px)": {
                    display: "flex",
                },
            }}
        >
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "menu.main",
                    zIndex: 1201,
                }}
                elevation={1}
            >
                <MuiToolbar sx={{ paddingRight: "0px", minHeight: "52px" }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{
                            marginRight: "4px",
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Toolbar></Toolbar>
                </MuiToolbar>
            </AppBar>
            <Drawer
                sx={{
                    "& .MuiDrawer-paper": {
                        marginTop: "52px",
                        maxWidth: "90%",
                        minWidth: "280px",
                    },
                }}
                transitionDuration={100}
                open={open}
                onClose={handleDrawerToggle}
            >
                <div onClick={handleDrawerToggle}>
                    <Menu />
                </div>
            </Drawer>
            <Box
                sx={{
                    position: "relative",
                    flexGrow: 1,
                }}
            >
                {props.children}
            </Box>
        </Box>
    );
};

export default NavMobile;
