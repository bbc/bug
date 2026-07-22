import Menu from "@components/Menu";
import Toolbar from "@components/toolbars/ToolbarRouter";
import BugDynamicIcon from "@core/BugDynamicIcon";
import BugScrollbars from "@core/BugScrollbars";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar, Box, Drawer, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiToolbar from "@mui/material/Toolbar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    minHeight: "64px",
    "@media (max-width: 800px)": {
        minHeight: "52px",
    },
}));

const NavDesktop = (props) => {
    const location = useLocation();
    const panel = useSelector((state) => state.panel);
    const settings = useSelector((state) => state.settings);

    const isHomePage = location.pathname === "/";
    const isModulePage = location.pathname.startsWith("/panel/");
    const isSystemPage = location.pathname.startsWith("/system");
    const isPanelsPage = location.pathname.startsWith("/panels");

    const moduleIconName = panel?.data?._module?.icon;
    const navIconName = isModulePage ? moduleIconName : isSystemPage ? "Settings" : isPanelsPage ? "Dashboard" : "Home";
    const showNavIcon = !isModulePage || Boolean(moduleIconName);
    const navIconLabel = isModulePage ? "module" : isSystemPage ? "system" : isPanelsPage ? "panels" : "home";
    const systemTitle = settings?.data?.title || "BUG";

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
                    {isHomePage ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "12px",
                                marginRight: "12px",
                                gap: "10px",
                                minWidth: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "text.primary",
                                    fontSize: "1.4rem",
                                    padding: "2px",
                                    marginRight: "4px",
                                }}
                            >
                                <FontAwesomeIcon icon={faBug} />
                            </Box>
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    color: "text.primary",
                                    lineHeight: 1,
                                }}
                            >
                                {systemTitle}
                            </Typography>
                        </Box>
                    ) : (
                        <IconButton
                            color="inherit"
                            aria-label={navIconLabel}
                            edge="start"
                            sx={{
                                marginRight: "10px",
                                marginLeft: "8px",
                            }}
                        >
                            {showNavIcon ? (
                                <BugDynamicIcon iconName={navIconName} />
                            ) : (
                                <Box sx={{ width: "24px", height: "24px" }} />
                            )}
                        </IconButton>
                    )}
                    <Toolbar></Toolbar>
                </MuiToolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    "& .MuiDrawer-paper": { overflowY: "visible" },
                    "& .MuiGrid-container": {
                        flexWrap: "nowrap",
                        width: "auto",
                        overflowX: "visible",
                    },
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    "& .MuiPaper-root": {
                        borderRightWidth: 0,
                        width: "275px",
                        overflowX: "visible",
                    },
                    width: "275px",
                }}
            >
                <DrawerHeader />
                <BugScrollbars>
                    <Menu showGroups />
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
