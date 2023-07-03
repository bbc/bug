import React from "react";
import BugLoading from "@core/BugLoading";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import panelListGroups from "@utils/panelListGroups";
import HomeTile from "@components/home/HomeTile";
import HomeAddPanel from "@components/home/HomeAddPanel";
import BugRestrictTo from "@core/BugRestrictTo";

const GroupedTiles = ({ groupedPanelArray }) => {
    return (
        <>
            {groupedPanelArray.map((groupArrayItem, index) => (
                <Grid key={index}>
                    {groupArrayItem.group && (
                        <Box
                            sx={{
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                color: "primary.main",
                                padding: "12px 12px 6px 12px",
                                "@media (max-width:1200px)": {
                                    paddingLeft: "8px",
                                },
                                "@media (max-width:1024px)": {
                                    paddingLeft: "4px",
                                },
                                "@media (max-width:600px)": {
                                    padding: "8px",
                                },
                            }}
                        >
                            {groupArrayItem.group}
                        </Box>
                    )}
                    <Tiles panels={groupArrayItem.items}></Tiles>
                </Grid>
            ))}
        </>
    );
};

const Tiles = ({ panels }) => {
    return (
        <Grid container>
            {panels.map((panel) => (
                <BugRestrictTo key={panel.id} panel={panel?.id}>
                    <HomeTile panel={panel} />
                </BugRestrictTo>
            ))}
        </Grid>
    );
};

const HomeTiles = () => {
    const panelList = useSelector((state) => state.panelList);

    return React.useMemo(() => {
        if (panelList.status === "loading") {
            return <BugLoading />;
        }
        if (panelList.status === "success") {
            const activePanelList = panelList.data.filter((p) => p._active);
            const panelsByGroup = panelListGroups(activePanelList);
            if (panelsByGroup.length === 0) {
                return (
                    <BugRestrictTo role="admin">
                        <HomeAddPanel />
                    </BugRestrictTo>
                );
            }
            if (panelsByGroup.length === 1) {
                return (
                    <BugRestrictTo role="user">
                        <Tiles panels={activePanelList} />
                    </BugRestrictTo>
                );
            } else {
                return (
                    <BugRestrictTo role="user">
                        <GroupedTiles groupedPanelArray={panelsByGroup} />
                    </BugRestrictTo>
                );
            }
        }
        return null;
    }, [panelList]);
};

export default HomeTiles;
