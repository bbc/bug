import React from "react";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import Toolbar from "@components/toolbars/ToolbarRouter";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@components/Menu";
import Box from "@mui/material/Box";
import useSound from "use-sound";

const NavMobile = (props) => {
    const [open, setOpen] = React.useState(false);
    const [menuSound] = useSound("/sounds/menu-open.mp3");

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
                <MuiToolbar style={{ paddingRight: 0 }}>
                    <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle} edge="start">
                        <MenuIcon />
                    </IconButton>
                    <Toolbar></Toolbar>
                </MuiToolbar>
            </AppBar>
            <Drawer
                sx={{
                    "& .MuiDrawer-paper": {
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
            <div
                sx={{
                    position: "relative",
                    flexGrow: 1,
                }}
            >
                {props.children}
            </div>
        </Box>
    );
};

export default NavMobile;
