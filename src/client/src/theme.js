import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
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
                    main: "#4e4e4e",
                    hover: "#3d3d3d",
                },

                tertiary: {
                    main: "#444",
                    hover: "#404040",
                },

                error: {
                    main: "rgba(181, 36, 36, 1)",
                    secondary: "rgba(181, 36, 36, 0.75)",
                    hover: "#962222",
                },

                warning: {
                    main: "rgba(208, 113, 17, 1)",
                    secondary: "rgba(208, 113, 17, 0.75)",
                },

                control: {
                    default: "rgb(38,38,38)",
                    hover: "rgb(55,55,55)",
                },

                background: {
                    default: "#181818",
                    accent: "#212121",
                    paper: "#262626",
                    hover: "#333333",
                },

                success: {
                    main: "rgba(5, 153, 12, 1)",
                    secondary: "rgba(5, 153, 12, 0.75)",
                },

                text: {
                    highlight: "#ffffff",
                    primary: "rgba(255, 255, 255, 0.9)",
                    secondary: "rgba(255, 255, 255, 0.45)",
                    action: "#337ab7",
                },

                border: {
                    light: "#181818",
                },

                menu: {
                    main: "#163550",
                },

                default: {
                    main: "#ededed",
                },

                info: {
                    main: "#337ab7",
                },
            };
        }

        return {
            mode: "light",

            primary: {
                main: "#2f73aa",
                hover: "#3687c4",
            },

            secondary: {
                main: "#bebebe",
                hover: "#c8d0d7",
            },

            tertiary: {
                main: "#444",
                hover: "#404040",
            },

            error: {
                main: "rgba(203, 101, 101, 1)",
                hover: "#962222",
                secondary: "rgba(203, 101, 101, 0.75)",
            },

            warning: {
                main: "#d07111",
                secondary: "#E7B888",
            },

            control: {
                default: "rgb(38,38,38)",
                hover: "rgb(55,55,55)",
            },

            background: {
                default: "#efefef",
                accent: "#c2cad0",
                paper: "#dddddd",
                hover: "#333",
            },

            success: {
                main: "#05990c",
                secondary: "rgba(5, 153, 12, 0.8)",
            },

            text: {
                highlight: "#111111",
                primary: "#212121",
                secondary: "rgb(123 123 123)",
                action: "#2f73aa",
            },

            border: {
                light: "#bcbcbc",
            },

            menu: {
                main: "#1b4e78",
            },

            default: {
                main: "#212121",
            },

            info: {
                main: "#337ab7",
            },
        };
    };

    return createTheme({
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
                xxl: 1920,
            },
        },
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
                        borderColor: getPalette(selectedTheme).background.default,
                        borderBottomStyle: "solid",
                        borderBottomWidth: "1px",
                        padding: "8px 12px",
                    },
                    head: {
                        textTransform: "uppercase",
                        fontSize: "0.875rem",
                        padding: "12px 12px",
                        backgroundColor: getPalette(selectedTheme).background.accent,
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        height: 41,
                    },
                },
            },
            MuiListItemText: {
                styleOverrides: {
                    primary: {
                        fontSize: "0.875rem",
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        minWidth: 44,
                        color: getPalette(selectedTheme).text.primary,
                    },
                },
            },
            MuiCardHeader: {
                styleOverrides: {
                    root: {
                        justifyContent: "flex-end",
                        marginTop: 1,
                        padding: "16px",
                        backgroundColor: getPalette(selectedTheme).background.accent,
                        // "&:hover": {
                        //     backgroundColor: getPalette(selectedTheme).secondary.hover,
                        // },
                    },
                    title: {
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        color: getPalette(selectedTheme).text.primary,
                    },
                    subheader: {
                        color: getPalette(selectedTheme).text.secondary,
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
                    textColorPrimary: {
                        color: getPalette(selectedTheme).text.primary,
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
                            color: getPalette(selectedTheme).text.primary,
                            borderColor: alpha(getPalette(selectedTheme).text.primary, 0.3),
                            borderBottomStyle: "solid",
                            borderBottomWidth: "1px",
                            marginLeft: "0.5rem",
                        },
                        "& .MuiButton-containedPrimary": {
                            color: getPalette(selectedTheme).text.primary,
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
            MuiButton: {
                defaultProps: {
                    disableElevation: true,
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
                            backgroundColor: getPalette(selectedTheme).secondary.main,
                        },
                    },
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    root: {
                        "& .Mui-checked.Mui-primary.Mui-disabled": {
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
