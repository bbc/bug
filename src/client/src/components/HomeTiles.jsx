import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "./Loading";
import DynamicIcon from "@utils/DynamicIcon";
import Box from "@material-ui/core/Box";
import { PanelContext } from "@data/PanelList";
import { Link } from "react-router-dom";

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
        alignItems: 'center',
        '&:hover': {
            background: "#333",
        },        
    },
    tileIcon: {
        color: theme.palette.primary.main,
        width: '3rem',
        height: '3rem',
        margin: '0.5rem 1rem'
    },
    tileLink: {
        color: '#cccccc',
        textDecoration: 'none',
        '&:hover': {
            color: '#fff'
        },        
    },
    tileTitle: {
        fontSize: '1.3rem',
        fontWeight: 500,
    }
}));

const HomeTiles = (props) => {
    const classes = useStyles();
    const panelList = useContext(PanelContext);

    const renderTile = (item) => {
        if (!item.enabled) {
            return null;
        }
        return (
            <Link className={classes.tileLink} key={item.id} to={`/panel/${item.id}`}>
                <Box className={classes.tile}>
                    <DynamicIcon className={classes.tileIcon} iconName={item._module_icon} />
                    <div className={classes.tileTitle}>{item.title}</div>
                </Box>
            </Link>
        );
    };

    const renderTiles = (props) => {
        if (panelList.status === "loading") {
            return <Loading />;
        }
        return (
            <Box className={classes.tilesContainer} alignContent="flex-start" display="flex">
                {panelList.data.map((panel) => renderTile(panel))}
            </Box>
        );
    };

    return renderTiles(props);
};

export default HomeTiles;
