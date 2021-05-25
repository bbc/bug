import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "./Loading";
import DynamicIcon from "@utils/DynamicIcon";
import Box from "@material-ui/core/Box";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import _ from "lodash";
import panelListGroups from "@utils/panelListGroups";

const useStyles = makeStyles((theme) => ({
    tile: {
        position: "relative",
        display: "flex",
        backgroundColor: "#262626",
        margin: "auto",
        flexDirection: "row",
        alignItems: "center",
        "&:hover": {
            background: "#333",
        },
    },
    groupHeader: {
        fontSize: "0.875rem",
        fontWeight: 500,
        textTransform: "uppercase",
        color: theme.palette.primary.main,
        padding: "12px 12px 6px 12px",
        "@media (max-width:1200px)": {
            paddingLeft: 8,
        },
        "@media (max-width:1024px)": {
            paddingLeft: 4,
        },
        "@media (max-width:600px)": {
            padding: 8,
        },
    },
    tileIcon: {
        color: theme.palette.primary.main,
        width: "3rem",
        height: "3rem",
        margin: "0.6rem 1.5rem",
    },
    tileLink: {
        color: "#cccccc",
        textDecoration: "none",
        "&:hover": {
            color: "#fff",
        },
    },
    tileTitle: {
        fontSize: "1.3rem",
        fontWeight: 500,
    },
    gridItem: {
        padding: 12,
        "@media (max-width:1200px)": {
            padding: 8,
        },
        "@media (max-width:1024px)": {
            padding: 4,
        },
        "@media (max-width:600px)": {
            padding: 0,
            paddingBottom: 1,
        },
        "@media (max-height:400px)": {
            padding: 4,
            paddingBottom: 1,
        },
    },
}));

const HomeTiles = (props) => {
    const classes = useStyles();
    const panelList = useSelector((state) => state.panelList);

    const GroupedTiles = ({ groupedPanels }) => {
        const sortedGroupKeys = _.keys(groupedPanels).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
        return (
            <>
                {sortedGroupKeys.map((groupKey) => (
                    <Grid key={groupKey} className={classes.group}>
                        <div className={classes.groupHeader}>{groupKey}</div>
                        <Tiles panels={groupedPanels[groupKey]}></Tiles>
                    </Grid>
                ))}
            </>
        );
    };

    const Tiles = ({ panels }) => {
        return (
            <Grid container className={classes.gridContainer}>
                {panels.map((panel) => (
                    <Tile panel={panel} key={panel.id} />
                ))}
            </Grid>
        );
    };

    const Tile = ({ panel }) => {
        if (!panel.enabled) {
            return null;
        }
        return (
            <Grid item lg={4} sm={6} xs={12} key={panel.id} className={classes.gridItem}>
                <Link className={classes.tileLink} key={panel.id} to={`/panel/${panel.id}`}>
                    <Box className={classes.tile}>
                        <DynamicIcon className={classes.tileIcon} iconName={panel._module.icon} />
                        <div className={classes.tileTitle}>{panel.title}</div>
                    </Box>
                </Link>
            </Grid>
        );
    };

    const renderTiles = (props) => {
        if (panelList.status === "loading") {
            return <Loading />;
        }
        if (panelList.status === "success") {
            const panelsByGroup = panelListGroups(panelList.data);

            if (Object.keys(panelsByGroup).length === 1) {
                return <Tiles panels={panelList.data} />;
            } else {
                return <GroupedTiles groupedPanels={panelsByGroup} />;
            }
        }
        return null;
    };

    return renderTiles(props);
};

export default HomeTiles;
