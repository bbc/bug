import React from "react";
import Card from "@mui/material/Card";
import { makeStyles } from "@mui/styles";
import { useHotkeys } from "react-hotkeys-hook";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContainer from "@core/TabContainer.jsx";

const useStyles = makeStyles((theme) => ({
    header: {
        "& .MuiCardHeader-title": {
            fontSize: "1rem",
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
        "& .MuiCardHeader-title": {
            fontSize: "1rem",
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

    useHotkeys("esc", props?.onClose);

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
                        variant="fullWidth"
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
