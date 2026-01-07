import BugCard from "@core/BugCard";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation, useNavigate } from "react-router-dom";
const TabPanel = ({ children, value, index, fullHeight }) => {
    const hidden = value !== index;
    return (
        <BugCard sx={{ height: !hidden && fullHeight ? "100%" : "auto" }} role="tabpanel" hidden={hidden}>
            {value === index && <>{children}</>}
        </BugCard>
    );
};

export default function BugPanelTabbedForm({
    labels,
    content,
    locations,
    onClose,
    defaultTab = 0,
    contentProps = {},
    sx = {},
    fullHeight = false,
}) {
    const [tabIndex, setTabIndex] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
        if (locations && locations[newIndex] && locations[newIndex] !== location.pathname) {
            navigate(locations[newIndex]);
        }
    };

    if (tabIndex >= content.length) {
        setTabIndex(0);
    }

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
        <Box sx={sx}>
            <div style={{ position: "relative" }}>
                <Box
                    sx={{
                        width: "100%",
                        position: "absolute",
                        backgroundColor: "background.accent",
                    }}
                >
                    {onClose && (
                        <IconButton
                            aria-label="close"
                            sx={{
                                position: "absolute",
                                right: "0px",
                                top: "0px",
                                color: "text.secondary",
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
                            marginRight: onClose ? "48px" : "0px",
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
            <BugCard sx={{ height: fullHeight ? "100%" : "auto" }} {...contentProps}>
                {content
                    ? content.map((content, index) => (
                          <TabPanel fullHeight={fullHeight} key={index} value={tabIndex} index={index}>
                              {content}
                          </TabPanel>
                      ))
                    : null}
            </BugCard>
        </Box>
    );
}
