import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import Toolbar from "@components/toolbars/ToolbarRouter";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Menu from "@components/Menu";
import BugScrollbars from "@core/BugScrollbars";
import useSounds from "@hooks/Sounds";
import { styled } from "@mui/material/styles";

const fullMenuWidth = 1024;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    minHeight: "64px",
    "@media (max-width:800px)": {
        minHeight: "52px",
    },
}));

const NavDesktop = (props) => {
    const [open, setOpen] = useState(false);
    const menuSound = useSounds("/sounds/menu-open.mp3");

    const handleDrawerToggle = () => {
        menuSound();
        setOpen(!open);
    };

    useEffect(() => {
        if (window.innerWidth > fullMenuWidth) {
            // window is wide - open the menu by default
            setOpen(true);
        }
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                "@media (max-width:600px)": {
                    display: "none",
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
                <MuiToolbar
                    sx={{
                        "@media (max-width:800px)": {
                            minHeight: "52px",
                        },
                    }}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{
                            marginRight: "20px",
                            marginLeft: "8px",
                        }}
                    >
                        {open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                    <Toolbar></Toolbar>
                </MuiToolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    "& .MuiDrawer-paper": { overflowY: "visible" },
                    "& .MuiGrid-container": {
                        flexWrap: "nowrap",
                        width: open ? "auto" : "56px",
                        overflowX: open ? "visible" : "hidden",
                    },
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    "& .MuiPaper-root": {
                        borderRightWidth: 0,
                        width: open ? "275px" : "56px",
                        overflowX: open ? "visible" : "hidden",
                    },
                    width: open ? "275px" : "56px",
                }}
            >
                <DrawerHeader />
                <BugScrollbars>
                    <Menu showGroups={open} />
                </BugScrollbars>
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

export default NavDesktop;
