import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "./Loading";
import DynamicIcon from "../utils/DynamicIcon";
import Box from "@material-ui/core/Box";
import { InstanceContext } from "../data/InstanceList";

const useStyles = makeStyles((theme) => ({
    tilesContainer: {
        flexWrap: 'wrap',
        margin: "0.5rem",
    },
    tile: {
        height: "6em",
        width: '30rem',
        position: "relative",
        display: "flex",
        backgroundColor: "#262626",
        margin: "0.5rem",
        flexDirection: 'row',
        alignItems: 'center'
    },
    tileIcon: {
        color: theme.palette.primary.main,
        width: '3rem',
        height: '3rem',
        margin: '0.5rem 1rem'
    },
    tileTitle: {
        fontSize: '1.2rem'
    }
}));

const HomeTiles = (props) => {
    const classes = useStyles();
    const instanceList = useContext(InstanceContext);

    const renderTile = (item) => {
        if (!item.enabled) {
            return null;
        }
        if (!item.moduleInfo) {
            return null;
        }
        return (
            <Box className={classes.tile} key={item.id}>
                <DynamicIcon className={classes.tileIcon} iconName={item.moduleInfo.icon} />
                <div className={classes.tileTitle}>{item.title}</div>
            </Box>
        );
    };

    const renderTiles = (props) => {
        if (instanceList.status === "loading") {
            return <Loading />;
        }
        return (
            <Box className={classes.tilesContainer} alignContent="flex-start" display="flex">
                {instanceList.data.map((instance) => renderTile(instance))}
            </Box>
        );
    };

    return renderTiles(props);
};

export default HomeTiles;
