import React from "react";
import Loading from "@components/Loading";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import _ from "lodash";
import panelListGroups from "@utils/panelListGroups";
import HomeTile from "@components/home/HomeTile";
import HomeAddPanel from "@components/home/HomeAddPanel";

const HomeTiles = () => {
    const panelList = useSelector((state) => state.panelList);

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
                    <HomeTile panel={panel} key={panel.id} />
                ))}
            </Grid>
        );
    };

    return React.useMemo(() => {
        if (panelList.status === "loading") {
            return <Loading />;
        }
        if (panelList.status === "success") {
            const panelsByGroup = panelListGroups(panelList.data);
            if (panelList.data.length === 0) {
                return <HomeAddPanel />;
            }
            if (panelsByGroup.length === 1) {
                return <Tiles panels={panelList.data} />;
            } else {
                return <GroupedTiles groupedPanelArray={panelsByGroup} />;
            }
        }
        return null;
    }, [panelList]);
};

export default HomeTiles;
