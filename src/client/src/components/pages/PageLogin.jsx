import React, { useState } from "react";
import { useDispatch } from "react-redux";
import BugQuote from "@components/BugQuote";
import LoadingOverlay from "@components/LoadingOverlay";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import userSlice from "@redux/userSlice";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import useAsyncEffect from "use-async-effect";
import AxiosGet from "@utils/AxiosGet";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import axios from "axios";
import PinLogin from "@components/login/PinLogin";
import AutoLogin from "@components/login/AutoLogin";
import LocalLogin from "@components/login/LocalLogin";
import ProxyLogin from "@components/login/ProxyLogin";
import { useSelector } from "react-redux";

export default function PageLogin() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const [enabledStrategies, setEnabledStrategies] = React.useState([]);
    const [alert, setAlert] = React.useState("");
    const settings = useSelector((state) => state.settings);

    useAsyncEffect(async () => {
        const allStrategies = await AxiosGet(`/api/strategy/safe`);
        setEnabledStrategies(allStrategies.filter((eachStrategy) => eachStrategy.enabled));
        setLoading(false);
    }, []);

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const TabPanel = ({ children, value, index }) => {
        return (
            <Box
                sx={{
                    paddingTop: "0px",
                    "@media (max-height:400px) and (max-width:800px)": {
                        height: "292px",
                    },
                }}
                role="tabpanel"
                hidden={value !== index}
            >
                {value === index && <>{children}</>}
            </Box>
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
            case "auto":
                return <AutoLogin {...props} />;
            case "oidc":
                return null;
            case "pin":
                return <PinLogin {...props} />;
            case "proxy":
                return <ProxyLogin {...props} />;
            case "saml":
                return null;
            default:
                return null;
        }
    };

    return (
        <>
            <div style={{ height: "100%", width: "100%", overflow: "auto" }} sx={{ backgroundColor: "#ff0000" }}>
                <Card
                    sx={{
                        margin: "auto",
                        marginTop: "4rem",
                        maxWidth: "620px",
                        minHeight: "800px",
                        "@media (max-width:800px)": {
                            minHeight: "680px",
                        },
                        "@media (max-width:624px)": {
                            marginTop: "0px",
                            minHeight: "inherit",
                        },
                        "@media (max-height:400px) and (max-width:800px)": {
                            maxWidth: "inherit",
                            marginTop: "0px",
                            backgroundColor: "inherit",
                            minHeight: "inherit",
                        },
                    }}
                >
                    <CardContent
                        sx={{
                            textAlign: "center",
                            marginLeft: "16px",
                            marginRight: "16px",
                            "@media (max-height:400px) and (max-width:800px)": {
                                margin: "0px",
                                padding: "0px",
                                "&:last-child": {
                                    paddingBottom: "0px",
                                },
                            },
                            "@media (max-width:480px)": {
                                padding: "8px",
                                margin: "8px",
                            },
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                "@media (max-height:400px) and (max-width:800px)": {
                                    alignItems: "flex-start",
                                    flexWrap: "nowrap",
                                    flexDirection: "row",
                                },
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    "@media (max-height:400px) and (max-width:800px)": {
                                        margin: "16px",
                                        width: "300px",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        "& .fa-bug": {
                                            color: "primary.main",
                                            fontSize: 120,
                                            padding: "16px",
                                            "@media (max-width:800px)": {
                                                fontSize: 100,
                                                padding: "10px",
                                            },
                                            "@media (max-width:600px)": {
                                                fontSize: 80,
                                                padding: "8px",
                                            },
                                        },
                                    }}
                                >
                                    <FontAwesomeIcon size="lg" icon={faBug} />
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: "50px",
                                        padding: "16px",
                                        fontWeight: 500,
                                        marginBottom: "16px",
                                        "@media (max-width:800px)": {
                                            fontSize: "44px",
                                            marginBottom: "10px",
                                        },
                                        "@media (max-width:600px)": {
                                            fontSize: "32px",
                                            paddingTop: "8px",
                                            marginBottom: "8px",
                                        },
                                        "@media (max-height:400px) and (max-width:800px)": {
                                            fontSize: "26px",
                                            paddingTop: "4px",
                                        },
                                    }}
                                >
                                    {settings?.data?.title}
                                </Box>
                            </Grid>
                            <Grid
                                item
                                sx={{
                                    width: "100%",
                                    "@media (max-height:400px) and (max-width:800px)": {
                                        backgroundColor: "background.paper",
                                    },
                                }}
                            >
                                <Tabs
                                    sx={{
                                        backgroundColor: "appbar.default",
                                    }}
                                    value={tabIndex}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={handleChange}
                                    variant={enabledStrategies.length < 4 ? `fullWidth` : `scrollable`}
                                    scrollButtons={true}
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

                <Box
                    sx={{
                        margin: "auto",
                        maxWidth: 620,
                        fontSize: "1rem",
                        textAlign: "center",
                        "@media (max-height:400px) and (max-width:800px)": {
                            maxWidth: "inherit",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            fontSize: 15,
                            "& .MuiBox-root": {
                                margin: "12px",
                            },
                        },
                    }}
                >
                    <BugQuote />
                </Box>
            </div>
        </>
    );
}
