import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import BugQuote from "@components/BugQuote";
import LoadingOverlay from "@components/LoadingOverlay";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import userSlice from "@redux/userSlice";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import useAsyncEffect from "use-async-effect";
import AxiosGet from "@utils/AxiosGet";
import { Alert } from "@material-ui/lab";
import Fade from "@material-ui/core/Fade";
import axios from "axios";
import PinLogin from "@components/login/PinLogin";
import LocalLogin from "@components/login/LocalLogin";

const useStyles = makeStyles((theme) => ({
    page: {
        height: "100%",
        width: "100%",
        overflow: "auto",
    },
    root: {
        margin: "auto",
        marginTop: "4rem",
        maxWidth: 620,
        minHeight: 800,
        "@media (max-width:800px)": {
            minHeight: 680,
        },
        "@media (max-width:624px)": {
            marginTop: 0,
            minHeight: "inherit",
        },
        "@media (max-height:400px) and (max-width:800px)": {
            maxWidth: "inherit",
            marginTop: 0,
            backgroundColor: "inherit",
            minHeight: "inherit",
        },
    },
    login: {
        margin: theme.spacing(1),
    },
    quote: {
        margin: "auto",
        maxWidth: 620,
        padding: 16,
        color: theme.palette.primary.main,
        fontSize: "1rem",
        "@media (max-height:400px) and (max-width:800px)": {
            maxWidth: "inherit",
            padding: 14,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textAlign: "center",
            fontSize: 15,
        },
    },
    icon: {
        color: theme.palette.primary.main,
        fontSize: 120,
        padding: 16,
        "@media (max-width:800px)": {
            fontSize: 100,
            padding: 10,
        },
        "@media (max-width:600px)": {
            fontSize: 80,
            padding: 8,
        },
    },
    cardContent: {
        textAlign: "center",
        marginLeft: 16,
        marginRight: 16,
        "@media (max-height:400px) and (max-width:800px)": {
            margin: 0,
            padding: 0,
            "&:last-child": {
                paddingBottom: 0,
            },
        },
        "@media (max-width:480px)": {
            padding: 8,
            margin: 8,
        },
    },
    title: {
        fontSize: 50,
        padding: 16,
        fontWeight: 500,
        marginBottom: 16,
        "@media (max-width:800px)": {
            fontSize: 44,
            marginBottom: 10,
        },
        "@media (max-width:600px)": {
            fontSize: 32,
            paddingTop: 8,
            marginBottom: 8,
        },
        "@media (max-height:400px) and (max-width:800px)": {
            fontSize: 26,
            paddingTop: 4,
        },
    },
    tabs: {
        backgroundColor: theme.palette.appbar.default,
    },
    tabContainer: {
        position: "static",
    },
    tabPanel: {
        paddingTop: 0,
        "@media (max-height:400px) and (max-width:800px)": {
            height: 292,
        },
    },
    gridContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        "@media (max-height:400px) and (max-width:800px)": {
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexDirection: "row",
        },
    },
    logoWrapper: {
        "@media (max-height:400px) and (max-width:800px)": {
            margin: 16,
            width: 300,
        },
    },
    tabWrapper: {
        width: "100%",
        "@media (max-height:400px) and (max-width:800px)": {
            backgroundColor: theme.palette.background.paper,
        },
    },
}));

export default function PageLogin() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [enabledStrategies, setEnabledStrategies] = React.useState([]);
    const [alert, setAlert] = React.useState("");

    useAsyncEffect(async () => {
        const url = `/api/strategy/safe`;
        const allStrategies = await AxiosGet(url);
        setEnabledStrategies(allStrategies.filter((eachStrategy) => eachStrategy.enabled));
        setLoading(false);
    }, []);

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const TabPanel = ({ children, value, index }) => {
        return (
            <div className={classes.tabPanel} role="tabpanel" hidden={value !== index}>
                {value === index && <>{children}</>}
            </div>
        );
    };

    const setAlertWithTimeout = (alert, timeout = 4000) => {
        setAlert(alert);
        setTimeout(() => {
            setAlert(null);
        }, timeout);
    };

    const handleLogin = async (form) => {
        setLoading(true);
        const response = await axios.post(`/api/login`, form);
        if (response.data.status === "success") {
            dispatch(userSlice.actions[response.data.status](response.data));
        } else {
            setAlertWithTimeout("Failed to log in");
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingOverlay />;
    }

    const LoginMethod = ({ type, handleLogin, index }) => {
        const props = { handleLogin, index };
        switch (type) {
            case "local":
                return <LocalLogin {...props} />;
            case "oidc":
                return null;
            case "pin":
                return <PinLogin {...props} />;
            case "proxy":
                return null;
            case "saml":
                return null;
            default:
                return null;
        }
    };

    return (
        <>
            <div className={classes.page}>
                <Card className={classes.root}>
                    <CardContent className={classes.cardContent}>
                        <Grid container className={classes.gridContainer}>
                            <Grid item className={classes.logoWrapper}>
                                <FontAwesomeIcon size="lg" icon={faBug} className={classes.icon} />
                                <div className={classes.title}>Geoff's BUG</div>
                            </Grid>
                            <Grid item className={classes.tabWrapper}>
                                <Tabs
                                    className={classes.tabs}
                                    value={tabIndex}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={handleChange}
                                    variant={enabledStrategies.length < 3 ? `fullWidth` : `scrollable`}
                                    scrollButtons="on"
                                >
                                    {enabledStrategies.map((eachStrategy, index) => (
                                        <Tab label={eachStrategy.name} key={index} />
                                    ))}
                                </Tabs>

                                {enabledStrategies.map((eachStrategy, index) => (
                                    <TabPanel key={index} value={tabIndex} index={index}>
                                        <LoginMethod type={eachStrategy.type} index={index} handleLogin={handleLogin} />
                                    </TabPanel>
                                ))}
                                {alert && (
                                    <Fade in={alert !== null}>
                                        <Grid item xs={12}>
                                            <Alert severity="error">{alert}</Alert>
                                        </Grid>
                                    </Fade>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Typography variant="body2" component="p" className={classes.quote}>
                    <BugQuote />
                </Typography>
            </div>
        </>
    );
}
