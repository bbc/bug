import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BugCard from "@core/BugCard";
import { useHistory, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";

export default function BugPanelTabbedForm({ labels, content, locations, onClose, defaultTab = 0 }) {
    const [tabIndex, setTabIndex] = React.useState(false);
    const history = useHistory();
    const location = useLocation();

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
        if (locations && locations[newIndex] && locations[newIndex] !== location.pathname) {
            history.push(locations[newIndex]);
        }
    };

    const TabPanel = ({ children, value, index }) => {
        return (
            <BugCard role="tabpanel" hidden={value !== index}>
                {value === index && <>{children}</>}
            </BugCard>
        );
    };

    useHotkeys("esc", onClose);

    React.useEffect(() => {
        let tabIndexToUse = defaultTab;
        // check the URL to see if we should load a specific tab index
        if (locations) {
            locations.forEach((eachLocation, eachIndex) => {
                if (eachLocation === location.pathname) {
                    tabIndexToUse = eachIndex;
                }
            });
        }
        handleChange(null, tabIndexToUse);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultTab]);

    return (
        <>
            <div style={{ position: "relative" }}>
                <Box
                    sx={{
                        width: "100%",
                        position: "absolute",
                        backgroundColor: "appbar.default",
                    }}
                >
                    {onClose && (
                        <IconButton
                            aria-label="close"
                            sx={{
                                position: "absolute",
                                right: "0px",
                                top: "0px",
                                color: "rgba(255, 255, 255, 0.7)",
                                padding: "16px",
                                zIndex: 1,
                            }}
                            onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                    <Tabs
                        sx={{
                            marginRight: "48px",
                            "& .MuiButtonBase-root": {
                                minHeight: "52px",
                            },
                        }}
                        value={tabIndex}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        variant="fullWidth"
                        scrollButtons={true}
                    >
                        {labels.map((label, index) => (
                            <Tab label={label} key={index} />
                        ))}
                    </Tabs>
                </Box>
                <Box
                    sx={{
                        height: 60,
                        position: "relative",
                        zIndex: -1,
                    }}
                    className={`tabSpacer`}
                />
            </div>
            <BugCard>
                {content
                    ? content.map((content, index) => (
                          <TabPanel key={index} value={tabIndex} index={index}>
                              {content}
                          </TabPanel>
                      ))
                    : null}
            </BugCard>
        </>
    );
}
