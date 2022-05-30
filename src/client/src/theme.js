import { createTheme } from "@mui/material/styles";
const defaultTheme = createTheme();
const selectedFont = "Roboto";

const theme = (selectedTheme = "dark") => {
    const getPalette = (selectedTheme) => {
        if (selectedTheme === "dark") {
            return {
                mode: "dark",

                primary: {
                    main: "#337ab7",
                    hover: "#2e6da4",
                },

                secondary: {
                    main: "#888888",
                    hover: "#777777",
                },

                tertiary: {
                    main: "#444",
                    hover: "#404040",
                },

                error: {
                    main: "rgba(181, 36, 36, 1)",
                    secondary: "rgba(181, 36, 36, 0.5)",
                    hover: "#962222",
                },

                warning: {
                    main: "rgba(208, 113, 17, 1)",
                    secondary: "rgba(208, 113, 17, 0.5)",
                },

                control: {
                    default: "rgb(38,38,38)",
                    hover: "rgb(55,55,55)",
                },

                appbar: {
                    default: "#212121",
                },

                background: {
                    default: "#181818",
                    paper: "#262626",
                    hover: "#333",
                },

                success: {
                    main: "rgba(5, 153, 12, 1)",
                    secondary: "rgba(5, 153, 12, 0.51)",
                },

                text: {
                    primary: "#ffffff",
                },

                menu: {
                    main: "#163550",
                },

                default: {
                    main: "#ffffff",
                },

                info: {
                    main: "#337ab7",
                },
            };
        }

        return {
            mode: "light",

            primary: {
                main: "rgba(0, 0, 0, 0.87)",
                hover: "#2e6da4",
            },

            secondary: {
                main: "rgba(0, 0, 0, 0.6)",
                hover: "#777777",
            },

            tertiary: {
                main: "#444",
                hover: "#404040",
            },

            error: {
                main: "rgba(203, 101, 101, 1)",
                hover: "#962222",
                secondary: "rgba(203, 101, 101, 0.5)",
            },

            warning: {
                main: "#d07111",
                secondary: "#E7B888",
            },

            control: {
                default: "rgb(38,38,38)",
                hover: "rgb(55,55,55)",
            },

            appbar: {
                default: "#2c4a62",
            },

            background: {
                default: "#fff",
                paper: "#fff",
                hover: "#333",
            },

            success: {
                main: "#05990c",
                secondary: "rgba(5, 153, 12, 0.51)",
            },

            text: {
                primary: "rgba(0, 0, 0, 0.87)",
            },

            menu: {
                main: "#163550",
            },

            default: {
                main: "#ffffff",
            },

            info: {
                main: "#337ab7",
            },
        };
    };
    return createTheme({
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        fontFamily: selectedFont,
                        backgroundImage: "none",
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        padding: "8px 12px",
                        borderBottom: "1px solid #181818",
                    },
                    head: {
                        textTransform: "uppercase",
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: "0.875rem",
                        padding: "12px 12px",
                    },
                },
            },
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        "& .MuiTableCell-head": {
                            backgroundColor: "#212121",
                        },
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        color: "#ffffff",
                        height: 41,
                    },
                },
            },
            MuiListItemText: {
                styleOverrides: {
                    primary: {
                        fontSize: "0.875rem",
                        color: "#ffffff",
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        minWidth: 44,
                        color: "#ffffff",
                    },
                },
            },
            MuiCardHeader: {
                styleOverrides: {
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
            },
            MuiTabs: {
                styleOverrides: {
                    root: {
                        minHeight: 56,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        padding: "16px 12px",
                    },
                },
            },
            MuiToolbar: {
                styleOverrides: {
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
            },
            MuiFormControl: {
                styleOverrides: {
                    "& .MuiInput-underline:before": {
                        borderBottom: "1px solid rgba(255, 0, 255, 0.42)",
                    },
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        fontSize: "0.9rem",
                        opacity: 0.7,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                    },
                },
            },
            MuiList: {
                styleOverrides: {
                    padding: {
                        paddingTop: 4,
                        paddingBottom: 4,
                    },
                },
            },
            MuiDivider: {
                styleOverrides: {
                    root: {
                        marginTop: 0,
                        marginBottom: 0,
                    },
                },
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        fontSize: "0.9rem",
                    },
                },
            },
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        "&.MuiMenuItem-root+.MuiDivider-root": {
                            marginTop: 2,
                            marginBottom: 2,
                        },
                        "&.MuiMenuItem-root.Mui-selected": {
                            backgroundColor: "#163550",
                        },
                    },
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    root: {
                        "& .Mui-checked.Mui-disabled": {
                            color: "#204260 !important",
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        margin: "2px",
                        borderRadius: 3,
                        fontSize: "inherit",
                        height: "28px",
                    },
                },
            },
            MuiAutocomplete: {
                styleOverrides: {
                    root: {
                        "& .MuiOutlinedInput-root": {
                            padding: "6.5px",
                        },
                    },
                    listbox: {
                        "& .MuiAutocomplete-option.Mui-focused": {
                            backgroundColor: "#163550 !important",
                        },
                    },
                    paper: {
                        backgroundColor: "#212121",
                    },
                    option: {
                        height: 41,
                    },
                },
            },
            MuiAlertTitle: {
                styleOverrides: {
                    root: {
                        color: "#fff",
                        textTransform: "uppercase",
                        fontSize: "0.875rem",
                    },
                },
            },
            MuiAlert: {
                styleOverrides: {
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
            },
            MuiDialogContent: {
                styleOverrides: {
                    root: {
                        // padding: 8,
                        // overflowY: "visible"
                    },
                },
            },
        },
        typography: {
            fontFamily: selectedFont,
            serviceState: {
                opacity: 0.5,
            },
            body1: {
                fontSize: 14,
            },
            subtitle1: {
                fontSize: 13,
                textTransform: "uppercase",
                opacity: 0.5,
                fontWeight: 500,
            },
        },
        palette: getPalette(selectedTheme),
    });
};

export default theme;
