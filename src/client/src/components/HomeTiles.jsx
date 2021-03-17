import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "./Loading";
import DynamicIcon from "../utils/DynamicIcon";
import Box from "@material-ui/core/Box";
import { InstanceContext } from "../data/InstanceList";

const useStyles = makeStyles((theme) => ({
    tilesContainer: {
        display: "inline-block",
    },
    tile: {
        height: "6em",
        position: "relative",
        display: "block",
        backgroundColor: "#262626",
        margin: "0.5rem",
    },
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
                <div className={classes.tileIcon}>
                    <DynamicIcon iconName={item.moduleInfo.icon} />
                </div>
                <div>{item.title}</div>
            </Box>
        );
    };

    const renderTiles = (props) => {
        if (instanceList.status === "loading") {
            return <Loading />;
        }
        return (
            <Box alignContent="flex-start" display="flex">
                {instanceList.data.map((instance) => renderTile(instance))}
            </Box>
        );
    };

    return <div className={classes.tilesContainer}>{renderTiles(props)}</div>;
};

export default HomeTiles;
