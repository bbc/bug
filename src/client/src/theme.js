import { createMuiTheme } from "@material-ui/core/styles";
const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            root: {
                padding: "8px 12px",
                borderBottom: "1px solid #181818",
            },
            head: {
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.875rem",
                padding: "12px 12px",
            },
        },
        MuiTableHead: {
            root: {
                "& .MuiTableCell-head": {
                    backgroundColor: "#212121",
                },
            },
        },
        MuiMenuItem: {
            root: {
                color: (props) => (props.disabled ? "#888" : "#ffffff"),
            },
        },
        MuiListItemText: {
            primary: {
                fontSize: "0.875rem",
            },
        },
        MuiListItemIcon: {
            root: {
                minWidth: 44,
                color: (props) => (props.disabled ? "#888" : "#ffffff"),
            },
        },
        MuiCardHeader: {
            root: {
                justifyContent: "flex-end",
                borderTopWidth: 1,
                borderTopColor: "#181818",
                borderTopStyle: "solid",
                padding: "16px",
                backgroundColor: "#212121",
            },
            title: {
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: 500,
                textTransform: "uppercase",
            },
        },
        MuiTabs: {
            root: {
                minHeight: 56,
            },
        },
        MuiTab: {
            root: {
                padding: "16px 12px",
            },
        },
        MuiToolbar: {
            gutters: {
                [defaultTheme.breakpoints.up("sm")]: {
                    paddingLeft: 0,
                    paddingRight: 0,
                },
            },
            root: {
                "& .MuiButton-outlinedPrimary": {
                    color: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    marginLeft: "0.5rem",
                },
                "& .MuiButton-containedPrimary": {
                    color: "rgba(255, 255, 255, 0.8)",
                    marginLeft: "0.5rem",
                },
            },
        },
        MuiFormLabel: {
            root: {
                fontSize: "0.875rem",
                opacity: 0.7,
            },
        },
        MuiCard: {
            root: {
                borderRadius: 0,
            },
        },
        MuiList: {
            padding: {
                paddingTop: 4,
                paddingBottom: 4,
            },
        },
        MuiDivider: {
            root: {
                marginTop: 2,
                marginBottom: 2,
            },
        },
        MuiChip: {
            root: {
                borderRadius: 3,
                fontSize: "inherit",
            },
        },
        MuiAlertTitle: {
            root: {
                color: "#fff",
                textTransform: "uppercase",
                fontSize: "0.875rem",
            },
        },
        MuiAlert: {
            standardError: {
                color: "#ded3d3",
                backgroundColor: "#b52424",
                "& .MuiAlert-icon": {
                    color: "#fff",
                },
            },
            standardWarning: {
                color: "#f7e7d6",
                backgroundColor: "#d07111",
                "& .MuiAlert-icon": {
                    color: "#fff",
                },
            },
            standardInfo: {
                color: "#dee4f7",
                backgroundColor: "#337ab7",
                "& .MuiAlert-icon": {
                    color: "#fff",
                },
            },
        },
        MuiDialogContent: {
            root: {
                // padding: 8,
            },
        },
    },
    typography: {
        fontFamily: ["ReithSans"],
        serviceState: {
            opacity: 0.5,
        },
    },
    palette: {
        type: "dark",

        background: {
            default: "#181818",
            paper: "#262626",
            hover: "#333",
        },

        control: {
            default: "rgb(38,38,38)",
            hover: "rgb(55,55,55)",
        },

        appbar: {
            default: "#212121",
        },

        // --- colors ---
        menu: {
            main: "#163550",
        },

        primary: {
            main: "#337ab7",
        },

        secondary: {
            main: "#888888",
        },

        default: {
            main: "#ffffff",
        },

        success: {
            main: "#05990c",
        },

        error: {
            main: "#b52424",
            hover: "#962222",
        },

        warning: {
            main: "#d07111",
        },

        info: {
            main: "#337ab7",
        },
    },
});

export default theme;
