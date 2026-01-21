import Menu from "@components/Menu";
import Toolbar from "@components/toolbars/ToolbarRouter";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Drawer, IconButton } from "@mui/material";
import MuiToolbar from "@mui/material/Toolbar";
import { useState } from "react";
const NavMobile = (props) => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => {
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
