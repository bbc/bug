import React from "react";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import { useHotkeys } from "react-hotkeys-hook";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabContainer from "@core/TabContainer.jsx";

const useStyles = makeStyles((theme) => ({
    header: {
        backgroundColor: theme.palette.appbar.default,
        color: theme.palette.primary.main,
        "& .MuiCardHeader-title": {
            fontSize: "1rem",
            textTransform: "uppercase",
        },
    },
    card: {
        minWidth: 300,
        textAlign: "left",
        color: theme.palette.text.secondary,
        position: "relative",
    },
    actions: {
        justifyContent: "flex-end",
        borderTopWidth: 1,
        borderTopColor: theme.palette.background.default,
        borderTopStyle: "solid",
        backgroundColor: theme.palette.appbar.default,
        "& .MuiCardHeader-title": {
            fontSize: "1rem",
            textTransform: "uppercase",
        },
        padding: "16px",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
        color: "rgba(255, 255, 255, 0.7)",
        padding: 16,
        zIndex: 1,
    },
    tabs: {
        marginRight: 48,
    },
}));

export default function PanelTabbedForm(props) {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const TabPanel = ({ children, value, index }) => {
        return (
            <Card className={classes.card} role="tabpanel" hidden={value !== index}>
                {value === index && <>{children}</>}
            </Card>
        );
    };

    useHotkeys("esc", props.onClose);

    return (
        <>
            <div style={{ position: "relative" }}>
                <TabContainer>
                    {props.onClose && (
                        <IconButton aria-label="close" className={classes.closeButton} onClick={props.onClose}>
                            <CloseIcon />
                        </IconButton>
                    )}

                    <Tabs
                        className={classes.tabs}
                        value={tabIndex}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                    >
                        {props.labels.map((label, index) => (
                            <Tab label={label} key={index} />
                        ))}
                    </Tabs>
                </TabContainer>
            </div>
            <Card className={classes.card}>
                {props.content
                    ? props.content.map((content, index) => (
                          <TabPanel key={index} value={tabIndex} index={index}>
                              {content}
                          </TabPanel>
                      ))
                    : null}
            </Card>
        </>
    );
}
